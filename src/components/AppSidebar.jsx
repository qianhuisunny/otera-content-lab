import {
  Buildings,
  ShieldCheck,
  SquaresFour,
  Target,
  UsersThree,
} from "@phosphor-icons/react";

const navigationItems = [
  { href: "#overview", label: "Overview", icon: SquaresFour },
  { href: "#company", label: "Company", icon: Buildings },
  { href: "#artifact-icp-context", label: "ICP & market fit", icon: Target },
  { href: "#personas", label: "Personas", icon: UsersThree },
  { href: "#evidence", label: "Evidence notes", icon: ShieldCheck },
];

export function AppSidebar({ researchCutoff }) {
  return (
    <aside className="app-sidebar" aria-label="Otera context navigation">
      <div className="workspace-identity">
        <span className="workspace-avatar" aria-hidden="true">
          OT
        </span>
        <span>
          <strong>Otera</strong>
          <small>Company context</small>
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="On this page">
        {navigationItems.map(({ href, label, icon: Icon }) => (
          <a href={href} key={href}>
            <Icon size={17} weight="regular" aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-status">
          <span aria-hidden="true" />
          Local snapshot
        </span>
        <small>Research cutoff {researchCutoff}</small>
      </div>
    </aside>
  );
}
