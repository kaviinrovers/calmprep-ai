-- Create Users Table
CREATE TABLE users (
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
CREATE TABLE pdfs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    text_content TEXT,
    analysis JSONB,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Reports Table (Progress tracking)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'quiz', 'viva', etc.
    subject TEXT,
    score NUMERIC,
    total_questions INTEGER,
    details JSONB, -- stores unitsCovered, strongAreas, weakAreas, etc.
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (Optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Note: You may need to create policies to allow users to see only their own data
-- For example:
-- CREATE POLICY "Users can only see their own data" ON users FOR SELECT USING (auth.uid() = id);
