# 🚀 Complete Installation Guide - Gurukrpa Website

## Prerequisites Installation

### Step 1: Install Node.js and npm

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version (recommended)
   - Choose Windows installer (.msi)

2. **Install Node.js**
   - Run the downloaded installer
   - Click "Next" through the installation wizard
   - Make sure "npm package manager" is checked
   - Complete the installation

3. **Verify Installation**
   Open PowerShell or Command Prompt and run:
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v20.11.0 and 10.2.4)

4. **Restart your computer** to ensure PATH variables are updated

---

## Project Setup

### Step 2: Install Project Dependencies

1. **Open PowerShell** in the project folder
   - Navigate to: `C:\Users\asus\Desktop\gurukrpa website`
   - Or right-click folder and select "Open in Terminal"

2. **Run installation command**
   ```powershell
   npm install
   ```
   
   This will install:
   - Next.js framework
   - React and React DOM
   - Supabase client for database
   - Razorpay for payments
   - Tailwind CSS for styling
   - TypeScript
   - React Icons
   - All other dependencies

   **Note**: This may take 2-5 minutes depending on your internet speed.

3. **Wait for completion**
   You'll see a progress bar and "added XXX packages" when done.

---

## Database Setup

### Step 3: Configure Supabase Database

1. **Login to Supabase**
   - Go to: https://app.supabase.com
   - Login with your credentials
   - Your project is already created: **yavokvrcskbxhotpcejo**

2. **Run Database Schema**
   - Click on your project
   - Go to **SQL Editor** (left sidebar)
   - Click **New Query**
   - Open `supabase/schema.sql` from this project
   - Copy the entire SQL code
   - Paste into Supabase SQL Editor
   - Click **Run** button

3. **Verify Tables Created**
   - Go to **Table Editor** (left sidebar)
   - You should see:
     - `users` table
     - `bookings` table

---

## Payment Gateway Setup

### Step 4: Setup Razorpay Account

1. **Create Razorpay Account**
   - Go to: https://razorpay.com
   - Click "Sign Up"
   - Complete registration
   - Verify your email and phone

2. **Get API Keys**
   - Login to Razorpay Dashboard
   - Go to **Settings** > **API Keys**
   - Switch to **Test Mode** (for development)
   - Click **Generate Test Keys**
   - You'll get:
     - Key ID (starts with `rzp_test_`)
     - Key Secret

3. **Update Environment Variables**
   - Open `.env.local` file in the project
   - Replace the placeholder values:
     ```env
     NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
     RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
     ```

4. **Enable Payment Methods**
   - In Razorpay Dashboard > Settings > Payment Methods
   - Enable: UPI, Cards, Net Banking
   - Save settings

---

## Run the Project

### Step 5: Start Development Server

1. **Open Terminal** in project folder

2. **Start the server**
   ```powershell
   npm run dev
   ```

3. **Wait for compilation**
   You'll see:
   ```
   - ready started server on 0.0.0.0:3000, url: http://localhost:3000
   - event compiled client and server successfully
   ```

4. **Open Browser**
   - Go to: http://localhost:3000
   - You should see the Gurukrpa homepage

---

## Testing the Application

### Step 6: Test Core Features

#### A. Test User Registration
1. Go to: http://localhost:3000/auth/signup
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +91 9876543210
   - Password: test123
3. Click "Sign Up"
4. Check Supabase Table Editor > users table to see the new user

#### B. Test Login
1. Go to: http://localhost:3000/auth/login
2. Enter the email and password from above
3. Click "Login"
4. Should redirect to homepage (logged in)

#### C. Test Admin Dashboard
1. Create another account with admin email:
   - Email: admin@gurukrpa.com
   - Password: admin123
2. Login with this account
3. Go to: http://localhost:3000/admin/dashboard
4. You should see:
   - User list
   - Bookings list
   - Statistics

#### D. Test Payment (Using Test Mode)
When you implement booking pages:
- Use Razorpay test cards:
  - Card: 4111 1111 1111 1111
  - CVV: 123
  - Expiry: Any future date
  - Name: Any name

#### E. Test WhatsApp
- Click the green WhatsApp floating button (bottom-right)
- Should open WhatsApp with pre-filled message
- Number: +91 96295 55442

---

## Common Issues and Solutions

### Issue 1: "npm is not recognized"
**Solution**: 
- Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart computer
- Try again

### Issue 2: "Module not found" errors
**Solution**:
```powershell
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue 3: Port 3000 already in use
**Solution**:
```powershell
# Kill the process
netstat -ano | findstr :3000
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue 4: Supabase connection error
**Solution**:
- Check `.env.local` file exists
- Verify Supabase URL and keys are correct
- Restart dev server after changing .env

