export type PropertyCategory = "Apartments" | "Houses" | "Shops" | "BNB";

export type ManagedProperty = {
  $id: string;
  name: string;
  type: PropertyCategory;
  image: string;
  gallery: { label: string; image: string }[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  description: string;
  agent: string;
  amenities: string[];
};

const images = {
  apartmentExterior: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
  apartmentLiving: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  apartmentBedroom: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
  apartmentBath: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85",
  houseExterior: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  houseLiving: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  houseBedroom: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
  houseBath: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85",
  shopFront: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
  shopInside: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=85",
  bnbExterior: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
  bnbLiving: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  bnbBedroom: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85",
};

export const managedProperties: ManagedProperty[] = [
  {
    $id: "baraka-parkview-apartment",
    name: "Parkview Apartments",
    type: "Apartments",
    image: images.apartmentExterior,
    gallery: [
      { label: "Exterior", image: images.apartmentExterior }, { label: "Living room", image: images.apartmentLiving },
      { label: "Bedroom", image: images.apartmentBedroom }, { label: "Bathroom", image: images.apartmentBath },
    ],
    price: 42000, bedrooms: 2, bathrooms: 2, area: 980,
    address: "Kilimani, Nairobi", agent: "Grace Wanjiku", description: "A bright two-bedroom apartment with a private balcony, secure access and an easy commute to Nairobi's city centre.",
    amenities: ["24/7 security", "Lift", "Fibre internet", "Backup generator", "Parking", "Borehole water"],
  },
  {
    $id: "baraka-garden-villa",
    name: "Garden Villa", type: "Houses", image: images.houseExterior,
    gallery: [
      { label: "Exterior", image: images.houseExterior }, { label: "Living room", image: images.houseLiving },
      { label: "Bedroom", image: images.houseBedroom }, { label: "Bathroom", image: images.houseBath },
    ],
    price: 125000, bedrooms: 4, bathrooms: 3, area: 2600,
    address: "Lavington, Nairobi", agent: "Grace Wanjiku", description: "A peaceful family home with a landscaped garden, generous social spaces and dependable estate security.",
    amenities: ["Private garden", "DSQ", "Parking", "24/7 security", "Backup water", "Pet friendly"],
  },
  {
    $id: "baraka-riverside-shop",
    name: "Riverside Retail Space", type: "Shops", image: images.shopFront,
    gallery: [
      { label: "Shop front", image: images.shopFront }, { label: "Retail floor", image: images.shopInside },
    ],
    price: 68000, bedrooms: 0, bathrooms: 1, area: 720,
    address: "Westlands, Nairobi", agent: "Grace Wanjiku", description: "A clean, street-facing retail space with strong foot traffic and flexible interior layout for your growing business.",
    amenities: ["Street frontage", "Fibre ready", "Security", "Customer parking", "Washroom", "Signage space"],
  },
  {
    $id: "baraka-olive-suite",
    name: "Olive BnB Suite", type: "BNB", image: images.bnbExterior,
    gallery: [
      { label: "Residence", image: images.bnbExterior }, { label: "Lounge", image: images.bnbLiving }, { label: "Bedroom", image: images.bnbBedroom },
    ],
    price: 95000, bedrooms: 1, bathrooms: 1, area: 640,
    address: "Kileleshwa, Nairobi", agent: "Grace Wanjiku", description: "A fully furnished short-stay suite with hotel-style comfort, a calm work corner and weekly housekeeping.",
    amenities: ["Fully furnished", "Wi-Fi", "Housekeeping", "Smart TV", "Gym access", "Secure parking"],
  },
];

export const getManagedProperty = (id?: string) =>
  managedProperties.find((property) => property.$id === id);
