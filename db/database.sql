create TABLE person(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

create TABLE note(
    id SERIAL PRIMARY KEY,
    short_url VARCHAR(8),
    title VARCHAR(255),
    content TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);

create TABLE token(
    id SERIAL PRIMARY KEY,
    refresh_token VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);