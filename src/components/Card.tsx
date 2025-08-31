import { PropsWithChildren } from "react";

type Props = {
  title?: string;
  className?: string;
};

export default function Card({ title, className = "", children }: PropsWithChildren<Props>) {
  return (
    <div className={`rounded-xl border border-purple-200 bg-white p-4 shadow-sm ${className}`}>
      {title && <h3 className="mb-3 text-lg font-semibold text-purple-800">{title}</h3>}
      {children}
    </div>
  );
}
