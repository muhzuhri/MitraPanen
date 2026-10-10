import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | null;
  badgeColor?: string;
}

export const PETANI_NAV_ITEMS: NavItem[] = [
  {
    label: "Beranda",
    icon: Home,
    href: "/petani",
    badge: null,
  },
  {
    label: "PanenKu",
    icon: Package,
    href: "/petani/panen",
    badge: "Stok Aktif",
  },
  {
    label: "Pesanan Masuk",
    icon: ShoppingCart,
    href: "/petani/pesanan",
    badge: "Order Baru",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    label: "Asisten WhatsApp",
    icon: MessageSquare,
    href: "/petani/whatsapp",
    badge: "Online",
    badgeColor: "bg-teal-100 text-teal-800",
  },
  {
    label: "Profil & Kebun",
    icon: Settings,
    href: "/petani/profil",
    badge: null,
  },
];
