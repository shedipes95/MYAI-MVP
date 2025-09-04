type Props = {
  value: number; // 0..1
};

export default function ProgressBar({ value }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
        style={{ width: `${pct}%`, transition: "width 300ms ease-out" }}
      />
    </div>
  );
}
