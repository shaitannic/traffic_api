CREATE TABLE cars (
    id                  int NOT NULL,
    polyline_id         int NOT NULL,
    coordinates         numeric[],
    speed               numeric,
    position            numeric,
    acceleration        numeric,
    new_polyline        boolean
);

GRANT all privileges ON TABLE cars TO andy;
