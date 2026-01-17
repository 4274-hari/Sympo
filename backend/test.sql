/* =====================================================
   DROP TABLES (OPTIONAL – for clean re-run)
===================================================== */
DROP TABLE IF EXISTS food_tokens CASCADE;
DROP TABLE IF EXISTS registration_events CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;

DROP TABLE IF EXISTS payment_proofs CASCADE;


/* =====================================================
   REGISTRATIONS
===================================================== */
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,  
  secondmail VARCHAR(150) UNIQUE,
  phone VARCHAR(15) NOT NULL,
  college VARCHAR(150) NOT NULL,
  student_year INTEGER NOT NULL,
  amount INTEGER,
  food VARCHAR(50) NOT NULL,
  utr BIGINT UNIQUE NOT NULL,
  screenshot_hash TEXT UNIQUE NOT NULL,
  blacklist BOOLEAN DEFAULT FALSE,
  checkin BOOLEAN DEFAULT FALSE
);


/* =====================================================
   EVENTS
===================================================== */
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
    CHECK (default_session IN ('morning', 'afternoon')),
  e_certificate_sent BOOLEAN DEFAULT false
);

INSERT INTO events
(event_mode,event_name,event_type,teammembers,max_teams,max_online_teams,is_both)
VALUES
('non-tech','Auction Arena','team',5,40,40,false),
('non-tech','Flashback','team',3,50,50,true),
('non-tech','Cinefrenzy','team',3,40,40,true),
('non-tech','Battle of Thrones','team',2,60,60,false),
('non-tech','Beyond the Gate','team',5,25,25,false),
('non-tech','Rhythmia','team',3,50,50,true),
('tech','Agent Fusion','team',3,30,30,true),
('tech','Paper Podium','team',4,25,25,false),
('tech','Prompt Craft','team',2,44,44,true),
('tech','HackQuest','team',3,23,23,false),
('tech','Query Clash','individual',NULL,200,100,true),
('tech','Shark Tank','team',4,20,20,false),
('workshop','Workshop','individual',NULL,1000,1000,false)
ON CONFLICT (event_name) DO NOTHING;


