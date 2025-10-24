export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          last_login?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_type: string
          service_name: string
          amount: number
          payment_status: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_type: string
          service_name: string
          amount: number
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_type?: string
          service_name?: string
          amount?: number
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
