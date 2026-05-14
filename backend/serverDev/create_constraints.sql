-- Add constraints for task_status and task_type
CREATE TYPE task_status_enum AS ENUM (
    'To do', 'In Progress', 'Completed', 'Deleted'
);

ALTER TABLE tasks
ALTER COLUMN task_status TYPE task_status_enum
USING task_status::task_status_enum;

ALTER TABLE tasks DROP CONSTRAINT task_status_check;