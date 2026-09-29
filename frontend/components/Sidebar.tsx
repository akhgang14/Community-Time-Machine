"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "Investigate",
    href: "/investigate",
  },
  {
    label: "Recurring Questions",
    href: "/recurring-questions",
  },
  {
    label: "FAQ Review",
    href: "/faq-review",
  },
  {
    label: "Timeline",
    href: "/timeline",
  },
  {
    label: "Evidence",
    href: "/evidence",
  },
  {
    label: "Interventions",
    href: "/interventions",
  },
  {
    label: "Trends",
    href: "/trends",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <div className="brand-mark">
          CT
        </div>

        <div>
          <h1>
            Community
          </h1>

          <p>
            Time Machine
          </p>
        </div>

      </div>

      <nav className="sidebar-navigation">

        <p className="sidebar-section-label">
          WORKSPACE
        </p>

        {navigation.map((item) => {

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <span className="sidebar-link-indicator" />

              <span>
                {item.label}
              </span>
            </Link>
          );
        })}

      </nav>

      <div className="sidebar-footer">

        <div className="memory-status">

          <span className="memory-status-dot" />

          <div>
            <strong>
              Memory active
            </strong>

            <span>
              Historical context available
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
}