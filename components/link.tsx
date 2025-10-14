"use client";
import { useGlobalTransition } from "@/context/transition-context";
import NextLink, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { HTMLAttributeAnchorTarget, PropsWithChildren } from "react";

export default function Link({
  href,
  className,
  id,
  style,target,
  ...props
}: {
  className?: string;
  id?: string;
  style?: React.CSSProperties | undefined;
  target?: HTMLAttributeAnchorTarget | undefined
} & LinkProps & PropsWithChildren) {
  
  const { startTransition } = useGlobalTransition();
  const router = useRouter();

  return (
    <NextLink
      {...props}
      className={className}
      id={id}
      style={style}
      target={target}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        startTransition(() => {
          router.push(href.toString());
        });
      }}
    />
  );
}
