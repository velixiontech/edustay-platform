-- =============================================
-- EduStay Database Migration
-- Migration: 013_create_contract_documents
-- Description: Creates the contract documents table
-- =============================================

CREATE TABLE public.contract_documents (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    contract_id UUID NOT NULL,

    document_type TEXT NOT NULL DEFAULT 'lease',

    version INTEGER NOT NULL DEFAULT 1,

    storage_path TEXT NOT NULL,

    file_name TEXT NOT NULL,

    file_size BIGINT,

    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_document_contract
        FOREIGN KEY (contract_id)
        REFERENCES public.contracts(id)
        ON DELETE CASCADE

);

ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contract_document
ON public.contract_documents(contract_id);

COMMENT ON TABLE public.contract_documents IS
'Stores generated contract documents.';