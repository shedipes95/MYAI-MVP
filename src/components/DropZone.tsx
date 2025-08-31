import { useRef, useState } from "react";

type Props = {
  label: string;
  onFile: (file: File) => void;
  accept?: string;
};

export default function DropZone({ label, onFile, accept = ".csv,text/csv" }: Props) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  }

  return (
    <div className="flex items-center gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`flex h-20 w-full max-w-xl cursor-pointer items-center justify-center rounded-xl border-2 border-dashed px-4 text-sm ${
          over ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <span className="text-gray-600">{label}</span>
      </div>
      <button
        type="button"
        className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
        onClick={() => inputRef.current?.click()}
      >
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
