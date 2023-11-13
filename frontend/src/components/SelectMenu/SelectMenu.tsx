import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Vehicle } from '../../services/types/Vehicle'
import { formatNumber } from '../../services/utils/formatNumber'

type Props = {
  vehicles: Vehicle[];
  handleSelectVehicle: (vehicleId: Vehicle) => void;
  deliveriesWeight: number;
}

export default function SelectMenu({ vehicles, handleSelectVehicle, deliveriesWeight }: Props) {
  const [selected, setSelected] = useState<Vehicle>(vehicles[0])

  function handleOnChange(vehicle: Vehicle) {
    setSelected(vehicle);
    handleSelectVehicle(vehicle)
  }

  useEffect(() => {
    handleOnChange(vehicles[0])
  }, [])

  return (
    <Listbox value={selected} onChange={(value) => handleOnChange(value)}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Veículos</Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <span className="inline-flex w-full truncate">
                <span className="truncate">
                  {selected.placa}
                </span>
                <span className={classNames(deliveriesWeight > selected.capacidade ? 'text-red-500' : 'text-gray-500', 'ml-2 truncate')}>
                  {formatNumber(selected.capacidade)} KG
                </span>
                <span className="ml-2 truncate text-gray-500">
                  {selected.temRodizio && 'Rodízio'}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {vehicles.map((vehicle) => (
                  <Listbox.Option
                    key={vehicle.placa}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={vehicle}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'truncate')}>
                            {vehicle.placa}
                          </span>
                          <span className={classNames(deliveriesWeight > vehicle.capacidade ? 'text-red-500' : 'text-gray-500', 'ml-2 truncate')}>
                            {formatNumber(vehicle.capacidade)} KG
                          </span>
                          <span className={classNames(active ? 'text-indigo-200' : 'text-red-500', 'ml-2 truncate')}>
                            {vehicle.temRodizio && 'Rodízio'}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
