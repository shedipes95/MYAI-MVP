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
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition";
  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
    ghost: "bg-transparent text-purple-700 hover:bg-purple-100",
  } as const;

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
