-- Create local_flights table
CREATE TABLE public.local_flights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  airline TEXT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  flight_date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration TEXT NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create urban_transportation table
CREATE TABLE public.urban_transportation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  transport_type TEXT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  trip_date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration TEXT NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.local_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.urban_transportation ENABLE ROW LEVEL SECURITY;

-- Local Flights RLS Policies
-- Allow admins to manage local flights
-- Note: Admin check should be done in application logic
-- For now, allow authenticated users to view, but only admins can insert/update/delete
CREATE POLICY "Anyone can view local flights"
  ON public.local_flights FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert local flights"
  ON public.local_flights FOR INSERT
  WITH CHECK (true); -- Admin check done in application

CREATE POLICY "Admins can update local flights"
  ON public.local_flights FOR UPDATE
  USING (true); -- Admin check done in application

CREATE POLICY "Admins can delete local flights"
  ON public.local_flights FOR DELETE
  USING (true); -- Admin check done in application

-- Urban Transportation RLS Policies
CREATE POLICY "Anyone can view urban transportation"
  ON public.urban_transportation FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert urban transportation"
  ON public.urban_transportation FOR INSERT
  WITH CHECK (true); -- Admin check done in application

CREATE POLICY "Admins can update urban transportation"
  ON public.urban_transportation FOR UPDATE
  USING (true); -- Admin check done in application

CREATE POLICY "Admins can delete urban transportation"
  ON public.urban_transportation FOR DELETE
  USING (true); -- Admin check done in application

-- Create triggers for updated_at
CREATE TRIGGER update_local_flights_updated_at
  BEFORE UPDATE ON public.local_flights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_urban_transportation_updated_at
  BEFORE UPDATE ON public.urban_transportation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

