import {
  Bell,
  CalendarDays,
  CircleHelp,
  Dumbbell,
  Languages,
  PawPrint,
  PersonStanding,
  ShieldCheck,
  Shirt,
  Soup,
  Waves,
  Wifi,
  CarFront,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react-native";
import images from "./images";

export const cards = [
  {
    title: "Card 1",
    location: "Nairobi, Kenya",
    price: "KSh 100,000",
    rating: 4.8,
    category: "house",
    image: images.newYork,
  },
  {
    title: "Card 2",
    location: "Nairobi, Kenya",
    price: "KSh 200,000",
    rating: 3,
    category: "house",
    image: images.japan,
  },
  {
    title: "Card 3",
    location: "Nairobi, Kenya",
    price: "KSh 300,000",
    rating: 2,
    category: "flat",
    image: images.newYork,
  },
  {
    title: "Card 4",
    location: "Nairobi, Kenya",
    price: "KSh 400,000",
    rating: 5,
    category: "villa",
    image: images.japan,
  },
];

export const featuredCards = [
  {
    title: "Featured 1",
    location: "Nairobi, Kenya",
    price: "KSh 100,000",
    rating: 4.8,
    image: images.newYork,
    category: "house",
  },
  {
    title: "Featured 2",
    location: "Nairobi, Kenya",
    price: "KSh 200,000",
    rating: 3,
    image: images.japan,
    category: "flat",
  },
];

export const categories = [
  { title: "All", category: "All" },
  { title: "Houses", category: "House" },
  { title: "Condos", category: "Condos" },
  { title: "Duplexes", category: "Duplexes" },
  { title: "Studios", category: "Studios" },
  { title: "Villas", category: "Villa" },
  { title: "Apartments", category: "Apartments" },
  { title: "Townhomes", category: "Townhomes" },
  { title: "Others", category: "Others" },
];

export const settings = [
  {
    title: "My Bookings",
    icon: CalendarDays,
  },
  {
    title: "Payments",
    icon: WalletCards,
  },
  {
    title: "Profile",
    icon: UserRound,
  },
  {
    title: "Notifications",
    icon: Bell,
  },
  {
    title: "Security",
    icon: ShieldCheck,
  },
  {
    title: "Language",
    icon: Languages,
  },
  {
    title: "Help Center",
    icon: CircleHelp,
  },
  {
    title: "Invite Friends",
    icon: UsersRound,
  },
];

export const facilities = [
  {
    title: "Laundry",
    icon: Shirt,
  },
  {
    title: "Car Parking",
    icon: CarFront,
  },
  {
    title: "Sports Center",
    icon: PersonStanding,
  },
  {
    title: "Cutlery",
    icon: Soup,
  },
  {
    title: "Gym",
    icon: Dumbbell,
  },
  {
    title: "Swimming pool",
    icon: Waves,
  },
  {
    title: "Wifi",
    icon: Wifi,
  },
  {
    title: "Pet Center",
    icon: PawPrint,
  },
];

export const gallery = [
  {
    id: 1,
    image: images.newYork,
  },
  {
    id: 2,
    image: images.japan,
  },
  {
    id: 3,
    image: images.newYork,
  },
  {
    id: 4,
    image: images.japan,
  },
  {
    id: 5,
    image: images.newYork,
  },
  {
    id: 6,
    image: images.japan,
  },
];
