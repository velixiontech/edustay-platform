-- =============================================
-- EduStay Database Migration
-- Migration: 012_create_contract_signatures
-- Description: Creates the contract signatures table
-- =============================================

CREATE TABLE public.contract_signatures (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    contract_id UUID NOT NULL,

    signer_role TEXT NOT NULL,

    profile_id UUID NOT NULL,

    status TEXT NOT NULL DEFAULT 'pending',

    signature_method TEXT NOT NULL DEFAULT 'portal',

    signed_at TIMESTAMPTZ,

    ip_address TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_signature_contract
        FOREIGN KEY (contract_id)
        REFERENCES public.contracts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_signature_profile
        FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE RESTRICT

);

ALTER TABLE public.contract_signatures ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_signature_contract
ON public.contract_signatures(contract_id);

CREATE INDEX idx_signature_profile
ON public.contract_signatures(profile_id);

CREATE INDEX idx_signature_status
ON public.contract_signatures(status);

COMMENT ON TABLE public.contract_signatures IS
'Stores digital signatures for lease agreements.';