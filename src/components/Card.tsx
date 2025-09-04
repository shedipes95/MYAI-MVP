import { PropsWithChildren } from "react";

type Props = {
  title?: string;
  className?: string;
};

export default function Card({ title, className = "", children }: PropsWithChildren<Props>) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title && <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>}
      {children}
    </div>
  );
}
