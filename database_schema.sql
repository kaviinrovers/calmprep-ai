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

-- Create Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT NOT NULL,
    razorpay_signature TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Setup Policies (using DROP IF EXISTS to avoid errors)
DROP POLICY IF EXISTS "Enable all for server" ON users;
CREATE POLICY "Enable all for server" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for server" ON pdfs;
CREATE POLICY "Enable all for server" ON pdfs FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for server" ON reports;
CREATE POLICY "Enable all for server" ON reports FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for server" ON subscriptions;
CREATE POLICY "Enable all for server" ON subscriptions FOR ALL USING (true);
