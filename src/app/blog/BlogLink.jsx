"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BlogLink({ href, children, ...props }) {
  const router = useRouter();
  const prefetch = () => {
    const connection = navigator.connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return;
    router.prefetch(href);
  };
  return (
    <Link href={href} prefetch={false} onMouseEnter={prefetch} onFocus={prefetch} onTouchStart={prefetch} {...props}>
      {children}
    </Link>
  );
}
