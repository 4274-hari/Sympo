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
  max_online_teams INTEGER NOT NULL,

  -- session
  isboth BOOLEAN
);

INSERT INTO events (
  event_mode,
  event_name,
  event_type,
  teammembers,
  max_teams,
  max_online_teams,
  isBoth
)
VALUES
  ('non-tech',     'Auction Arena',     'team',       5, 40, 40,false),
  ('non-tech', 'Flashback',         'team',       3, 50, 50,true),
  ('non-tech', 'Cinefrenzy',        'team',       3, 40, 40,true),
  ('non-tech',     'Battle of Thrones', 'team',       2, 60, 60,false),
  ('non-tech',     'Beyond the Gate',   'team',       5, 25, 25,false),
  ('non-tech', 'Rhythmia',          'team',       3, 50, 50,true),
  ('tech',     'Agent Fusion',      'team',       3, 30, 30,true),
  ('tech', 'Paper Podium',      'team',       4, 25, 25,false),
  ('tech',     'Prompt Craft',      'team',       2, 44, 44,true),
  ('tech',     'HackQuest',         'team',       3, 23, 23,false),
  ('tech',     'Query Clash',         'individual',  NULL, 200, 100,true),
  ('tech',     'Shark Tank',       'team', 4, 20, 20, false),
  ('workshop','workshop','individual',NULL ,1000,1000,false)
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