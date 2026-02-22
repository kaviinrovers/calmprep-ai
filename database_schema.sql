-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    language TEXT DEFAULT 'english',
    is_premium BOOLEAN DEFAULT false,
    premium_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PDFs Table
CREATE TABLE IF NOT EXISTS pdfs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    text_content TEXT,
    analysis JSONB,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    subject TEXT,
    score NUMERIC,
    total_questions INTEGER,
    details JSONB,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OTP Verification table
CREATE TABLE verification_otps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pdfs_user_id ON pdfs(user_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_verification_otps_email ON verification_otps(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_otps ENABLE ROW LEVEL SECURITY;

-- Setup Policies (using DROP IF EXISTS to avoid errors)
DROP POLICY IF EXISTS "Enable all for server" ON users;
CREATE POLICY "Enable all for server" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for server" ON pdfs;
CREATE POLICY "Enable all for server" ON pdfs FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for server" ON reports;
CREATE POLICY "Enable all for server" ON reports FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for server" ON subscriptions;
CREATE POLICY "Enable all for server" ON subscriptions FOR ALL USING (true);
