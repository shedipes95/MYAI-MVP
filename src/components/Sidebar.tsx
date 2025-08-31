import { NavLink } from "react-router-dom";
type Item = { label: string; to: string };

const main: Item[] = [
  { label: "Budget", to: "/budget" },
  { label: "Accounts", to: "/accounts" },
  { label: "MyAI Chat", to: "/chat" },
  { label: "Save", to: "/save" },
  { label: "Loans", to: "/loans" },
  { label: "Insurance", to: "/insurance" },
];
const extra: Item[] = [{ label: "Upload CSV", to: "/ingest" }];

function ItemLink({ it }: { it: Item }) {
  return (
    <NavLink
      to={it.to}
      className={({ isActive }) =>
        [
          "group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm",
          isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100",
        ].join(" ")
      }
    >
      <span>{it.label}</span>
      <span className="pointer-events-none opacity-0 transition group-hover:opacity-100">
        <span className="rounded-md bg-gray-800 px-2 py-1 text-xs font-semibold text-white">
          GO
        </span>
      </span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r bg-white">
      <nav className="p-2">
        <ul className="space-y-1">{main.map((i) => <li key={i.to}><ItemLink it={i} /></li>)}</ul>
        <div className="my-3 h-px bg-gray-200" />
        <ul className="space-y-1">{extra.map((i) => <li key={i.to}><ItemLink it={i} /></li>)}</ul>
      </nav>
    </aside>
  );
}
