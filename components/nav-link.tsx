import Link from "@/components/link";
import React from "react";

export default function NavLink({
  icon,
  linkName,
  href,
  currentRoute,
  onMouseEnter,
  onClick,
  showIcon,
}: {
  icon?: React.ReactNode;
  linkName: string;
  href: string;
  currentRoute?: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
  showIcon?: boolean;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={() => {
        onMouseEnter();
      }}
      onClick={onClick}
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
