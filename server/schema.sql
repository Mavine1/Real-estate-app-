CREATE TABLE IF NOT EXISTS agents (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS properties (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  geolocation TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  area INTEGER NOT NULL CHECK (area > 0),
  bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
  bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
  rating NUMERIC(2, 1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
  facilities TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL,
  agent_id BIGINT NOT NULL REFERENCES agents(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS galleries (
  id BIGSERIAL PRIMARY KEY,
  image TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS property_galleries (
  property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  gallery_id BIGINT NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, gallery_id)
);

CREATE INDEX IF NOT EXISTS properties_type_idx ON properties(type);
CREATE INDEX IF NOT EXISTS reviews_property_id_idx ON reviews(property_id);

INSERT INTO agents (name, email, avatar)
SELECT
  'Agent ' || i,
  'agent' || i || '@example.com',
  (ARRAY[
    'https://images.unsplash.com/photo-1691335053879-02096d6ee2ca?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544723495-432537d12f6c?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542507464418-09c375b86bbe?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=300&auto=format&fit=crop'
  ])[i]
FROM generate_series(1, 5) AS i
ON CONFLICT (email) DO NOTHING;

INSERT INTO galleries (image)
SELECT unnest(ARRAY[
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=640&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1638799869566-b17fa794c4de?q=80&w=640&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560185009-dddeb820c7b7?q=80&w=640&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1641910532059-ad684fd3049c?q=80&w=640&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=640&auto=format&fit=crop'
])
ON CONFLICT (image) DO NOTHING;

INSERT INTO properties (
  name, type, description, address, geolocation, price, area,
  bedrooms, bathrooms, rating, facilities, image, agent_id
)
SELECT
  'Property ' || i,
  (ARRAY['House','Townhomes','Condos','Duplexes','Studios','Villa','Apartments','Others'])[1 + ((i - 1) % 8)],
  'A comfortable, well-located home with modern finishes and generous living space.',
  (100 + i) || ' Property Street, Nairobi',
  '-1.286389,36.817223',
  1000 + (i * 375),
  500 + (i * 105),
  1 + (i % 5),
  1 + (i % 4),
  1 + (i % 5),
  ARRAY['Wifi', 'Car Parking', 'Gym'],
  (ARRAY[
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=640&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605146768851-eda79da39897?q=80&w=640&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=640&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=640&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561753757-d8880c5a3551?q=80&w=640&auto=format&fit=crop'
  ])[1 + ((i - 1) % 5)],
  (SELECT id FROM agents ORDER BY id OFFSET ((i - 1) % 5) LIMIT 1)
FROM generate_series(1, 20) AS i
WHERE NOT EXISTS (SELECT 1 FROM properties);

INSERT INTO reviews (property_id, name, avatar, review, rating)
SELECT
  p.id,
  'Reviewer ' || r,
  'https://images.unsplash.com/photo-1517331671191-ddc2c6d3ebd1?q=80&w=300&auto=format&fit=crop',
  'A lovely property with a convenient location and excellent amenities.',
  4 + (r % 2)
FROM properties p
CROSS JOIN generate_series(1, 2) AS r
WHERE NOT EXISTS (SELECT 1 FROM reviews);

INSERT INTO property_galleries (property_id, gallery_id)
SELECT p.id, g.id
FROM properties p
CROSS JOIN (SELECT id FROM galleries ORDER BY id LIMIT 3) g
ON CONFLICT DO NOTHING;
