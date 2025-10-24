# 🗺️ Gurukrpa Website - Project Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Home   │  │  Login   │  │  Signup  │  │  Admin   │      │
│  │   Page   │  │   Page   │  │   Page   │  │Dashboard │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│       │             │              │              │            │
│       └─────────────┴──────────────┴──────────────┘            │
│                         │                                      │
│                    Next.js App                                 │
│                         │                                      │
└─────────────────────────┼───────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │   Razorpay   │  │   WhatsApp   │
│   Database   │  │   Payments   │  │  Messaging   │
├──────────────┤  ├──────────────┤  ├──────────────┤
│              │  │              │  │              │
│ • Users      │  │ • Orders     │  │ • Direct     │
│ • Bookings   │  │ • Payments   │  │   Links      │
│ • Auth       │  │ • UPI        │  │ • wa.me      │
│ • Storage    │  │ • Cards      │  │ • API Ready  │
│              │  │ • NetBanking │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Data Flow Diagram

### User Registration Flow
```
User (Browser)
    │
    ├─ Fills Signup Form
    │
    ▼
Next.js Frontend
    │
    ├─ Validates Input
    │
    ▼
Supabase Auth API
    │
    ├─ Creates Auth User
    │
    ▼
Database Trigger
    │
    ├─ Creates User Profile
    │
    ▼
Users Table (Supabase)
    │
    └─ Returns Success → User Logged In
```

### Payment Flow
```
User Selects Service
    │
    ▼
Next.js Frontend
    │
    ├─ Collects Booking Info
    │
    ▼
API: /api/payment/create-order
    │
    ├─ Creates Razorpay Order
    │
    ▼
Razorpay Checkout Modal
    │
    ├─ User Enters Payment Details
    ├─ Completes Payment
    │
    ▼
API: /api/payment/verify-payment
    │
    ├─ Verifies Signature
    ├─ Updates Booking Status
    │
    ▼
Bookings Table (Supabase)
    │
    └─ Booking Confirmed → Send Confirmation
```

### Admin Dashboard Flow
```
Admin Logs In
    │
    ▼
Check Admin Rights
    │
    ├─ Email contains "admin"?
    │
    ▼ (Yes)
Admin Dashboard
    │
    ├─ Fetch Users (Supabase)
    ├─ Fetch Bookings (Supabase)
    ├─ Calculate Stats
    │
    ▼
Display Tables & Charts
    │
    ├─ Users Table
    ├─ Bookings Table
    ├─ Revenue Stats
    └─ Search & Filter
```

## File Structure Tree

```
gurukrpa-website/
│
├── 📂 pages/                    # Next.js Pages
│   ├── 📄 index.tsx             # Homepage (/)
│   ├── 📄 _app.tsx              # App wrapper
│   ├── 📄 _document.tsx         # HTML document
│   │
│   ├── 📂 auth/                 # Authentication
│   │   ├── 📄 login.tsx         # /auth/login
│   │   └── 📄 signup.tsx        # /auth/signup
│   │
│   ├── 📂 admin/                # Admin Section
│   │   └── 📄 dashboard.tsx    # /admin/dashboard
│   │
│   └── 📂 api/                  # API Routes
│       ├── 📂 payment/
│       │   ├── 📄 create-order.ts
│       │   └── 📄 verify-payment.ts
│       └── 📂 whatsapp/
│           └── 📄 send-message.ts
│
├── 📂 lib/                      # Utilities
│   └── 📄 supabase.ts           # Supabase client
│
├── 📂 types/                    # TypeScript Types
│   └── 📄 database.types.ts     # Database schema types
│
├── 📂 styles/                   # Styling
│   └── 📄 globals.css           # Global CSS + Tailwind
│
├── 📂 supabase/                 # Database
│   └── 📄 schema.sql            # SQL schema
│
├── 📂 public/                   # Static files
│   ├── 📄 favicon.ico
│   └── 📂 images/
│
├── 📄 .env.local                # Environment variables
├── 📄 .gitignore                # Git ignore
├── 📄 package.json              # Dependencies
├── 📄 tsconfig.json             # TypeScript config
├── 📄 tailwind.config.js        # Tailwind config
├── 📄 next.config.js            # Next.js config
├── 📄 postcss.config.js         # PostCSS config
│
├── 📄 README.md                 # Main docs
├── 📄 INSTALLATION.md           # Installation guide
├── 📄 SETUP.md                  # Quick setup
├── 📄 PROJECT_SUMMARY.md        # Feature summary
├── 📄 QUICK_REFERENCE.md        # Quick reference
└── 📄 ARCHITECTURE.md           # This file
```

## Component Hierarchy

