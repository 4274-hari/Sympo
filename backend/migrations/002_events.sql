CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,

  event_mode VARCHAR(20)
    CHECK (event_mode IN ('tech', 'non-tech','workshop')) NOT NULL,

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
  event_mode,
  event_name,
  event_type,
  teammembers,
  max_teams,
  max_online_teams
)
VALUES
  ('non-tech',     'Auction Arena',     'team',       5, 20, 12),
  ('non-tech', 'Flashback',         'team',       3, 15, 10),
  ('non-tech', 'Cinefrenzy',        'team',       3, 15, 10),
  ('non-tech',     'Battle of Thrones', 'team',       2, 12, 8),
  ('non-tech',     'Beyond the Gate',   'team',       5, 18, 12),
  ('non-tech', 'Rhythmia',          'team',       3, 20, 15),
  ('tech',     'Agent Fusion',      'team',       3, 15, 10),
  ('tech', 'Paper Podium',      'team',       4, 10, 6),
  ('tech',     'Prompt Craft',      'team',       2, 12, 8),
  ('tech',     'HackQuest',         'team',       3, 5, 3),
  ('tech',     'Query Clash',       'individual', NULL, 50, 30),
  ('workshop','workshop','individual',NULL ,50,50)
ON CONFLICT (event_name) DO NOTHING;
