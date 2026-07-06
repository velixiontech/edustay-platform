-- =============================================
-- EduStay Database Migration
-- Migration: 005_create_property_units
-- Description: Creates the property_units table
-- =============================================

CREATE TABLE public.property_units (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    property_id UUID NOT NULL,

    unit_name TEXT NOT NULL,

    description TEXT,

    floor_number INTEGER,

    total_rooms INTEGER NOT NULL DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_unit_property
        FOREIGN KEY (property_id)
        REFERENCES public.properties(id)
        ON DELETE CASCADE

);

ALTER TABLE public.property_units ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_units_property
ON public.property_units(property_id);

CREATE INDEX idx_units_name
ON public.property_units(unit_name);

COMMENT ON TABLE public.property_units IS
'Stores buildings, blocks or sections that belong to a property.';