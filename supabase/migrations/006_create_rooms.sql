-- =============================================
-- EduStay Database Migration
-- Migration: 006_create_rooms
-- Description: Creates the rooms table
-- =============================================

CREATE TABLE public.rooms (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    property_unit_id UUID NOT NULL,

    room_number TEXT NOT NULL,

    room_type TEXT,

    floor_number INTEGER,

    max_beds INTEGER NOT NULL DEFAULT 1,

    monthly_rent NUMERIC(10,2),

    status TEXT NOT NULL DEFAULT 'available',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_room_unit
        FOREIGN KEY (property_unit_id)
        REFERENCES public.property_units(id)
        ON DELETE CASCADE

);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_rooms_unit
ON public.rooms(property_unit_id);

CREATE INDEX idx_rooms_number
ON public.rooms(room_number);

COMMENT ON TABLE public.rooms IS
'Stores individual rooms within a property unit.';