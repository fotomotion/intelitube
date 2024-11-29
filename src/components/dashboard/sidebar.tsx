"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Library,
  Upload,
  Settings,
  Bell,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Analytics",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Biblioteca",
    href: "/dashboard/library",
    icon: Library,
  },
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Notificações",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r">
      <div className="flex items-center h-16 px-4 border-b">
        <h1 className="text-xl font-bold">Analytics</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-lg",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}