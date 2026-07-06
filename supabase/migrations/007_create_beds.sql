-- =============================================
-- EduStay Database Migration
-- Migration: 007_create_beds
-- Description: Creates the beds table
-- =============================================

CREATE TABLE public.beds (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    room_id UUID NOT NULL,

    bed_number TEXT NOT NULL,

    bed_type TEXT,

    monthly_rent NUMERIC(10,2),

    is_occupied BOOLEAN NOT NULL DEFAULT FALSE,

    status TEXT NOT NULL DEFAULT 'available',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_bed_room
        FOREIGN KEY (room_id)
        REFERENCES public.rooms(id)
        ON DELETE CASCADE

);

ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_beds_room
ON public.beds(room_id);

CREATE INDEX idx_beds_status
ON public.beds(status);

COMMENT ON TABLE public.beds IS
'Stores individual beds within a room.';