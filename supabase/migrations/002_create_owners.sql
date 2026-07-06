-- =============================================
-- EduStay Database Migration
-- Migration: 002_create_owners
-- Description: Creates the owners table
-- =============================================

CREATE TABLE public.owners (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    profile_id UUID NOT NULL,

    company_name TEXT,

    trading_name TEXT,

    ppra_number TEXT,

    vat_number TEXT,

    tax_number TEXT,

    contact_person TEXT,

    phone TEXT,

    alternate_phone TEXT,

    bank_name TEXT,

    account_holder TEXT,

    account_number TEXT,

    branch_code TEXT,

    account_type TEXT,

    commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 10.00,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_owner_profile
        FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE

);

ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_owners_profile
ON public.owners(profile_id);

CREATE INDEX idx_owners_company
ON public.owners(company_name);

COMMENT ON TABLE public.owners IS
'Stores business information for property owners.';