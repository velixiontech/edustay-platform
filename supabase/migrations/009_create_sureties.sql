-- =============================================
-- EduStay Database Migration
-- Migration: 009_create_sureties
-- Description: Creates the sureties table
-- =============================================

CREATE TABLE public.sureties (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL,

    first_name TEXT NOT NULL,

    last_name TEXT NOT NULL,

    id_number TEXT,

    email TEXT NOT NULL,

    phone TEXT NOT NULL,

    relationship TEXT NOT NULL,

    employer_name TEXT,

    occupation TEXT,

    monthly_income NUMERIC(10,2),

    status TEXT NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_surety_student
        FOREIGN KEY (student_id)
        REFERENCES public.students(id)
        ON DELETE CASCADE

);

ALTER TABLE public.sureties ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sureties_student
ON public.sureties(student_id);

CREATE INDEX idx_sureties_email
ON public.sureties(email);

COMMENT ON TABLE public.sureties IS
'Stores surety information linked to a student.';