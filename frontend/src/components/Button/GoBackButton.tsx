import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function GoBackButton() {
  return (
    <button
      type="button"
      onClick={() => null}
      className="inline-flex items-center px-4 py-0 border border-transparent text-base font-medium rounded-md"
    >
      <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
      Voltar
    </button>
  );
}
