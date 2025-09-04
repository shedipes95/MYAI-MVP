type Props = {
  tone?: "info" | "success" | "error";
  children: React.ReactNode;
};
export default function StatusAlert({ tone = "info", children }: Props) {
  const cls =
    tone === "success"
      ? "bg-green-50 text-green-800 border-green-200"
      : tone === "error"
        ? "bg-red-50 text-red-800 border-red-200"
        : "bg-blue-50 text-blue-800 border-blue-200";
  return <div className={`rounded-lg border px-3 py-2 text-sm ${cls}`}>{children}</div>;
}