```
App (_app.tsx)
│
├── Head (Metadata)
│
├── Header (Navigation)
│   ├── Logo
│   ├── Nav Menu
│   │   ├── Home
│   │   ├── Homa
│   │   ├── Puja
│   │   ├── Japa
│   │   └── Contact
│   └── Auth Buttons
│       ├── Login
│       └── Signup
│
├── Main Content (Pages)
│   │
│   ├── Homepage
│   │   ├── Hero Section
│   │   ├── Services Grid
│   │   ├── Stats Section
│   │   └── CTA Section
│   │
│   ├── Auth Pages
│   │   ├── Login Form
│   │   └── Signup Form
│   │
│   └── Admin Dashboard
│       ├── Stats Cards
│       ├── Search Bar
│       └── Data Tables
│           ├── Users Tab
│           └── Bookings Tab
│
├── Footer
│   ├── About Links
│   ├── Service Links
│   ├── Contact Info
│   └── Social Media
│
└── Floating Buttons
    └── WhatsApp Button
```

## Database Schema Relationships

```
┌─────────────────────┐
│      auth.users     │  (Supabase Auth)
│─────────────────────│
│ id (UUID) PK        │
│ email               │
│ encrypted_password  │
└─────────┬───────────┘
          │
          │ 1:1
          ▼
┌─────────────────────┐
│    public.users     │
│─────────────────────│
│ id (UUID) PK/FK     │◄────────┐
│ email               │         │
│ full_name           │         │
│ phone               │         │
│ created_at          │         │
│ last_login          │         │
└─────────────────────┘         │
          │                     │
          │ 1:Many              │ Many:1
          ▼                     │
┌─────────────────────┐         │
│   public.bookings   │         │
│─────────────────────│         │
│ id (UUID) PK        │         │
│ user_id (FK)        │─────────┘
│ service_type        │
│ service_name        │
│ amount              │
│ payment_status      │
│ razorpay_order_id   │
│ razorpay_payment_id │
│ created_at          │
└─────────────────────┘
```

## API Endpoints Map

```
/api/
│
├── /payment/
│   ├── POST /create-order       # Create Razorpay order
│   │   ├── Input: { amount, currency, receipt, notes }
│   │   └── Output: { id, amount, currency, order_id }
│   │
│   └── POST /verify-payment     # Verify payment signature
│       ├── Input: { razorpay_order_id, razorpay_payment_id, 
│       │           razorpay_signature, booking_id }
│       └── Output: { success: true/false }
│
└── /whatsapp/
    └── POST /send-message       # Send WhatsApp message
        ├── Input: { phone, message, name }
        └── Output: { success, whatsappUrl }
```

## Security Model

```
┌─────────────────────────────────────────┐
│           Security Layers               │
├─────────────────────────────────────────┤
│                                         │
│  1. Next.js Middleware                  │
│     • Route protection                  │
│     • Auth state checking               │
│                                         │
│  2. Supabase Auth                       │
│     • JWT tokens                        │
│     • Session management                │
│     • Email verification                │
│                                         │
│  3. Row Level Security (RLS)            │
│     • User can view own data            │
│     • Admin has elevated access         │
│     • Automatic policy enforcement      │
│                                         │
│  4. API Route Protection                │
│     • Server-side validation            │
│     • Payment signature verification    │
│     • Rate limiting (to implement)      │
│                                         │
│  5. Environment Variables               │
│     • Secrets in .env.local             │
│     • Never committed to Git            │
│     • Server-only variables             │
│                                         │
└─────────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
Local Machine
    │
    ├── npm run dev
    │
    ▼
Next.js Dev Server (Port 3000)
    │
    ├── Hot Module Replacement
    ├── Fast Refresh
    │
    ▼
Browser (localhost:3000)
```

### Production (Vercel)
```
Git Repository (GitHub)
    │
    ├── git push
    │
    ▼
Vercel Build System
    │
    ├── Install Dependencies
    ├── Build Next.js App
    ├── Optimize Assets
    │
    ▼
Vercel Edge Network (CDN)
    │
    ├── Static Files Cached
    ├── API Routes on Serverless
    │
    ▼
Users Worldwide
    │
    └── Fast, Global Access
```

## Integration Points

