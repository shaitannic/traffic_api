CREATE TABLE results (
    car_id              int NOT NULL,
    polyline_id         int NOT NULL,
    start_time          numeric,
    end_time            numeric
);

GRANT all privileges ON TABLE results TO andy;
