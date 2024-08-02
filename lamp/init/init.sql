USE statisticDb;

CREATE TABLE IF NOT EXISTS statistic(
    id INT AUTO_INCREMENT PRIMARY KEY,
    dir_path VARCHAR(255) NOT NULL CHECK (LENGTH(dir_path) > 0),
    total_size BIGINT NOT NULL CHECK (total_size >= 0),
    load_time_seconds FLOAT NOT NULL CHECK (load_time_seconds >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