### Issue 5: TypeScript errors
**Solution**:
```powershell
# Rebuild the project
npm run build
```

### Issue 6: Tailwind CSS not working
**Solution**:
- Check `tailwind.config.js` exists
- Check `postcss.config.js` exists
- Restart dev server
- Clear browser cache (Ctrl + Shift + R)

---

## Development Workflow

### Daily Development Routine

1. **Start Development**
   ```powershell
   cd "C:\Users\asus\Desktop\gurukrpa website"
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `pages/`, `components/`, etc.
   - Changes auto-reload in browser (Hot Module Replacement)

3. **Check for Errors**
   - Watch terminal for errors
   - Check browser console (F12)

4. **Test Changes**
   - Test in browser
   - Test on mobile (use http://your-ip:3000)

5. **Stop Server**
   - Press `Ctrl + C` in terminal
   - Confirm with `Y` if prompted

### Git Workflow

```powershell
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

---

## Production Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```powershell
   vercel login
   ```

3. **Deploy**
   ```powershell
   vercel
   ```

4. **Add Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Settings > Environment Variables
   - Add all variables from `.env.local`
   - Use **Production** Razorpay keys (not test)

5. **Deploy to Production**
   ```powershell
   vercel --prod
   ```

### Alternative: Deploy to Netlify

1. **Build the project**
   ```powershell
   npm run build
   ```

2. **Install Netlify CLI**
   ```powershell
   npm install -g netlify-cli
   ```

3. **Deploy**
   ```powershell
   netlify deploy --prod
   ```

---

## Environment Variables Reference

### Development (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yavokvrcskbxhotpcejo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Razorpay (Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# WhatsApp
WHATSAPP_BUSINESS_NUMBER=919629555442
WHATSAPP_API_KEY=optional_for_business_api
```

### Production (Vercel/Netlify)
```env
# Use same variables but with:
# - Production Razorpay keys (rzp_live_...)
# - Same Supabase keys (they work for production too)
```

---

## Next Development Tasks

### Priority 1: Service Pages
- [ ] Create `/pages/homa/index.tsx` - List all Homa services
- [ ] Create `/pages/puja/index.tsx` - List all Puja services
- [ ] Create `/pages/japa/index.tsx` - List all Japa services
- [ ] Create service detail pages with booking

### Priority 2: Booking System
- [ ] Create booking form component
- [ ] Integrate Razorpay checkout
- [ ] Save bookings to Supabase
- [ ] Send confirmation emails

### Priority 3: User Dashboard
- [ ] Create user dashboard page
- [ ] Show booking history
- [ ] Profile management
- [ ] Download receipts

### Priority 4: Content
- [ ] Add actual service data
- [ ] Add images for services
- [ ] Create about page
- [ ] Add terms and privacy policy

---

## Support and Resources

### Documentation
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Razorpay**: https://razorpay.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Video Tutorials
- Next.js Crash Course: https://www.youtube.com/watch?v=mTz0GXj8NN0
- Supabase Tutorial: https://www.youtube.com/watch?v=7uKQBl9uZ00
- Razorpay Integration: https://www.youtube.com/watch?v=KFUWA9JN3T4

### Get Help
- **WhatsApp**: +91 96295 55442
- **GitHub Issues**: Create issue in repository
- **Stack Overflow**: Tag with `next.js`, `supabase`, `razorpay`

---

## Project Checklist

### Setup Checklist
- [ ] Node.js installed (v18+)
- [ ] npm working in terminal
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase database schema executed
- [ ] .env.local file configured
- [ ] Razorpay test account created
- [ ] Development server running (`npm run dev`)

### Testing Checklist
- [ ] Homepage loads correctly
- [ ] Can create new account
- [ ] Can login
- [ ] Admin dashboard accessible
- [ ] WhatsApp button opens WhatsApp

### Production Checklist
- [ ] All features tested
- [ ] Razorpay production keys added
- [ ] Database policies reviewed
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Analytics setup (optional)
- [ ] Backup strategy in place

---

## Congratulations! 🎉

You're now ready to develop the Gurukrpa website!

**Next Steps**:
1. Complete the setup checklist above
2. Test all features
3. Start building service pages
4. Customize design and content
5. Deploy to production

**Questions?** Contact via WhatsApp: +91 96295 55442

---

*Made with 🕉️ for Gurukrpa - Bringing Divine Services Online*
