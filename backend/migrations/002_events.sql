CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,

  event_name VARCHAR(100) UNIQUE NOT NULL,

  event_type VARCHAR(20)
    CHECK (event_type IN ('team', 'individual')),

  teammembers INTEGER,

  -- total teams / participants allowed
  max_teams INTEGER NOT NULL,

  -- online registrations allowed
  max_online_teams INTEGER NOT NULL
);


INSERT INTO events (
  event_name,
  event_type,
  teammembers,
  max_teams,
  max_online_teams
)
VALUES
  ('Auction Arena',     'team',       5, 20, 12),
  ('Flashback',         'team',       3, 15, 10),
  ('Cinefrenzy',        'team',       3, 15, 10),
  ('Battle of Thrones', 'team',       2, 12, 8),
  ('Beyond the Gate',   'team',       5, 18, 12),
  ('Rhythmia',          'team',       3, 20, 15),
  ('Agent Fusion',      'team',       3, 15, 10),
  ('Paper Podium',      'team',       4, 10, 6),
  ('Prompt Craft',      'team',       2, 12, 8),
  ('HackQuest',         'team',       3, 5, 3),
  ('Query Clash',       'individual', NULL, 50, 30)
ON CONFLICT (event_name) DO NOTHING;
