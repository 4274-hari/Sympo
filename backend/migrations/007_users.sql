CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  dob DATE NOT NULL,
  role VARCHAR(50)
    CHECK (
      role IN (
        'general',
        'registration',
        'food',
        'Auction Arena',
        'Flashback',
        'Cinefrenzy',
        'Battle of Thrones',
        'Beyond the Gate',
        'Rhythmia',
        'Agent Fusion',
        'Paper Podium',
        'Prompt Craft',
        'HackQuest',
        'Query Clash',
        'Shark Tank',
        'Workshop'
      )
    )
    NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--for testing synthetic data 
INSERT INTO users (name, email, dob, role) VALUES
('General User', 'general@sympo.test', '2000-01-01', 'general'),
('Registration Admin', 'registration@sympo.test', '2000-01-01', 'registration'),
('Food Admin', 'food@sympo.test', '2000-01-01', 'food');

INSERT INTO users (name, email, dob, role) VALUES
('Auction Arena Lead', 'auction@sympo.test', '2000-01-01', 'Auction Arena'),
('Flashback Lead', 'flashback@sympo.test', '2000-01-01', 'Flashback'),
('Cinefrenzy Lead', 'cinefrenzy@sympo.test', '2000-01-01', 'Cinefrenzy'),
('Battle of Thrones Lead', 'thrones@sympo.test', '2000-01-01', 'Battle of Thrones'),
('Beyond the Gate Lead', 'beyondgate@sympo.test', '2000-01-01', 'Beyond the Gate'),
('Rhythmia Lead', 'rhythmia@sympo.test', '2000-01-01', 'Rhythmia');


INSERT INTO users (name, email, dob, role) VALUES
('Agent Fusion Lead', 'agentfusion@sympo.test', '2000-01-01', 'Agent Fusion'),
('Paper Podium Lead', 'paperpodium@sympo.test', '2000-01-01', 'Paper Podium'),
('Prompt Craft Lead', 'promptcraft@sympo.test', '2000-01-01', 'Prompt Craft'),
('HackQuest Lead', 'hackquest@sympo.test', '2000-01-01', 'HackQuest'),
('Query Clash Lead', 'queryclash@sympo.test', '2000-01-01', 'Query Clash'),
('Shark Tank Lead', 'sharktank@sympo.test', '2000-01-01', 'Shark Tank');


INSERT INTO users (name, email, dob, role) VALUES
('Workshop Coordinator', 'workshop@sympo.test', '2000-01-01', 'Workshop');
