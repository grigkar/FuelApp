-- Add unit_system column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN unit_system text NOT NULL DEFAULT 'metric' CHECK (unit_system IN ('metric', 'imperial'));

-- Migrate existing data
UPDATE public.profiles
SET unit_system = CASE 
  WHEN distance_unit = 'mi' OR volume_unit = 'gal' THEN 'imperial'
  ELSE 'metric'
END;

-- Keep distance_unit and volume_unit for backward compatibility temporarily
-- We can remove them later if needed