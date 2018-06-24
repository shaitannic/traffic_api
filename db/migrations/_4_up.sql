CREATE TABLE cars (
    polyline_id         int NOT NULL,
    coordinates         numeric[],
    speed               int,
    acceleration        int,
    new_polyline        boolean
);

GRANT all privileges ON TABLE cars TO andy;
