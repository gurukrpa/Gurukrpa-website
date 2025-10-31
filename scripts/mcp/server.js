/*
  MCP Server for local development tools
  Tools:
  - filesystem: listFiles, readFile
  - linter: run (eslint)
  - model: runJs, runPython
  - db: supabaseQuery (select/insert/update via REST)
  - api: request (REST/GraphQL)
  - tester: runJest
  - web: validateHtml (using scripts/validateHTML.js)
*/

const { StdioServerTransport, Server } = require('@modelcontextprotocol/sdk');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { validateHtmlString } = require('../validateHTML');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Helper: run a command and collect stdout/stderr
function runCmd(cmd, args, cwd = process.cwd()) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, shell: process.platform === 'win32' });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

// Filesystem tools
async function listFiles({ baseDir = '.', pattern = '' }) {
  const root = path.resolve(process.cwd(), baseDir);
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.isFile()) files.push(path.join(baseDir, e.name));
    if (e.isDirectory()) files.push(path.join(baseDir, e.name + '/'));
  }
  return { files };
}

async function readFile({ filePath, maxBytes = 1024 * 1024 }) {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  const buf = fs.readFileSync(abs);
  const truncated = buf.length > maxBytes;
  const content = buf.slice(0, maxBytes).toString('utf-8');
  return { content, truncated, size: buf.length };
}

// Linter tool: run eslint via CLI
async function runLinter({ targets = ['.'] }) {
  const args = ['eslint', ...targets, '--ext', '.js,.jsx,.ts,.tsx', '--max-warnings=0'];
  const result = await runCmd('npx', args);
  return { exitCode: result.code, stdout: result.stdout, stderr: result.stderr };
}

// Model tools
async function runJsModel({ modulePath, exportName = 'default', args = [] }) {
  const abs = path.resolve(process.cwd(), modulePath);
  if (!fs.existsSync(abs)) throw new Error(`Module not found: ${modulePath}`);
  const mod = require(abs);
  const fn = mod[exportName] || mod;
  if (typeof fn !== 'function') throw new Error(`Export '${exportName}' is not a function`);
  const out = await Promise.resolve(fn(...args));
  return { result: out };
}

async function runPythonModel({ scriptPath, args = [] }) {
  const abs = path.resolve(process.cwd(), scriptPath);
  if (!fs.existsSync(abs)) throw new Error(`Script not found: ${scriptPath}`);
  const result = await runCmd('python', [abs, ...args.map(String)]);
  return { exitCode: result.code, stdout: result.stdout, stderr: result.stderr };
}

// Database tool: Supabase via REST (no admin keys here for safety)
async function supabaseQuery({ table, action = 'select', match = {}, values = {}, limit = 100 }) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_*_KEY in env');

  const endpoint = new URL(`/rest/v1/${table}`, url).toString();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  let method = 'GET';
  let fetchUrl = endpoint;
  let body;

  if (action === 'select') {
    const params = new URLSearchParams({ select: '*', limit: String(limit) });
    for (const [k, v] of Object.entries(match || {})) params.append(k, `eq.${v}`);
    fetchUrl += `?${params.toString()}`;
  } else if (action === 'insert') {
    method = 'POST';
    body = JSON.stringify(values);
  } else if (action === 'update') {
    method = 'PATCH';
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(match || {})) params.append(k, `eq.${v}`);
    fetchUrl += `?${params.toString()}`;
    body = JSON.stringify(values);
  } else if (action === 'delete') {
    method = 'DELETE';
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(match || {})) params.append(k, `eq.${v}`);
    fetchUrl += `?${params.toString()}`;
  } else {
    throw new Error(`Unsupported action: ${action}`);
  }

  const res = await fetch(fetchUrl, { method, headers, body });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { /* keep text */ }
  return { status: res.status, ok: res.ok, data: data ?? text };
}

// API tool: generic REST/GraphQL
async function apiRequest({ url, method = 'GET', headers = {}, body }) {
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { /* ignore */ }
  return { status: res.status, ok: res.ok, data: data ?? text };
}

// Tester tool: run Jest
async function runJest({ jestArgs = [] }) {
  const result = await runCmd('npx', ['jest', ...jestArgs]);
  return { exitCode: result.code, stdout: result.stdout, stderr: result.stderr };
}

// Web inspector tool: validate HTML string or URL
async function validateHtml({ html, url }) {
  let htmlToCheck = html;
  if (!htmlToCheck && url) {
    const res = await fetch(url);
    htmlToCheck = await res.text();
  }
  if (!htmlToCheck) throw new Error('Provide html or url');
  const issues = validateHtmlString(htmlToCheck);
  return { issues };
}

// Start MCP server with registered tools
async function main() {
  const toolNames = [];
  const server = new Server({ name: 'local-dev-mcp', version: '0.1.0' });

  const register = (name, handler) => {
    toolNames.push(name);
    server.tool(name, handler);
  };

  register('filesystem.listFiles', async (params) => listFiles(params || {}));
  register('filesystem.readFile', async (params) => readFile(params || {}));
  register('linter.run', async (params) => runLinter(params || {}));
  register('model.runJs', async (params) => runJsModel(params || {}));
  register('model.runPython', async (params) => runPythonModel(params || {}));
  register('db.supabase', async (params) => supabaseQuery(params || {}));
  register('api.request', async (params) => apiRequest(params || {}));
  register('tester.runJest', async (params) => runJest(params || {}));
  register('web.validateHtml', async (params) => validateHtml(params || {}));

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Optional: lightweight HTTP status endpoint so localhost:PORT is reachable in a browser
  // Usage: node scripts/mcp/server.js --status 8787
  try {
    const args = process.argv.slice(2);
    const idx = args.indexOf('--status');
    const port = idx !== -1 ? Number(args[idx + 1] || 8787) : null;
    if (port && Number.isFinite(port)) {
      const statusServer = http.createServer((req, res) => {
        if (req.url === '/health' || req.url === '/') {
          const body = JSON.stringify({
            status: 'ok',
            transport: 'stdio',
            server: { name: 'local-dev-mcp', version: '0.1.0' },
            tools: toolNames,
            time: new Date().toISOString(),
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(body);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
        }
      });
      statusServer.listen(port, '0.0.0.0', () => {
        console.error(`[MCP] Status server listening on http://localhost:${port} (health endpoint)`);
      });
    }
  } catch (e) {
    console.error('[MCP] Failed to start status server:', e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
