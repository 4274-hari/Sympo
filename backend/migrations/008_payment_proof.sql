CREATE TABLE payment_proofs (
    id SERIAL PRIMARY KEY,

    uid VARCHAR(20) NOT NULL UNIQUE,
    ocr_uid VARCHAR(20),

    screenshot_hash TEXT NOT NULL UNIQUE,
    screenshot_path TEXT NOT NULL,

    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);