# Gurukrpa Website - Setup Instructions

## Quick Start Guide

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```powershell
npm install
```

This will install all required packages including:
- Next.js
- React
- Supabase client
- Razorpay
- Tailwind CSS
- TypeScript
- React Icons

### Step 2: Set Up Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project: **yavokvrcskbxhotpcejo**
3. Go to **SQL Editor** in the left sidebar
4. Open the file `supabase/schema.sql` from this project
5. Copy all the SQL code
6. Paste it in the SQL Editor
7. Click **Run** to execute

This will create:
- `users` table with authentication
- `bookings` table for service bookings
- Row Level Security (RLS) policies
- Database triggers for automatic user creation

### Step 3: Configure Razorpay

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or login
3. Go to **Settings** > **API Keys**
4. For testing, use **Test Mode** keys
5. Copy the **Key ID** and **Key Secret**
6. Update `.env.local` file:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_key_secret
   ```

**Note**: For production, generate live keys and enable UPI/Cards in Razorpay settings.

### Step 4: Run the Development Server

```powershell
npm run dev
```

The website will open at: **http://localhost:3000**

### Step 5: Create Admin Account

1. Go to http://localhost:3000/auth/signup
2. Register with an email containing "admin" (e.g., admin@gurukrpa.com)
3. Complete the signup process
4. Login and access admin dashboard at http://localhost:3000/admin/dashboard

### Step 6: Testing Payments

Use Razorpay test cards:
- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **OTP**: 123456

For UPI testing:
- Use test UPI ID: success@razorpay
- This will simulate successful payment

### Step 7: WhatsApp Integration

The WhatsApp button is already configured with: **+91 96295 55442**

To change the number:
1. Open `.env.local`
2. Update: `WHATSAPP_BUSINESS_NUMBER=your_number`
3. Restart the dev server

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Run `npm install` again

### Issue: Supabase connection error
**Solution**: Check `.env.local` has correct Supabase credentials

### Issue: Payment not working
**Solution**: Verify Razorpay keys are in test mode and correct

### Issue: Can't access admin dashboard
**Solution**: Make sure your email contains "admin" in the address

## Project Structure

```
📁 gurukrpa website
├── 📁 pages
│   ├── 📄 index.tsx (Homepage)
│   ├── 📁 auth
│   │   ├── 📄 login.tsx
│   │   └── 📄 signup.tsx
│   ├── 📁 admin
│   │   └── 📄 dashboard.tsx
│   └── 📁 api
│       ├── 📁 payment
│       └── 📁 whatsapp
├── 📁 lib
│   └── 📄 supabase.ts
├── 📁 styles
│   └── 📄 globals.css
├── 📁 supabase
│   └── 📄 schema.sql
├── 📄 .env.local (Environment variables)
├── 📄 package.json
└── 📄 README.md
```

## Next Steps

### Phase 1: Core Features ✅ (COMPLETED)
- [x] Project setup with Next.js + TypeScript
- [x] Supabase authentication
- [x] User signup/login pages
- [x] Admin dashboard
- [x] Razorpay payment integration
- [x] WhatsApp integration

### Phase 2: Service Pages (TO DO)
- [ ] Create Homa services page
- [ ] Create Puja services page
- [ ] Create Japa services page
- [ ] Service detail pages
- [ ] Booking flow

### Phase 3: User Features (TO DO)
- [ ] User dashboard
- [ ] Booking history
- [ ] Profile management
- [ ] Order tracking

### Phase 4: Advanced Features (TO DO)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Live ceremony streaming
- [ ] Reviews and testimonials
- [ ] Blog section

## Support

For any issues or questions:
- WhatsApp: [+91 96295 55442](https://wa.me/919629555442)
- Check the main README.md for detailed documentation

---

**Ready to Build!** 🚀

Run `npm run dev` and start developing your spiritual services platform!
