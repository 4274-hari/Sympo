CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER,
  order_id VARCHAR(100),
  payment_id VARCHAR(100),
  status VARCHAR(20),
  raw_response JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
