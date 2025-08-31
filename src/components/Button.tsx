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
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  } as const;

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
