CREATE TABLE IF NOT EXISTS food_tokens (
  id SERIAL PRIMARY KEY,

  registration_id INTEGER NOT NULL
    REFERENCES registrations(id)
    ON DELETE CASCADE,

  token VARCHAR(64) UNIQUE NOT NULL,

  food_type VARCHAR(10)
    CHECK (food_type IN ('veg', 'nonveg')),

  is_used BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);
