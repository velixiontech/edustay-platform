-- =============================================
-- EduStay Database Migration
-- Migration: 008_create_students
-- Description: Creates the students table
-- =============================================

CREATE TABLE public.students (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL,

    university_id UUID NOT NULL,

    student_number TEXT NOT NULL UNIQUE,

    faculty TEXT,

    qualification TEXT,

    year_of_study INTEGER,

    funding_type TEXT,

    emergency_contact_name TEXT,

    emergency_contact_relationship TEXT,

    emergency_contact_phone TEXT,

    emergency_contact_email TEXT,

    status TEXT NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_student_profile
        FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_student_university
        FOREIGN KEY (university_id)
        REFERENCES public.universities(id)
        ON DELETE RESTRICT

);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_students_profile
ON public.students(profile_id);

CREATE INDEX idx_students_university
ON public.students(university_id);

CREATE INDEX idx_students_number
ON public.students(student_number);

COMMENT ON TABLE public.students IS
'Stores student-specific information for EduStay.';