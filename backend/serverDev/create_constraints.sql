-- Add constraints for task_status and task_type
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'task_status_enum'
    ) THEN
        CREATE TYPE task_status_enum AS ENUM (
            'To do', 'In Progress', 'Completed', 'Deleted'
        );
    END IF;
END
$$;

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS task_status_check;

ALTER TABLE tasks
ALTER COLUMN task_status TYPE task_status_enum
USING (
    CASE
        WHEN task_status = 'Pending' THEN 'To do'
        WHEN task_status = 'Resulsted' THEN 'Completed'
        WHEN task_status IN ('To do', 'In Progress', 'Completed', 'Deleted') THEN task_status
        ELSE 'To do'
    END
)::task_status_enum;

COMMIT;