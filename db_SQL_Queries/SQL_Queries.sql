-- 2025-01-20:
    -- Creating a table in AWS Athena, reading jsons from S3 user diary.
CREATE EXTERNAL TABLE IF NOT EXISTS user_diaries (
    user_id STRING,
    updated_date DATE,
    logDate DATE,
    themeEntry STRING,
    studyTime STRING,
    diaryEntry STRING
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
LOCATION 's3://diary-log/user-data/';
