DO $$
BEGIN
    CREATE TYPE task_type_enum AS ENUM (
        'Hearing',
        'Case Management',
        'Document Review',
        'Bug',
        'Other'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE task_status_enum AS ENUM (
        'To do',
        'In Progress',
        'Completed',
        'Deleted'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_type task_type_enum NOT NULL,
    task_description TEXT,
    task_status task_status_enum NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
