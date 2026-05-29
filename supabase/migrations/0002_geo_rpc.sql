-- =============================================
-- Geo RPC Function: Find places within radius
-- =============================================

CREATE OR REPLACE FUNCTION places_within_radius(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE(id UUID, distance_m DOUBLE PRECISION) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    ST_Distance(
      p.coordinates::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    )::DOUBLE PRECISION as distance_m
  FROM places p
  WHERE p.coordinates IS NOT NULL
    AND ST_DWithin(
      p.coordinates::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance_m;
END;
$$ LANGUAGE plpgsql;
