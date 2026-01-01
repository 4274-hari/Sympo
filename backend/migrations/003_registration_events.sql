CREATE TABLE IF NOT EXISTS registration_events (
  id SERIAL PRIMARY KEY,

  registration_id INTEGER NOT NULL
    REFERENCES registrations(id)
    ON DELETE CASCADE,

  event_id INTEGER NOT NULL
    REFERENCES events(id)
    ON DELETE CASCADE,

  role VARCHAR(20)
    CHECK (role IN ('lead', 'member')),

  team_name VARCHAR(100),

  team_code VARCHAR(10),

  slot INTEGER,

  registration_mode VARCHAR(10)
    CHECK (registration_mode IN ('online', 'onspot')),

  -- 🚫 Same registration cannot join same event twice
  CONSTRAINT unique_registration_event
    UNIQUE (registration_id, event_id)
);

-- Unique team code per event (only when team_code exists)
CREATE UNIQUE INDEX IF NOT EXISTS unique_team_code_per_event
ON registration_events (event_id, team_code)
WHERE team_code IS NOT NULL;


ALTER TABLE registration_events
ADD COLUMN session VARCHAR(20)
CHECK (session IN ('morning', 'afternoon'));