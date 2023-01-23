import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../Button";

type Props = {
  title: string;
  link: string;
};

export function DataTableHeader({ title, link }: Props) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <a href={link}>
          <Button
            type="button"
            title="Novo"
            Icon={PlusIcon}
            color="primary"
          />
        </a>
      </div>
    </div>
  );
}
