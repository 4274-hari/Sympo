-- 1️⃣ CREATE TABLE (ALL COLUMNS DEFINED HERE)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,

  event_mode VARCHAR(20)
    CHECK (event_mode IN ('tech', 'non-tech', 'workshop')) NOT NULL,

  event_name VARCHAR(100) UNIQUE NOT NULL,

  event_type VARCHAR(20)
    CHECK (event_type IN ('team', 'individual')),

  teammembers INTEGER,

  max_teams INTEGER NOT NULL,
  max_online_teams INTEGER NOT NULL,

  is_both BOOLEAN DEFAULT false,

  default_session VARCHAR(20)
    CHECK (default_session IN ('morning', 'afternoon'))
);

-- 2️⃣ INSERT DATA (COLUMN NAMES MATCH EXACTLY)
INSERT INTO events (
  event_mode,
  event_name,
  event_type,
  teammembers,
  max_teams,
  max_online_teams,
  is_both
)
VALUES
  ('non-tech', 'Auction Arena', 'team', 5, 40, 40, false),
  ('non-tech', 'Flashback', 'team', 3, 50, 50, true),
  ('non-tech', 'Cinefrenzy', 'team', 3, 40, 40, true),
  ('non-tech', 'Battle of Thrones', 'team', 2, 60, 60, false),
  ('non-tech', 'Beyond the Gate', 'team', 5, 25, 25, false),
  ('non-tech', 'Rhythmia', 'team', 3, 50, 50, true),
  ('tech', 'Agent Fusion', 'team', 3, 30, 30, true),
  ('tech', 'Paper Podium', 'team', 4, 25, 25, false),
  ('tech', 'Prompt Craft', 'team', 2, 44, 44, true),
  ('tech', 'HackQuest', 'team', 3, 23, 23, false),
  ('tech', 'Query Clash', 'individual', NULL, 200, 100, true),
  ('tech', 'Shark Tank', 'team', 4, 20, 20, false),
  ('workshop', 'Workshop', 'individual', NULL, 1000, 1000, false)
ON CONFLICT (event_name) DO NOTHING;

-- 3️⃣ OPTIONAL UPDATE (SAFE)
UPDATE events
SET is_both = true
WHERE event_name IN (
  'Rhythmia',
  'Flashback',
  'Query Clash',
  'Agent Fusion',
  'Prompt Craft',
  'Beyond the Gate'
);

ALTER TABLE events
ADD COLUMN IF NOT EXISTS e_certificate_sent BOOLEAN DEFAULT false;