```
┌────────────────────────────────────────────────┐
│            External Services                   │
├────────────────────────────────────────────────┤
│                                                │
│  🗄️ Supabase                                   │
│     • Database (PostgreSQL)                    │
│     • Authentication                           │
│     • Storage (for images)                     │
│     • Realtime (subscriptions)                 │
│                                                │
│  💳 Razorpay                                    │
│     • Payment Gateway                          │
│     • Order Management                         │
│     • UPI, Cards, NetBanking                   │
│     • Webhooks (status updates)                │
│                                                │
│  💬 WhatsApp                                    │
│     • Direct wa.me links                       │
│     • Business API (upgradable)                │
│     • Automated messages                       │
│                                                │
│  🚀 Vercel (Hosting)                           │
│     • Next.js optimized                        │
│     • Serverless functions                     │
│     • CDN & Edge network                       │
│     • Automatic SSL                            │
│                                                │
└────────────────────────────────────────────────┘
```

## State Management

```
Application State Flow
│
├── Authentication State
│   ├── Managed by: Supabase Auth
│   ├── Stored in: Browser localStorage
│   ├── Synced to: Server sessions
│   └── Accessed via: supabase.auth hooks
│
├── User Data State
│   ├── Fetched from: Supabase Database
│   ├── Cached in: React state (useState)
│   ├── Updates: Real-time subscriptions
│   └── Persisted to: PostgreSQL
│
├── UI State
│   ├── Managed by: React hooks
│   ├── Examples: Modal open/close, tabs
│   └── Not persisted
│
└── Form State
    ├── Managed by: Controlled components
    ├── Validated: Client & server-side
    └── Submitted to: API routes
```

## Performance Optimization

```
┌─────────────────────────────────────────┐
│        Performance Features             │
├─────────────────────────────────────────┤
│                                         │
│  ⚡ Server-Side Rendering (SSR)         │
│     • Fast initial page load            │
│     • SEO friendly                      │
│                                         │
│  🎯 Static Generation                   │
│     • Pre-built pages                   │
│     • Instant loading                   │
│                                         │
│  🔄 Incremental Static Regeneration     │
│     • Update without rebuild            │
│     • Best of both worlds               │
│                                         │
│  📦 Code Splitting                      │
│     • Load only needed code             │
│     • Automatic optimization            │
│                                         │
│  🖼️ Image Optimization                  │
│     • Next.js Image component           │
│     • Lazy loading                      │
│     • WebP format                       │
│                                         │
│  💾 Caching                             │
│     • Browser cache                     │
│     • CDN cache (Vercel)                │
│     • API response cache                │
│                                         │
└─────────────────────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
    │
    ├─ Frontend Error
    │   ├─ Caught by try/catch
    │   ├─ Display user-friendly message
    │   ├─ Log to console (dev)
    │   └─ Send to error tracking (prod)
    │
    ├─ API Error
    │   ├─ Return error response
    │   ├─ HTTP status code
    │   ├─ Error message
    │   └─ Log server-side
    │
    ├─ Database Error
    │   ├─ Supabase error codes
    │   ├─ Retry logic
    │   └─ Fallback behavior
    │
    └─ Payment Error
        ├─ Razorpay error codes
        ├─ User notification
        ├─ Booking status update
        └─ Admin alert
```

---

## 📊 Scalability Considerations

### Current Capacity
- **Users**: Up to 10,000 (Supabase free tier)
- **Requests**: Unlimited (Vercel)
- **Database**: 500MB (Supabase free tier)
- **Payments**: Unlimited (Razorpay)

### Scaling Strategy
1. **Upgrade Supabase** to Pro ($25/month)
   - 8GB database
   - 50GB bandwidth
   - Daily backups

2. **Upgrade Vercel** to Pro ($20/month)
   - More bandwidth
   - Advanced analytics
   - Team collaboration

3. **Add Caching Layer**
   - Redis for sessions
   - CDN for assets
   - Database query caching

4. **Optimize Queries**
   - Database indexes
   - Pagination
   - Lazy loading

---

## 🔄 CI/CD Pipeline (Future)

```
Git Push
    │
    ▼
GitHub Actions
    │
    ├─ Run Tests
    ├─ Run Linter
    ├─ Type Check
    │
    ▼
Build Success?
    │
    ├─ No  → Notify Team
    │
    ├─ Yes → Deploy to Staging
    │           │
    │           ▼
    │       Run E2E Tests
    │           │
    │           ▼
    │       Manual Approval?
    │           │
    │           ▼
    │       Deploy to Production
    │           │
    │           ▼
    │       Smoke Tests
    │           │
    │           ▼
    │       Monitor Performance
    │
    └─ Send Notifications
```

---

**🕉️ Gurukrpa Architecture**

*A modern, scalable platform for spiritual services*

---

This architecture is designed to be:
- ✅ Scalable (can handle growth)
- ✅ Secure (multiple security layers)
- ✅ Maintainable (clean code structure)
- ✅ Fast (optimized performance)
- ✅ Reliable (error handling)

**Need to understand a specific component?**
Refer to the respective documentation files!
