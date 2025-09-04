import { useRef, useState } from "react";

type Props = {
  label: string;
  onFile: (file: File) => void;
  accept?: string;
  disabled?: boolean;
};

export default function DropZone({
  label,
  onFile,
  accept = ".csv,text/csv",
  disabled = false,
}: Props) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (disabled) return;
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }

  return (
    <div className="flex items-center gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`flex h-20 w-full max-w-xl items-center justify-center rounded-xl border-2 border-dashed px-4 text-sm ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : over
              ? "border-blue-400 bg-blue-50 cursor-pointer"
              : "border-gray-300 bg-white cursor-pointer"
        }`}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <span className="text-gray-600">{label}</span>
      </div>
      <button
        type="button"
        disabled={disabled}
        className={`rounded-lg border px-3 py-2 text-sm ${
          disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
