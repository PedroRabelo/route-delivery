import { SVGProps } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  to: string;
  color: "primary" | "danger";
  title: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function DataTableActions({ Icon, to, color, title }: Props) {
  return (
    <NavLink to={to} title={title}
      className={classNames(
        color === "primary"
          ? "text-indigo-600 hover:text-indigo-900"
          : "text-red-600 hover:text-red-900",
        "flex flex-col items-center"
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="text-xs">{title}</span>
    </NavLink>
  );
}
