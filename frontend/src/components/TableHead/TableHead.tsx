import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type Headers = {
  accessor: string;
  label: string;
  sortable: boolean;
}

type Props = {
  columns: Headers[],
  handleSorting?: (sortField: string | number, sortOrder: string) => void;
}

export function TableHead({ columns, handleSorting }: Props) {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  function handleSortingChange(accessor: string) {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    //handleSorting(accessor, sortOrder);
  }

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map(({ label, accessor, sortable }) => {
          if (!sortable) {
            return (
              <th
                key={accessor}
                scope="col"
                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
              >
                {label}
              </th>
            )
          } else {
            <th
              key={accessor}
              scope="col"
              className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left backdrop-blur backdrop-filter sm:table-cell"
            >
              <a
                onClick={sortable ? () => handleSortingChange(accessor) : () => null}
                className="group inline-flex text-sm font-semibold text-gray-900"
              >
                {label}
                <span className="ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                  {sortField === accessor && order === 'asc' ? (
                    <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                  ) :
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                  }
                </span>
              </a>
            </th>
          }
        })}
      </tr>
    </thead>
  )
}