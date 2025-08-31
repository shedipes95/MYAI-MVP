type Props = {
  value: number; // 0..1
};

export default function ProgressBar({ value }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-purple-200">
      <div
        className="h-full bg-purple-600"
        style={{ width: `${pct}%`, transition: "width 200ms" }}
      />
    </div>
  );
}
