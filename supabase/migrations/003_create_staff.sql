-- =============================================
-- EduStay Database Migration
-- Migration: 003_create_staff
-- Description: Creates the staff table
-- =============================================

CREATE TABLE public.staff (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL,

    employee_number TEXT,

    department TEXT NOT NULL,

    job_title TEXT NOT NULL,

    phone TEXT,

    work_email TEXT,

    start_date DATE,

    manager_id UUID,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_staff_profile
        FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_staff_manager
        FOREIGN KEY (manager_id)
        REFERENCES public.staff(id)
        ON DELETE SET NULL

);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_staff_profile
ON public.staff(profile_id);

CREATE INDEX idx_staff_department
ON public.staff(department);

CREATE INDEX idx_staff_manager
ON public.staff(manager_id);

COMMENT ON TABLE public.staff IS
'Stores employment information for EduStay staff members.';