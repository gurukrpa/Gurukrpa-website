# Gurukrpa Website - Spiritual Services Platform

A modern web application clone of AstroBhava, offering authentic online Homa, Puja, and Japa services. Built with Next.js, TypeScript, Supabase, and integrated with Razorpay payment gateway and WhatsApp messaging.

## 🕉️ Features

- **User Authentication**: Secure signup/login with Supabase Auth
- **Admin Dashboard**: Comprehensive admin panel to manage users and bookings
- **Payment Integration**: 
  - Razorpay payment gateway for online payments
  - UPI support through Razorpay
- **WhatsApp Integration**: Direct WhatsApp messaging for customer support
- **Service Management**: Browse and book Homa, Puja, and Japa services
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Razorpay account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gurukrpa/Gurukrpa-website.git
   cd "gurukrpa website"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://yavokvrcskbxhotpcejo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   WHATSAPP_BUSINESS_NUMBER=919629555442
   WHATSAPP_API_KEY=your_whatsapp_api_key
   ```

4. **Set up Supabase Database**

   Run the SQL schema in your Supabase SQL Editor:
   ```bash
   # The schema file is located at: supabase/schema.sql
   ```

   Or manually execute:
   - Go to Supabase Dashboard > SQL Editor
   - Copy the contents of `supabase/schema.sql`
   - Execute the SQL

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
gurukrpa website/
├── pages/
│   ├── api/
│   │   ├── payment/
│   │   │   ├── create-order.ts
│   │   │   └── verify-payment.ts
│   │   └── whatsapp/
│   │       └── send-message.ts
│   ├── admin/
│   │   └── dashboard.tsx
│   ├── auth/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── lib/
│   └── supabase.ts
├── styles/
│   └── globals.css
├── types/
│   └── database.types.ts
├── supabase/
│   └── schema.sql
├── public/
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔐 Supabase Configuration

### Project Details
- **Project Name**: Gurukrpa website
- **Project ID**: yavokvrcskbxhotpcejo
- **URL**: https://yavokvrcskbxhotpcejo.supabase.co

### Database Tables

1. **users**: Stores user information
   - id (UUID, Primary Key)
   - email (TEXT, Unique)
   - full_name (TEXT)
   - phone (TEXT)
   - created_at (TIMESTAMP)
   - last_login (TIMESTAMP)

2. **bookings**: Stores service bookings
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key)
   - service_type (TEXT)
   - service_name (TEXT)
   - amount (NUMERIC)
   - payment_status (TEXT)
   - razorpay_order_id (TEXT)
   - razorpay_payment_id (TEXT)
   - created_at (TIMESTAMP)

## 💳 Payment Integration (Razorpay)

### Setup Steps

1. **Create a Razorpay Account**
   - Go to [https://razorpay.com](https://razorpay.com)
   - Sign up and verify your account
   - Get your API keys from Dashboard > Settings > API Keys

2. **Test Mode**
   - Use test keys for development
   - Test cards are available in Razorpay documentation

3. **UPI Integration**
   - UPI is automatically available through Razorpay
   - No additional setup required

### Payment Flow

1. User selects a service
2. Frontend calls `/api/payment/create-order` to create Razorpay order
3. Razorpay checkout modal opens
4. User completes payment
5. Payment verification happens via `/api/payment/verify-payment`
6. Booking status is updated in Supabase

## 📱 WhatsApp Integration

### Option 1: Direct WhatsApp Link (Current Implementation)
- Uses `wa.me` links to open WhatsApp
- No API key required
- Works on all devices

### Option 2: WhatsApp Business API
For advanced features, integrate with:
- **Twilio**: [https://www.twilio.com/whatsapp](https://www.twilio.com/whatsapp)
- **WATI**: [https://www.wati.io](https://www.wati.io)
- **WhatsApp Business API**: Direct integration

## 👨‍💼 Admin Dashboard

Access the admin dashboard at `/admin/dashboard`

**Features:**
- View all registered users
- Monitor bookings and payments
- Track revenue statistics
- Search and filter capabilities

**Admin Access:**
- Currently, any email containing "admin" can access the dashboard
- Recommended: Implement role-based access control (RBAC) in production

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Adding New Services

1. Create service pages in `pages/` directory
2. Add service data to Supabase
3. Update navigation in `pages/index.tsx`
4. Create booking flow with payment integration

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production

Make sure to add all environment variables in your hosting platform:
- Supabase credentials
- Razorpay keys (live keys for production)
- WhatsApp configuration

## 🔒 Security Considerations

1. **Never commit `.env.local`** to version control
2. Use **Row Level Security (RLS)** in Supabase for all tables
3. Implement **rate limiting** for API routes
4. Use **HTTPS** in production
5. Validate all inputs on both client and server
6. Implement **CORS** policies properly

## 📝 TODO / Roadmap

- [ ] Add service catalog pages (Homa, Puja, Japa)
- [ ] Implement user dashboard
- [ ] Add booking history
- [ ] Email notifications for bookings
- [ ] SMS notifications via Twilio
- [ ] Advanced admin features (reports, analytics)
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Blog/Articles section
- [ ] Testimonials management
- [ ] Live streaming integration for ceremonies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

- **Phone**: +91 96295 55442
- **WhatsApp**: [Click here](https://wa.me/919629555442)
- **Website**: [Coming Soon]

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- Inspired by AstroBhava.com
- Built with Next.js and Supabase
- UI styled with Tailwind CSS
- Icons from React Icons

---

**Made with 🕉️ for Gurukrpa**
