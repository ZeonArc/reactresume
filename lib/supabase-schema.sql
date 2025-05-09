-- Enable Row Level Security
ALTER DATABASE postgres
SET request.claims.sub TO 'postgres';
-- Create the skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create the domains table
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create the courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    link TEXT NOT NULL,
    duration TEXT,
    rating DECIMAL(3, 1),
    description TEXT,
    domain_id UUID REFERENCES domains(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create the resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    file_path TEXT NOT NULL,
    parsed_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create the keywords table
CREATE TABLE IF NOT EXISTS keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word TEXT NOT NULL UNIQUE,
    domain_id UUID REFERENCES domains(id),
    relevance_score DECIMAL(3, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create the chat_messages table for storing chat history
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_bot BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create the job_listings table
CREATE TABLE IF NOT EXISTS job_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    url TEXT,
    work_mode TEXT,
    salary DECIMAL(10, 2),
    domain_id UUID REFERENCES domains(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Sample data insertion
-- Insert domains
INSERT INTO domains (name, description)
VALUES (
        'Software Development',
        'Computer programming and software engineering'
    ),
    (
        'Data Science',
        'Data analysis, machine learning, and statistics'
    ),
    (
        'Web Development',
        'Frontend and backend web technologies'
    ),
    (
        'Cloud Computing',
        'Cloud platforms and infrastructure'
    );
-- Insert skills
INSERT INTO skills (name, category)
VALUES ('JavaScript', 'Programming Language'),
    ('Python', 'Programming Language'),
    ('React', 'Frontend Framework'),
    ('Node.js', 'Backend Framework'),
    ('SQL', 'Database'),
    ('Machine Learning', 'Data Science'),
    ('AWS', 'Cloud Platform'),
    ('Docker', 'DevOps'),
    ('TypeScript', 'Programming Language'),
    ('Next.js', 'Frontend Framework');
-- Insert courses
INSERT INTO courses (
        name,
        provider,
        link,
        duration,
        rating,
        description,
        domain_id
    )
SELECT 'Complete React Developer Course',
    'Udemy',
    'https://www.udemy.com/course/react-developer-course',
    '40 hours',
    4.8,
    'Comprehensive course covering all aspects of React development',
    id
FROM domains
WHERE name = 'Web Development';
INSERT INTO courses (
        name,
        provider,
        link,
        duration,
        rating,
        description,
        domain_id
    )
SELECT 'Machine Learning A-Z',
    'Coursera',
    'https://www.coursera.org/learn/machine-learning-course',
    '60 hours',
    4.9,
    'Learn machine learning techniques and algorithms from scratch',
    id
FROM domains
WHERE name = 'Data Science';
-- Insert keywords
INSERT INTO keywords (word, relevance_score, domain_id)
SELECT 'frontend',
    4.5,
    id
FROM domains
WHERE name = 'Web Development';
INSERT INTO keywords (word, relevance_score, domain_id)
SELECT 'backend',
    4.5,
    id
FROM domains
WHERE name = 'Web Development';
INSERT INTO keywords (word, relevance_score, domain_id)
SELECT 'data analysis',
    4.7,
    id
FROM domains
WHERE name = 'Data Science';
-- Enable row level security on all tables
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
-- Create policies
CREATE POLICY "Allow public read access to skills" ON skills FOR
SELECT USING (true);
CREATE POLICY "Allow public read access to domains" ON domains FOR
SELECT USING (true);
CREATE POLICY "Allow public read access to courses" ON courses FOR
SELECT USING (true);
CREATE POLICY "Allow public read access to keywords" ON keywords FOR
SELECT USING (true);
CREATE POLICY "Allow public read access to job_listings" ON job_listings FOR
SELECT USING (true);
-- User-specific policies
CREATE POLICY "Users can manage their own resumes" ON resumes USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can manage their own chat messages" ON chat_messages USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());