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
  ('non-tech',     'Auction Arena',     'team',       5, 40, 40),
  ('non-tech', 'Flashback',         'team',       3, 50, 50),
  ('non-tech', 'Cinefrenzy',        'team',       3, 40, 40),
  ('non-tech',     'Battle of Thrones', 'team',       2, 60, 60),
  ('non-tech',     'Beyond the Gate',   'team',       5, 25, 25),
  ('non-tech', 'Rhythmia',          'team',       3, 50, 50),
  ('tech',     'Agent Fusion',      'team',       3, 30, 30),
  ('tech', 'Paper Podium',      'team',       4, 25, 25),
  ('tech',     'Prompt Craft',      'team',       2, 44, 44),
  ('tech',     'HackQuest',         'team',       3, 23, 23),
  ('tech',     'Query Clash',         'individual',  NULL, 200, 100),
  ('tech',     'Shark Tank',       'team', 4, 20, 20),
  ('workshop','workshop','individual',NULL ,1000,1000)
ON CONFLICT (event_name) DO NOTHING;

 ALTER TABLE events
 ADD COLUMN is_both BOOLEAN DEFAULT false;

 ALTER TABLE events
ADD COLUMN default_session VARCHAR(20)
CHECK (default_session IN ('morning', 'afternoon'));


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