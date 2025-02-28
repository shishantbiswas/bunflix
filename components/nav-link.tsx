'use client'
import Link from "@/components/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavLink({
  icon,
  linkName,
  href,
  showIcon,
}: {
  icon?: React.ReactNode;
  linkName: string;
  href: string;
  showIcon?: boolean;
}) {
  const currentRoute = usePathname() === href
  return (
    <Link
      href={href}
      style={{
        backgroundColor: currentRoute ? "#dc2626" : "",
        borderRadius: "10px",
      }}
    >
      <button>
        <div className="relative group py-1.5 px-3 w-fit flex gap-2 items-center">
          {showIcon ? icon : currentRoute ? icon : null}
          <h1 className="text-nowrap">{linkName}</h1>
        </div>
      </button>
    </Link>
  );
}
