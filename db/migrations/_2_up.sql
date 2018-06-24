CREATE TABLE polylines (
    object_id               int NOT NULL,
    geometry_coordinates    numeric[],
    count_of_bands          int,
    input_stream            int,
    output_stream           int
);

GRANT all privileges ON TABLE polylines TO andy;
