-- Custom SQL migration file, put you code below! --
INSERT INTO
    labels (id, label)
VALUES
    (gen_random_uuid(), 'family');

INSERT INTO
    labels (id, label)
VALUES
    (gen_random_uuid(), 'job');

INSERT INTO
    labels (id, label)
VALUES
    (gen_random_uuid(), 'food');