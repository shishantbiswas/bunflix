"use client"

import { Badge, Home, PopcornIcon, Search } from "lucide-react";
import Link from "./link";
import { usePathname } from "next/navigation";
import { useSearchBarFocus } from "@/context/search-context";
import SearchInput from "./search-input";

export default function MobileNavbar() {
    const mobileLinks = [
        {
            href: "/",
            name: "Home",
            icon: <Home />
        },
        {
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className=" size-6 fill-white"
                >
                    <title>AniList</title>

                    <path d="M24 17.53v2.421c0 .71-.391 1.101-1.1 1.101h-5l-.057-.165L11.84 3.736c.106-.502.46-.788 1.053-.788h2.422c.71 0 1.1.391 1.1 1.1v12.38H22.9c.71 0 1.1.392 1.1 1.101zM11.034 2.947l6.337 18.104h-4.918l-1.052-3.131H6.019l-1.077 3.131H0L6.361 2.948h4.673zm-.66 10.96-1.69-5.014-1.541 5.015h3.23z" />
                </svg>
            ),
            name: "Anime",
            href: "/anime",
        },
        {
            icon: <PopcornIcon color="white" className=" size-6" />,
            name: "Popular Movies",
            href: "/categories/popular%20Movies/movie",
        },
       
        {
            icon: <Badge color="white" className=" size-6" />,
            name: "Anime Movie",
            href: "/anime-categories?type=movie",
        },

    ];
    const pathname = usePathname();
    const { isSearchOpen, setIsSearchOpen } = useSearchBarFocus();

    return (
        <nav className="justify-around z-50 sm:hidden bg-black/30 backdrop-blur-sm fixed flex bottom-0 w-full p-4">
            {mobileLinks.map((link) => (
                <Link
                    href={link.href}
                    key={link.name}
                    className={`p-3 transition-colors  rounded-full ${pathname == link.href ? "bg-red-600/65" : "hover:bg-red-600/65"}`} >
                    {link.icon}
                </Link>
            ))}
            <button
                onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                }}>
                <Search color="white" className=" size-6" />
            </button>
            <SearchInput />
        </nav>
    )
}