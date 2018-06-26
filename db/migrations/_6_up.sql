CREATE TABLE traffic_lights (
    id                  int NOT NULL,
    coordinates         numeric[],
    is_red              boolean,
    period_time         numeric
);

GRANT all privileges ON TABLE traffic_lights TO andy;