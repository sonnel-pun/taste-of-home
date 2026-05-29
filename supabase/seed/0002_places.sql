-- =============================================
-- Seed: Real London Places (Hong Kong restaurants)
-- =============================================

INSERT INTO places (name, type, address, city, country, coordinates, phone, verified) VALUES
  ('Gold Mine 金山樓', 'restaurant', '102 Queensway, London W2 3RR', 
   'London', 'United Kingdom', ST_PointFromText('POINT(-0.1887 51.5103)', 4326),
   '+44 20 7221 8080', TRUE),
  
  ('Four Seasons 文興酒家', 'restaurant', '12 Gerrard Street, London W1D 5PP',
   'London', 'United Kingdom', ST_PointFromText('POINT(-0.1312 51.5116)', 4326),
   '+44 20 7494 0870', TRUE),
  
  ('Cafe TPT 大排档', 'restaurant', '21 Wardour Street, London W1D 6PN',
   'London', 'United Kingdom', ST_PointFromText('POINT(-0.1315 51.5113)', 4326),
   '+44 20 7734 7981', TRUE),
  
  ('SeeWoo Supermarket', 'grocery', '18 Greenwich Church Street, London SE10 9BJ',
   'London', 'United Kingdom', ST_PointFromText('POINT(0.0039 51.4810)', 4326),
   '+44 20 8858 1002', TRUE),
  
  ('Loon Fung', 'grocery', '42 Gerrard Street, London W1D 5QG',
   'London', 'United Kingdom', ST_PointFromText('POINT(-0.1310 51.5118)', 4326),
   '+44 20 7437 0182', TRUE),
  
  ('New China 新興酒家', 'restaurant', '48 Gerrard Street, London W1D 5QL',
   'London', 'United Kingdom', ST_PointFromText('POINT(-0.1308 51.5117)', 4326),
   '+44 20 7437 0180', TRUE);
