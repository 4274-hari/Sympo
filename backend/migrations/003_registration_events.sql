CREATE TABLE IF NOT EXISTS registration_events (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER REFERENCES registrations(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id),
  role VARCHAR(20),        -- lead / member / NULL
  team_name VARCHAR(100),
  team_code VARCHAR(10),
  UNIQUE (registration_id, event_id)   -- cannot join same event twice
);
