import { useState } from "react"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  handleChangeTabBar: (tabSelected: string) => void;
  deliveries?: { withTruck: number; noTruck: number }
}

export default function DeliveryTab({ handleChangeTabBar, deliveries }: Props) {
  const [tabSelected, setTabSelected] = useState('Entregues')

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabSelected}
        >
          <option>Com Veículo</option>
          <option>Sem Veículo</option>
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          <a
            onClick={() => {
              setTabSelected('Entregues')
              handleChangeTabBar('Entregues')
            }}
            className={classNames(
              tabSelected === 'Entregues' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800',
              'flex flex-row px-1 py-2 font-medium text-sm rounded-md cursor-pointer'
            )}
            aria-current={tabSelected ? 'page' : undefined}
          >
            Com Veículo
            <span
              className="text-green-600 hidden ml-1 py-0.5 px-1.5 rounded-full text-sm font-medium md:inline-block"
            >
              {deliveries?.withTruck ?
                deliveries.withTruck
                : 0}
            </span>
          </a>
          <a
            onClick={() => {
              setTabSelected('Não Entregues')
              handleChangeTabBar('Não Entregues')
            }}
            className={classNames(
              tabSelected === 'Não Entregues' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800',
              'flex flex-row px-1 py-2 font-medium text-sm rounded-md cursor-pointer'
            )}
            aria-current={tabSelected ? 'page' : undefined}
          >
            Sem Veículo

            <span
              className="text-red-600 hidden ml-1 py-0.5 px-1.5 rounded-full text-sm font-medium md:inline-block"
            >
              {deliveries?.noTruck ?
                deliveries.noTruck
                : 0}
            </span>
          </a>
        </nav>
      </div>
    </div>
  )
}
