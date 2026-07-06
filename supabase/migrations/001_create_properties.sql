-- =============================================
-- EduStay Database Migration
-- Migration: 001_create_universities
-- Description: Creates the universities table
-- =============================================

CREATE TABLE public.universities (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    short_name TEXT,

    campus TEXT,

    city TEXT NOT NULL,

    province TEXT NOT NULL,

    country TEXT NOT NULL DEFAULT 'South Africa',

    website TEXT,

    contact_email TEXT,

    contact_phone TEXT,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

);

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_universities_name
ON public.universities(name);

CREATE INDEX idx_universities_city
ON public.universities(city);

COMMENT ON TABLE public.universities IS
'Stores universities and campuses served by EduStay.';