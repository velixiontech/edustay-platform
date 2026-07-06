-- =============================================
-- EduStay Database Migration
-- Migration: 011_create_contracts
-- Description: Creates the contracts table
-- =============================================

CREATE TABLE public.contracts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL UNIQUE,

    student_id UUID NOT NULL,

    surety_id UUID NOT NULL,

    property_id UUID NOT NULL,

    room_id UUID,

    bed_id UUID,

    monthly_rent NUMERIC(10,2) NOT NULL,

    deposit_amount NUMERIC(10,2) DEFAULT 0,

    lease_start_date DATE NOT NULL,

    lease_end_date DATE NOT NULL,

    template_name TEXT NOT NULL DEFAULT 'standard-lease',

    status TEXT NOT NULL DEFAULT 'draft',

    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    activated_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    cancelled_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_contract_application
        FOREIGN KEY (application_id)
        REFERENCES public.applications(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_contract_student
        FOREIGN KEY (student_id)
        REFERENCES public.students(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_contract_surety
        FOREIGN KEY (surety_id)
        REFERENCES public.sureties(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_contract_property
        FOREIGN KEY (property_id)
        REFERENCES public.properties(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_contract_room
        FOREIGN KEY (room_id)
        REFERENCES public.rooms(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_contract_bed
        FOREIGN KEY (bed_id)
        REFERENCES public.beds(id)
        ON DELETE SET NULL

);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contract_student
ON public.contracts(student_id);

CREATE INDEX idx_contract_status
ON public.contracts(status);

CREATE INDEX idx_contract_property
ON public.contracts(property_id);

COMMENT ON TABLE public.contracts IS
'Stores lease agreements generated from approved applications.';