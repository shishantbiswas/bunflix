"use client";

import {
  Badge,
  ChevronDown,
  CrownIcon,
  PopcornIcon,
  Search,
} from "lucide-react";
import { useRef, useState } from "react";
import { useSearchBarFocus } from "@/context/search-context";
import NavLink from "./nav-link";
import SearchInput from "./search-input";
import Link from "@/components/link";
import useWindowScroll from "@/hooks/useWindowScroll";
import { usePathname } from "next/navigation";

type LinkArray = {
  id: number
  linkName: string,
  href: string,
  icon?: React.ReactNode;
  onMouseEnter: () => void,
  onClick: () => void,
}

export default function Navbar() {

  const [navIndex, setNavIndex] = useState(2);
  const { isSearchOpen, setIsSearchOpen } = useSearchBarFocus();
  const linkref = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState(true);
  const y = useWindowScroll(60)

  const navLinks: LinkArray[] = [
    {
      linkName: "Home",
      href: "/",
      onMouseEnter: () => setNavIndex(0),
      onClick: () => setNavIndex(0),
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className=" size-4 fill-white"
        >
          <title>AniList</title>

          <path d="M24 17.53v2.421c0 .71-.391 1.101-1.1 1.101h-5l-.057-.165L11.84 3.736c.106-.502.46-.788 1.053-.788h2.422c.71 0 1.1.391 1.1 1.1v12.38H22.9c.71 0 1.1.392 1.1 1.101zM11.034 2.947l6.337 18.104h-4.918l-1.052-3.131H6.019l-1.077 3.131H0L6.361 2.948h4.673zm-.66 10.96-1.69-5.014-1.541 5.015h3.23z" />
        </svg>
      ),
      linkName: "Anime",
      href: "/anime",
      onMouseEnter: () => setNavIndex(1),
      onClick: () => setNavIndex(1),
    },
    {
      icon: <PopcornIcon color="white" className=" size-4" />,
      linkName: "Popular Movies",
      href: "/categories/popular%20Movies/movie",
      onMouseEnter: () => setNavIndex(2),
      onClick: () => setNavIndex(2),
    },
    {
      icon: <CrownIcon color="white" className=" size-4" />,
      linkName: "Most Favorite Anime",
      href: "/anime-categories?type=most-favorite",
      onMouseEnter: () => setNavIndex(3),
      onClick: () => setNavIndex(3),
    },
    {
      icon: <Badge color="white" className=" size-4" />,
      linkName: "Anime Movie",
      href: "/anime-categories?type=movie",
      onMouseEnter: () => setNavIndex(4),
      onClick: () => setNavIndex(4),
    },
    {
      icon: <Badge color="white" className=" size-4" />,
      linkName: "Netflix",
      href: "/categories/netflix/tv",
      onMouseEnter: () => setNavIndex(5),
      onClick: () => setNavIndex(5),
    },
    {
      icon: <Badge color="white" className=" size-4" />,
      linkName: "Amazon Prime",
      href: "/categories/amazon/tv",
      onMouseEnter: () => setNavIndex(5),
      onClick: () => setNavIndex(5),
    },
    {
      icon: <Badge color="white" className=" size-4" />,
      linkName: "HBO TV",
      href: "/categories/hbo/tv",
      onMouseEnter: () => setNavIndex(5),
      onClick: () => setNavIndex(5),
    },
  ].map((link, i) => ({ ...link, id: i + 1 }));


  return (
    <section className="h-20 bg-black/80 w-full relative flex justify-center">
      <nav className={`bg-black/30 backdrop-blur h-20 transition-all ${y > 90 ? "w-[calc(100%_-_30px)] mt-4 rounded-lg" : "w-full"} px-6 fixed mb-20 z-[500] top-0 flex items-center justify-between `}>
        <div className="flex items-center">
          <img loading="lazy" src="/favicon.ico" className="size-4 mr-4" alt="favicon" />
          <div ref={linkref} className="group flex">
            {navLinks.slice(0, 2).map((link) => (
              <NavLink
                key={link.id}
                onClick={link.onClick}
                onMouseEnter={link.onMouseEnter}
                href={link.href}
                linkName={link.linkName}
              />
            ))}
            <LinkFollower
              width={linkref.current?.children[navIndex]?.getBoundingClientRect()
                .width || 0}
              translate={`${(linkref.current?.children[navIndex]?.getBoundingClientRect()
                .left ?? 0) - 16
                }px`} />

          </div>

          <Dropdown
            navLinks={navLinks}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown} />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
            }}
            className=" flex items-center gap-2 py-1.5 px-3"
          >
            <Search color="white" className=" size-6" />
            <span className="hidden lg:flex">Search</span>
          </button>
          <Link
            target="_blank"
            href="https://github.com/shishantbiswas/bunflix"
            className="flex items-center gap-2 text-nowrap"
          >
            <GithubIcon />
          </Link>
        </div>
      </nav>
      <SearchInput />
    </section>
  );
}

function Dropdown({ navLinks, openDropdown, setOpenDropdown }: {
  setOpenDropdown: (e: boolean) => void;
  openDropdown: boolean;
  navLinks: LinkArray[]
}) {

  const pathname = usePathname()
  return (
    <div
      onClick={() => setOpenDropdown(!openDropdown)}
      onMouseEnter={() => setOpenDropdown(true)}
      onMouseLeave={() => setOpenDropdown(false)}
      className="flex cursor-pointer items-center gap-2 py-1.5 px-3 relative group"
    >
      <span>More</span>
      <ChevronDown className="size-4 group-hover:rotate-180 transition-transform duration-200" />
      <div className={`h-12 w-24 -bottom-12 absolute ${openDropdown ? " pointer-events-auto" : "pointer-events-none"}`} />
      <div className={`rounded-lg bg-black/70 space-y-2 backdrop-blur-3xl p-2 absolute top-20 translate-x-1/2 -right-1/2 transition-all duration-300
        ${openDropdown ? "opacity-100 pointer-events-auto translate-y-[-30px]" : "opacity-0 pointer-events-none translate-y-0"} `}>
        {navLinks.slice(2).map((link) => (
          <Link
            onClick={() => setOpenDropdown(!openDropdown)}
            href={link.href}
            className="px-2.5 py-3 w-full flex rounded-md transition-all h-fit hover:bg-white/20 gap-4 text-nowrap items-center"
            key={link.id}
            style={{
              backgroundColor: pathname === link.href ? "#dc2626" : "",
            }}
          >
            {link.icon}
            <button>{link.linkName}</button>
          </Link>
        ))}
      </div>
    </div>
  )
}


function LinkFollower({ translate, width }: { width: number, translate: string }) {
  return <div
    style={{
      translate: translate,
      width: width,
    }}
    className="group-hover:bg-white h-2 bottom-2 left-4 absolute transition-all  ease-in-out"
  />
}

function GithubIcon() {
  return (
    <svg
      className=" size-6 fill-white"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}