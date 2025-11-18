# EssayBridge Database Schema

## Technology Stack
- **Database:** PostgreSQL 15+
- **ORM:** Prisma / TypeORM
- **Cache:** Redis 7+
- **Search:** Elasticsearch (optional)
- **File Storage:** AWS S3 / Cloudflare R2

---

## Schema Overview

```
users
├── student_profiles
├── expert_profiles
├── consultant_profiles
└── admin_profiles

essays
├── essay_reviews
└── essay_comments

courses
├── lessons
└── course_enrollments

consultations

payments
└── subscriptions

notifications
```

---

## Tables

### users
Core user table for authentication

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'expert', 'consultant', 'admin')),
  profile_image VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### student_profiles
Extended profile for students

```sql
CREATE TABLE student_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade INTEGER CHECK (grade >= 1 AND grade <= 3),
  school_name VARCHAR(200),
  target_universities TEXT[], -- Array of university names
  interests TEXT[], -- Array of majors/departments
  subscription_plan VARCHAR(20) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'pro')),
  essay_credits INTEGER DEFAULT 0,
  consulting_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_student_profiles_subscription ON student_profiles(subscription_plan);
```

### expert_profiles
Extended profile for essay review experts

```sql
CREATE TABLE expert_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialties TEXT[] NOT NULL, -- e.g., ['경영학', '경제학']
  universities TEXT[] NOT NULL, -- Universities they can review for
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expert_profiles_user_id ON expert_profiles(user_id);
CREATE INDEX idx_expert_profiles_rating ON expert_profiles(rating DESC);
```

### essays
Student essays

```sql
CREATE TABLE essays (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  university VARCHAR(200) NOT NULL,
  department VARCHAR(200) NOT NULL,
  essay_type VARCHAR(30) NOT NULL CHECK (essay_type IN ('general', 'university_specific', 'interview_prep')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'completed', 'archived')),
  word_count INTEGER DEFAULT 0,
  expert_id VARCHAR(50) REFERENCES users(id),
  file_url VARCHAR(500),
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_essays_student ON essays(student_id, status);
CREATE INDEX idx_essays_expert ON essays(expert_id, status);
CREATE INDEX idx_essays_status ON essays(status);
CREATE INDEX idx_essays_created ON essays(created_at DESC);
```

### essay_reviews
Reviews and feedback on essays

```sql
CREATE TABLE essay_reviews (
  id VARCHAR(50) PRIMARY KEY,
  essay_id VARCHAR(50) NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  expert_id VARCHAR(50) NOT NULL REFERENCES users(id),
  expert_name VARCHAR(100) NOT NULL,
  overall_feedback TEXT NOT NULL,
  score DECIMAL(3,1) CHECK (score >= 0 AND score <= 100),
  strengths TEXT,
  improvements TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'revised')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_essay ON essay_reviews(essay_id);
CREATE INDEX idx_reviews_expert ON essay_reviews(expert_id);
```

### essay_comments
Inline comments on specific parts of essays

```sql
CREATE TABLE essay_comments (
  id VARCHAR(50) PRIMARY KEY,
  review_id VARCHAR(50) NOT NULL REFERENCES essay_reviews(id) ON DELETE CASCADE,
  position INTEGER NOT NULL, -- Character position in text
  length INTEGER NOT NULL, -- Length of highlighted text
  text TEXT NOT NULL, -- Comment text
  type VARCHAR(20) NOT NULL CHECK (type IN ('grammar', 'logic', 'expression', 'structure', 'content')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_review ON essay_comments(review_id);
```

### courses
Online courses

```sql
CREATE TABLE courses (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  instructor_id VARCHAR(50) NOT NULL REFERENCES users(id),
  instructor_name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('general', 'university_specific', 'writing_basics', 'analysis')),
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  universities TEXT[], -- Relevant universities
  thumbnail VARCHAR(500),
  price DECIMAL(10,2) DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_rating ON courses(rating DESC);
```

### lessons
Course lessons

```sql
CREATE TABLE lessons (
  id VARCHAR(50) PRIMARY KEY,
  course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_course ON lessons(course_id, order_index);
```

### course_enrollments
Student course enrollments

```sql
CREATE TABLE course_enrollments (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
```

### consultations
1:1 consultation sessions

```sql
CREATE TABLE consultations (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL REFERENCES users(id),
  consultant_id VARCHAR(50) NOT NULL REFERENCES users(id),
  topic VARCHAR(500) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP,
  duration_minutes INTEGER DEFAULT 60,
  meeting_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consultations_student ON consultations(student_id);
CREATE INDEX idx_consultations_consultant ON consultations(consultant_id);
CREATE INDEX idx_consultations_status ON consultations(status);
```

### payments
Payment transactions

```sql
CREATE TABLE payments (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id),
  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_key VARCHAR(200),
  plan_id VARCHAR(50) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_method VARCHAR(50),
  billing_period VARCHAR(20) CHECK (billing_period IN ('monthly', 'yearly')),
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_order ON payments(order_id);
```

### subscriptions
User subscriptions

```sql
CREATE TABLE subscriptions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id),
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'basic', 'premium', 'pro')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  billing_period VARCHAR(20) CHECK (billing_period IN ('monthly', 'yearly')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, plan, start_date)
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
```

### notifications
User notifications

```sql
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);
```

---

## Indexes for Performance

```sql
-- Composite indexes for common queries
CREATE INDEX idx_essays_student_status_created ON essays(student_id, status, created_at DESC);
CREATE INDEX idx_reviews_essay_expert ON essay_reviews(essay_id, expert_id);
CREATE INDEX idx_payments_user_status_created ON payments(user_id, status, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_essays_title_content ON essays USING GIN (to_tsvector('korean', title || ' ' || content));
CREATE INDEX idx_courses_title_description ON courses USING GIN (to_tsvector('korean', title || ' ' || description));
```

---

## Redis Cache Strategy

```
# User sessions
user:session:{userId} -> User object (TTL: 1 hour)

# Active subscriptions
subscription:{userId} -> Subscription object (TTL: 1 day)

# Course data
course:{courseId} -> Course object (TTL: 1 hour)

# Rate limiting
rate_limit:{userId}:{endpoint} -> Request count (TTL: 1 minute)

# Temporary data
essay:draft:{userId}:{essayId} -> Draft content (TTL: 1 day)
```
