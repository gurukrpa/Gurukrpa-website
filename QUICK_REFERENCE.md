# 🚀 Gurukrpa Website - Quick Reference Card

## ⚡ Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌐 URLs

- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/auth/login
- **Signup**: http://localhost:3000/auth/signup
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Razorpay Dashboard**: https://dashboard.razorpay.com

## 🔑 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yavokvrcskbxhotpcejo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# WhatsApp
WHATSAPP_BUSINESS_NUMBER=919629555442
```

## 🧪 Test Data

### Razorpay Test Cards
- **Success Card**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **OTP**: 123456

### UPI Test
- **UPI ID**: success@razorpay

### Admin Access
- Email must contain "admin"
- Example: admin@gurukrpa.com

## 📁 Key Files

```
pages/
├── index.tsx              # Homepage
├── auth/
│   ├── login.tsx          # Login page
│   └── signup.tsx         # Signup page
├── admin/
│   └── dashboard.tsx      # Admin panel
└── api/
    ├── payment/           # Payment APIs
    └── whatsapp/          # WhatsApp APIs

lib/
└── supabase.ts            # Supabase config

supabase/
└── schema.sql             # Database schema

.env.local                 # Environment vars
```

## 🗃️ Database Tables

### users
- id (UUID)
- email (TEXT)
- full_name (TEXT)
- phone (TEXT)
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)

### bookings
- id (UUID)
- user_id (UUID)
- service_type (TEXT)
- service_name (TEXT)
- amount (NUMERIC)
- payment_status (TEXT)
- razorpay_order_id (TEXT)
- razorpay_payment_id (TEXT)
- created_at (TIMESTAMP)

## 🎨 Colors

- **Primary**: #ff6b35 (Orange)
- **Secondary**: #f7931e (Gold)
- **Divine**: #8b4513 (Brown)

## 📞 Quick Contact

- **Phone**: +91 96295 55442
- **WhatsApp**: https://wa.me/919629555442
- **GitHub**: https://github.com/gurukrpa/Gurukrpa-website.git

## 🐛 Common Errors & Fixes

### "npm not recognized"
→ Install Node.js from https://nodejs.org

### Port 3000 in use
→ `netstat -ano | findstr :3000` then kill process

### Module not found
→ Delete node_modules, run `npm install`

### Supabase error
→ Check .env.local credentials

### Payment fails
→ Use test mode Razorpay keys

## 📖 Documentation

1. **README.md** - Complete documentation
2. **INSTALLATION.md** - Step-by-step setup
3. **SETUP.md** - Quick setup guide
4. **PROJECT_SUMMARY.md** - Feature overview
5. **QUICK_REFERENCE.md** - This file

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] `npm install` completed
- [ ] .env.local configured
- [ ] Supabase schema executed
- [ ] Razorpay account created
- [ ] Test server running
- [ ] Can access homepage
- [ ] Can create account
- [ ] Can login
- [ ] Admin dashboard works

## 🚀 Next Tasks

1. **Add Service Pages**
   - Create Homa services list
   - Create Puja services list
   - Create Japa services list

2. **Build Booking System**
   - Service detail page
   - Booking form
   - Payment integration

3. **User Dashboard**
   - Profile page
   - Booking history
   - Order tracking

4. **Content**
   - About page
   - Contact page
   - Terms & Privacy

## 💡 Tips

- **Hot Reload**: Changes auto-refresh
- **Browser Console**: F12 for errors
- **Terminal**: Watch for build errors
- **Git**: Commit frequently
- **Backup**: Keep .env.local safe

## 🎯 Key Features

✅ User Authentication (Supabase)
✅ Admin Dashboard
✅ Razorpay Payments (UPI + Cards)
✅ WhatsApp Integration
✅ Responsive Design
✅ TypeScript
✅ Tailwind CSS

---

**🕉️ Gurukrpa - Divine Services Online**

Keep this file handy for quick reference!
