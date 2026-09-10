export interface Agent {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Review {
  $id: string;
  $createdAt: string;
  name: string;
  avatar: string;
  review: string;
  rating: number;
}

export interface GalleryImage {
  $id: string;
  image: string;
}

export interface Property {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  type: string;
  description: string;
  address: string;
  geolocation: string | null;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  facilities: string[];
  image: string;
  agent?: Agent;
  reviews?: Review[];
  gallery?: GalleryImage[];
}

const apiUrl = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Database API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function getLatestProperties() {
  return request<Property[]>("/api/properties/latest");
}

export function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (filter) searchParams.set("filter", filter);
  if (query) searchParams.set("query", query);
  if (limit) searchParams.set("limit", String(limit));

  return request<Property[]>(`/api/properties?${searchParams.toString()}`);
}

export function getPropertyById({ id }: { id: string }) {
  return request<Property>(`/api/properties/${encodeURIComponent(id)}`);
}
