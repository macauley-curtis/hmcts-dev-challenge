CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    task_description TEXT,
    task_status VARCHAR(50) NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

ALTER TABLE tasks
ADD CONSTRAINT task_status_check CHECK 
(task_status IN ('Pending', 'In Progress', 'Completed', 'Deleted'))   
ADD CONSTRAINT task_type_check CHECK 
(task_type IN ('Hearing', 'Case Management', 'Document Review', 'Bug', "Other"))

ALTER TABLE tasks
ADD CONSTRAINT due_date_check CHECK (due_date >= CURRENT_DATE);