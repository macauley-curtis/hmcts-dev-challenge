DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'due_date_check'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT due_date_check
    CHECK (due_date IS NULL OR due_date >= CURRENT_DATE);
  END IF;
END $$;