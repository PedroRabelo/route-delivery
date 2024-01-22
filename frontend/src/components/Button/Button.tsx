import { ButtonHTMLAttributes, SVGProps } from "react";
import { MoonLoader } from "react-spinners";

type Props = {
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  title: String;
  color: "primary" | "secondary";
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Button({ Icon, title, color, loading, type, ...rest }: Props) {
  return (
    <button
      type={type}
      className={classNames(
        rest.disabled ? "bg-cyan-600 text-white cursor-not-allowed" :
          color === "primary"
            ? "focus:ring-cyan-700 text-white bg-cyan-600 hover:bg-cyan-800"
            : "text-black bg-cyan-50 border-cyan-700 hover:bg-cyan-600 hover:text-white focus:ring-cyan-700",
        "inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
      )}
      {...rest}
    >
      {loading && <MoonLoader color="#fff" size={18} className="-ml-1 mr-2 h-5 w-5" />}

      {Icon && (
        <Icon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      )}
      {title}
    </button>
  );
}
