-- =============================================
-- EduStay Database Migration
-- Migration: 010_create_applications
-- Description: Creates the applications table
-- =============================================

CREATE TABLE public.applications (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL,

    property_id UUID NOT NULL,

    property_unit_id UUID,

    room_id UUID,

    bed_id UUID,

    surety_id UUID NOT NULL,

    application_date TIMESTAMPTZ NOT NULL DEFAULT now(),

    move_in_date DATE,

    move_out_date DATE,

    status TEXT NOT NULL DEFAULT 'submitted',

    admin_notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_application_student
        FOREIGN KEY (student_id)
        REFERENCES public.students(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_application_property
        FOREIGN KEY (property_id)
        REFERENCES public.properties(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_application_unit
        FOREIGN KEY (property_unit_id)
        REFERENCES public.property_units(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_application_room
        FOREIGN KEY (room_id)
        REFERENCES public.rooms(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_application_bed
        FOREIGN KEY (bed_id)
        REFERENCES public.beds(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_application_surety
        FOREIGN KEY (surety_id)
        REFERENCES public.sureties(id)
        ON DELETE RESTRICT

);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_applications_student
ON public.applications(student_id);

CREATE INDEX idx_applications_property
ON public.applications(property_id);

CREATE INDEX idx_applications_status
ON public.applications(status);

COMMENT ON TABLE public.applications IS
'Stores accommodation applications submitted by students.';