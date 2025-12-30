-- Slot reservation table
CREATE TABLE IF NOT EXISTS slot_reservations (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  event_id INT NOT NULL,
  role TEXT,
  team_name TEXT,
  team_code TEXT,
  registration_mode TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_slot_res_email ON slot_reservations(email);
CREATE INDEX IF NOT EXISTS idx_slot_res_event ON slot_reservations(event_id);
CREATE INDEX IF NOT EXISTS idx_slot_res_expiry ON slot_reservations(expires_at);

-- Unique team name protection
CREATE UNIQUE INDEX IF NOT EXISTS uniq_team_name_per_event
ON slot_reservations (event_id, LOWER(team_name))
WHERE team_name IS NOT NULL;