import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  color?: "violet" | "mauve" | "red";
  className?: string;
}

export type Ref = HTMLButtonElement;

export const Button = forwardRef<Ref, Props>(
  ({ children, className, color = "violet", ...rest }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
        "border focus:outline-none focus-visible:ring focus-visible:ring-opacity-75",
        className,
        color === "red"
          ? "border-redDark-6 bg-redDark-3 text-redDark-11 hover:bg-redDark-4 focus-visible:bg-redDark-4 focus-visible:ring-redDark-6"
          : color === "mauve"
          ? "border-mauveDark-6 bg-mauveDark-3 text-mauveDark-11 hover:bg-mauveDark-4 focus-visible:bg-mauveDark-4 focus-visible:ring-mauveDark-6"
          : "border-violetDark-6 bg-violetDark-3 text-violetDark-11 hover:bg-violetDark-4 focus-visible:bg-violetDark-4 focus-visible:ring-violetDark-6"
      )}
      {...rest}
    >
      {children}
    </button>
  )
);

export default Button;
