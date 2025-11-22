"use client";

import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-gray-400">›</span>
          )}
        </div>
      ))}
    </nav>
  );
}
