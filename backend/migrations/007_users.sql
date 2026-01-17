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

        -- non-tech
        'auction_arena',
        'flashback',
        'cinefrenzy',
        'battle_of_thrones',
        'beyond_the_gate',
        'rhythmia',

        -- tech
        'agent_fusion',
        'paper_podium',
        'prompt_craft',
        'hackquest',
        'query_clash',
        'shark_tank',

        -- workshop
        'workshop'
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
('Auction Arena Lead', 'auction@sympo.test', '2000-01-01', 'auction_arena'),
('Flashback Lead', 'flashback@sympo.test', '2000-01-01', 'flashback'),
('Cinefrenzy Lead', 'cinefrenzy@sympo.test', '2000-01-01', 'cinefrenzy'),
('Battle Thrones Lead', 'thrones@sympo.test', '2000-01-01', 'battle_of_thrones'),
('Beyond Gate Lead', 'beyondgate@sympo.test', '2000-01-01', 'beyond_the_gate'),
('Rhythmia Lead', 'rhythmia@sympo.test', '2000-01-01', 'rhythmia');

INSERT INTO users (name, email, dob, role) VALUES
('Agent Fusion Lead', 'agentfusion@sympo.test', '2000-01-01', 'agent_fusion'),
('Paper Podium Lead', 'paperpodium@sympo.test', '2000-01-01', 'paper_podium'),
('Prompt Craft Lead', 'promptcraft@sympo.test', '2000-01-01', 'prompt_craft'),
('HackQuest Lead', 'hackquest@sympo.test', '2000-01-01', 'hackquest'),
('Query Clash Lead', 'queryclash@sympo.test', '2000-01-01', 'query_clash'),
('Shark Tank Lead', 'sharktank@sympo.test', '2000-01-01', 'shark_tank');

INSERT INTO users (name, email, dob, role) VALUES
('Workshop Coordinator', 'workshop@sympo.test', '2000-01-01', 'workshop');
