-- =============================================
-- EduStay Database Migration
-- Migration: 004_create_properties
-- Description: Creates the properties table
-- =============================================

CREATE TABLE public.properties (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL,

    university_id UUID,

    property_name TEXT NOT NULL,

    property_type TEXT NOT NULL,

    description TEXT,

    street_address TEXT NOT NULL,

    suburb TEXT,

    city TEXT NOT NULL,

    province TEXT NOT NULL,

    postal_code TEXT,

    latitude NUMERIC(10,8),

    longitude NUMERIC(11,8),

    total_units INTEGER NOT NULL DEFAULT 0,

    total_rooms INTEGER NOT NULL DEFAULT 0,

    total_beds INTEGER NOT NULL DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_property_owner
        FOREIGN KEY (owner_id)
        REFERENCES public.owners(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_property_university
        FOREIGN KEY (university_id)
        REFERENCES public.universities(id)
        ON DELETE SET NULL

);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_properties_owner
ON public.properties(owner_id);

CREATE INDEX idx_properties_university
ON public.properties(university_id);

CREATE INDEX idx_properties_city
ON public.properties(city);

CREATE INDEX idx_properties_status
ON public.properties(status);

COMMENT ON TABLE public.properties IS
'Stores student accommodation properties managed by EduStay.';