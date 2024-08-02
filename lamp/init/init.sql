use statisticDb;

CREATE TABLE IF NOT EXISTS statistic(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    dir_path VARCHAR(255) CHECK(dir_path <> '') NOT NULL,
    total_size BIGINT CHECK(total_size >= 0) NOT NULL,
    load_time_seconds FLOAT CHECK(load_time_seconds >= 0) NOT NULL,
    created_at TIMESTAMP NOT NULL
);