/* =====================================================
   REGISTRATION EVENTS
===================================================== */
CREATE TABLE IF NOT EXISTS registration_events (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER NOT NULL
    REFERENCES registrations(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL
    REFERENCES events(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('lead','member')),
  team_name VARCHAR(100),
  team_code VARCHAR(10),
  slot INTEGER,
  registration_mode VARCHAR(10)
    CHECK (registration_mode IN ('online','onspot')),
  session VARCHAR(20)
    CHECK (session IN ('morning','afternoon')),
  CONSTRAINT unique_registration_event
    UNIQUE (registration_id, event_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_team_code_per_event_lead
ON registration_events (event_id, team_code)
WHERE role = 'lead';


/* =====================================================
   FOOD TOKENS
===================================================== */
CREATE TABLE IF NOT EXISTS food_tokens (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER NOT NULL
    REFERENCES registrations(id) ON DELETE CASCADE,
  token VARCHAR(64) UNIQUE NOT NULL,
  food_type VARCHAR(10)
    CHECK (food_type IN ('veg','nonveg')),
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);


/* =====================================================
   INSERT REGISTRATIONS (20)
===================================================== */
INSERT INTO registrations
(name,email,phone,college,student_year,amount,food,utr,screenshot_hash,checkin)
VALUES
('R1','r1@mail.com','9000000001','Velammal',2,200,'veg',700001,'h1',true),
('R2','r2@mail.com','9000000002','Velammal',3,200,'nonveg',700002,'h2',false),
('R3','r3@mail.com','9000000003','MIT',1,200,'veg',700003,'h3',false),
('R4','r4@mail.com','9000000004','MIT',4,200,'veg',700004,'h4',false),
('R5','r5@mail.com','9000000005','SRM',2,200,'nonveg',700005,'h5',false),
('R6','r6@mail.com','9000000006','SRM',3,200,'veg',700006,'h6',false),
('R7','r7@mail.com','9000000007','VIT',1,200,'veg',700007,'h7',false),
('R8','r8@mail.com','9000000008','VIT',4,200,'nonveg',700008,'h8',false),
('R9','r9@mail.com','9000000009','SSN',2,200,'veg',700009,'h9',false),
('R10','r10@mail.com','9000000010','SSN',3,200,'veg',700010,'h10',false),
('R11','r11@mail.com','9000000011','REC',2,300,'veg',700011,'h11',true),
('R12','r12@mail.com','9000000012','REC',3,300,'nonveg',700012,'h12',true),
('R13','r13@mail.com','9000000013','Saveetha',1,300,'veg',700013,'h13',false),
('R14','r14@mail.com','9000000014','Saveetha',4,300,'veg',700014,'h14',true),
('R15','r15@mail.com','9000000015','Panimalar',2,300,'nonveg',700015,'h15',false),
('R16','r16@mail.com','9000000016','Anna Univ',3,200,'veg',700016,'h16',false),
('R17','r17@mail.com','9000000017','Anna Univ',1,200,'veg',700017,'h17',false),
('R18','r18@mail.com','9000000018','Velammal',4,200,'nonveg',700018,'h18',false),
('R19','r19@mail.com','9000000019','Velammal',2,200,'veg',700019,'h19',false),
('R20','r20@mail.com','9000000020','MIT',3,200,'veg',700020,'h20',false);


/* =====================================================
   INSERT REGISTRATION EVENTS
===================================================== */
INSERT INTO registration_events
(registration_id,event_id,role,registration_mode,session)
VALUES
(1,(SELECT id FROM events WHERE event_name='Query Clash'),'lead','online','morning'),
(1,(SELECT id FROM events WHERE event_name='Paper Podium'),'lead','online','afternoon'),

(2,(SELECT id FROM events WHERE event_name='Flashback'),'lead','onspot','morning'),
(2,(SELECT id FROM events WHERE event_name='Auction Arena'),'lead','onspot','afternoon'),

(3,(SELECT id FROM events WHERE event_name='Agent Fusion'),'lead','online','morning'),
(3,(SELECT id FROM events WHERE event_name='HackQuest'),'lead','online','afternoon'),

(4,(SELECT id FROM events WHERE event_name='Prompt Craft'),'lead','online','morning'),
(4,(SELECT id FROM events WHERE event_name='Shark Tank'),'lead','online','afternoon'),

(5,(SELECT id FROM events WHERE event_name='Rhythmia'),'lead','onspot','morning'),
(5,(SELECT id FROM events WHERE event_name='Battle of Thrones'),'lead','onspot','afternoon'),

(6,(SELECT id FROM events WHERE event_name='Query Clash'),'lead','online','morning'),
(6,(SELECT id FROM events WHERE event_name='Prompt Craft'),'lead','online','afternoon'),

(7,(SELECT id FROM events WHERE event_name='Flashback'),'lead','onspot','morning'),
(7,(SELECT id FROM events WHERE event_name='Rhythmia'),'lead','onspot','afternoon'),

(8,(SELECT id FROM events WHERE event_name='Agent Fusion'),'lead','online','morning'),
(8,(SELECT id FROM events WHERE event_name='Cinefrenzy'),'lead','online','afternoon'),

(11,(SELECT id FROM events WHERE event_name='Workshop'),'lead','onspot','morning'),
(12,(SELECT id FROM events WHERE event_name='Workshop'),'lead','onspot','morning'),
(13,(SELECT id FROM events WHERE event_name='Workshop'),'lead','onspot','afternoon'),
(14,(SELECT id FROM events WHERE event_name='Workshop'),'lead','onspot','afternoon'),
(15,(SELECT id FROM events WHERE event_name='Workshop'),'lead','onspot','morning'),

(16,(SELECT id FROM events WHERE event_name='Query Clash'),'lead','online','morning'),
(17,(SELECT id FROM events WHERE event_name='Flashback'),'lead','onspot','afternoon'),
(18,(SELECT id FROM events WHERE event_name='Prompt Craft'),'lead','online','morning'),
(19,(SELECT id FROM events WHERE event_name='Agent Fusion'),'lead','online','afternoon'),
(20,(SELECT id FROM events WHERE event_name='Rhythmia'),'lead','onspot','morning');


/* =====================================================
   INSERT FOOD TOKENS
===================================================== */
INSERT INTO food_tokens
(registration_id,token,food_type,is_used,used_at)
VALUES
(1,'FOOD001','veg',true,CURRENT_TIMESTAMP),
(2,'FOOD002','nonveg',true,CURRENT_TIMESTAMP),
(3,'FOOD003','veg',false,NULL),
(4,'FOOD004','veg',true,CURRENT_TIMESTAMP),
(5,'FOOD005','nonveg',false,NULL),
(6,'FOOD006','veg',true,CURRENT_TIMESTAMP),
(7,'FOOD007','veg',false,NULL),
(8,'FOOD008','nonveg',true,CURRENT_TIMESTAMP),
(9,'FOOD009','veg',false,NULL),
(10,'FOOD010','veg',true,CURRENT_TIMESTAMP),
(11,'FOOD011','veg',true,CURRENT_TIMESTAMP),
(12,'FOOD012','nonveg',true,CURRENT_TIMESTAMP),
(13,'FOOD013','veg',false,NULL),
(14,'FOOD014','veg',true,CURRENT_TIMESTAMP),
(15,'FOOD015','nonveg',false,NULL),
(16,'FOOD016','veg',true,CURRENT_TIMESTAMP),
(17,'FOOD017','veg',false,NULL),
(18,'FOOD018','nonveg',true,CURRENT_TIMESTAMP),
(19,'FOOD019','veg',false,NULL),
(20,'FOOD020','veg',true,CURRENT_TIMESTAMP);


CREATE TABLE IF NOT EXISTS payment_proofs (
    id SERIAL PRIMARY KEY,

    email VARCHAR(40) NOT NULL UNIQUE,

    uid VARCHAR(20) NOT NULL UNIQUE,
    ocr_uid VARCHAR(20),

    screenshot_hash TEXT NOT NULL UNIQUE,
    screenshot_path TEXT NOT NULL,

    amount INTEGER NOT NULL,

    status VARCHAR(20) DEFAULT 'PENDING',
    
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO payment_proofs
(email, uid, ocr_uid, screenshot_hash, screenshot_path, amount, status, is_verified)
VALUES
-- ₹200 payments (2-event & single-event)
('r1@mail.com',  'UPI001', 'UPI001', 'ph1',  '/payments/r1.png',  200, 'APPROVED', true),
('r2@mail.com',  'UPI002', 'UPI002', 'ph2',  '/payments/r2.png',  200, 'APPROVED', true),
('r3@mail.com',  'UPI003', 'UPI003', 'ph3',  '/payments/r3.png',  200, 'PENDING',  false),
('r4@mail.com',  'UPI004', 'UPI004', 'ph4',  '/payments/r4.png',  200, 'APPROVED', true),
('r5@mail.com',  'UPI005', 'UPI005', 'ph5',  '/payments/r5.png',  200, 'APPROVED', true),

('r6@mail.com',  'UPI006', 'UPI006', 'ph6',  '/payments/r6.png',  200, 'APPROVED', true),
('r7@mail.com',  'UPI007', 'UPI007', 'ph7',  '/payments/r7.png',  200, 'PENDING',  false),
('r8@mail.com',  'UPI008', 'UPI008', 'ph8',  '/payments/r8.png',  200, 'APPROVED', true),
('r9@mail.com',  'UPI009', 'UPI009', 'ph9',  '/payments/r9.png',  200, 'APPROVED', true),
('r10@mail.com', 'UPI010', 'UPI010', 'ph10', '/payments/r10.png', 200, 'APPROVED', true),
('r11@mail.com', 'UPI011', 'UPI011', 'ph11', '/payments/r11.png', 300, 'APPROVED', true),
('r12@mail.com', 'UPI012', 'UPI012', 'ph12', '/payments/r12.png', 300, 'APPROVED', true),
('r13@mail.com', 'UPI013', 'UPI013', 'ph13', '/payments/r13.png', 300, 'PENDING',  false),
('r14@mail.com', 'UPI014', 'UPI014', 'ph14', '/payments/r14.png', 300, 'APPROVED', true),
('r15@mail.com', 'UPI015', 'UPI015', 'ph15', '/payments/r15.png', 300, 'APPROVED', true),
('r16@mail.com', 'UPI016', 'UPI016', 'ph16', '/payments/r16.png', 200, 'APPROVED', true),
('r17@mail.com', 'UPI017', 'UPI017', 'ph17', '/payments/r17.png', 200, 'PENDING',  false),
('r18@mail.com', 'UPI018', 'UPI018', 'ph18', '/payments/r18.png', 200, 'APPROVED', true),
('r19@mail.com', 'UPI019', 'UPI019', 'ph19', '/payments/r19.png', 200, 'APPROVED', true),
('r20@mail.com', 'UPI020', 'UPI020', 'ph20', '/payments/r20.png', 200, 'APPROVED', true);
