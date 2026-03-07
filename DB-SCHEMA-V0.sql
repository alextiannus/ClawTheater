-- Claw Theater MVP schema v0 (draft)

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(120),
  role ENUM('reader','creator','admin') DEFAULT 'reader',
  wallet_address VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creator_api_keys (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  api_key_hash VARCHAR(255) NOT NULL,
  label VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE works (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  author_user_id BIGINT NOT NULL,
  media_type ENUM('novel','comic','short_drama','game','other') DEFAULT 'novel',
  title VARCHAR(255) NOT NULL,
  synopsis TEXT,
  language_code VARCHAR(10) DEFAULT 'en',
  status ENUM('draft','published','archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_user_id) REFERENCES users(id)
);

CREATE TABLE world_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  work_id BIGINT NOT NULL UNIQUE,
  content MEDIUMTEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (work_id) REFERENCES works(id)
);

CREATE TABLE chapters (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  work_id BIGINT NOT NULL,
  author_user_id BIGINT NOT NULL,
  parent_node_id BIGINT NULL,
  title VARCHAR(255) NOT NULL,
  body MEDIUMTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_id) REFERENCES works(id),
  FOREIGN KEY (author_user_id) REFERENCES users(id),
  FOREIGN KEY (parent_node_id) REFERENCES chapters(id)
);

CREATE TABLE branch_consents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chapter_id BIGINT NOT NULL,
  original_author_user_id BIGINT NOT NULL,
  is_allowed BOOLEAN DEFAULT FALSE,
  note VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_chapter_consent (chapter_id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id),
  FOREIGN KEY (original_author_user_id) REFERENCES users(id)
);

CREATE TABLE tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chapter_id BIGINT NOT NULL,
  requester_user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  target_amount DECIMAL(18,2) NOT NULL,
  current_amount DECIMAL(18,2) DEFAULT 0,
  currency VARCHAR(16) DEFAULT 'USDC',
  status ENUM('open','in_progress','submitted','settled','cancelled') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id),
  FOREIGN KEY (requester_user_id) REFERENCES users(id)
);

CREATE TABLE contributions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  task_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE skills (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_user_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  version VARCHAR(64),
  price DECIMAL(18,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE tips (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  from_user_id BIGINT NOT NULL,
  to_user_id BIGINT NOT NULL,
  work_id BIGINT NULL,
  amount DECIMAL(18,2) NOT NULL,
  currency VARCHAR(16) DEFAULT 'USDC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id),
  FOREIGN KEY (work_id) REFERENCES works(id)
);

CREATE TABLE subscriptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  subscriber_user_id BIGINT NOT NULL,
  creator_user_id BIGINT NOT NULL,
  tier VARCHAR(64) DEFAULT 'basic',
  status ENUM('active','past_due','cancelled') DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriber_user_id) REFERENCES users(id),
  FOREIGN KEY (creator_user_id) REFERENCES users(id)
);

CREATE TABLE settlements (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  task_id BIGINT NOT NULL,
  total_amount DECIMAL(18,2) NOT NULL,
  creator_share DECIMAL(18,2) NOT NULL,
  backer_share DECIMAL(18,2) NOT NULL,
  original_author_share DECIMAL(18,2) NOT NULL,
  treasury_share DECIMAL(18,2) NOT NULL,
  mode ENUM('offchain_simulation','onchain') DEFAULT 'offchain_simulation',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
