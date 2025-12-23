CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(100) UNIQUE NOT NULL,
  event_type VARCHAR(20) CHECK (event_type IN ('team','individual')),
  teammembers INTEGER
);

INSERT INTO events (event_name, event_type, teammembers)
VALUES
  ('event1', 'team', 4),
  ('event2', 'team', 3),
  ('event3', 'team', 2),
  ('event4', 'individual', NULL),
  ('event5', 'individual', NULL),
  ('event6', 'individual', NULL),
  ('Workshop', 'individual', NULL),
  ('Hackathon', 'individual', NULL)
ON CONFLICT (event_name) DO NOTHING;
