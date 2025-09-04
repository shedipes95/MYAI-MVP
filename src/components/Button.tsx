import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = {
  variant?: "primary" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: PropsWithChildren<Props>) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 shadow-none",
  } as const;

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
