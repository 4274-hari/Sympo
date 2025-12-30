CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,

  registration_id INTEGER NOT NULL,  -- link to registration table

  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_id VARCHAR(100) UNIQUE,

  status VARCHAR(20) NOT NULL,  -- CREATED | PAID | FAILED

  raw_response JSONB,            -- full Razorpay response

  created_at TIMESTAMP DEFAULT NOW()
);
