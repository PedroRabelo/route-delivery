import {
  ArrowPathIcon,
  ArrowUpOnSquareIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Alert from "../../components/Alert";
import { Button } from "../../components/Button";
import { DataTableActions } from "../../components/DataTable/data-table-actions";
import { api } from "../../lib/axios";
import { DeliveryRoute } from "../../services/types/Delivery";
import {
  formatDateOnly,
  formatDatetime,
} from "../../services/utils/formatDateOnly";

export default function Deliveries() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  async function getRoutes() {
    const response = await api.get("/pedidos/roteiros");

    setRoutes(response.data);
  }

  useEffect(() => {
    getRoutes();
  }, []);

  function handleSelectFile(e: SyntheticEvent) {
    e.preventDefault();
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const fileUploaded = e.target.files[0];

      setFile(fileUploaded);
    }
  }

  async function uploadFile() {
    if (!file) {
      alert("Selecione um arquivo");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file!);

    try {
      await api
        .post("/pedidos/upload-sheet", formData)
        .then((res) => {
          alert("Salvo com sucesso");
          setIsLoading(false);
          setFile(undefined);
          getRoutes();
          api.get(`/pedidos/verifica-cadastro/${res.data.id}`);
        })
        .catch((e) => {
          console.log(e.response.data.message);
          alert(e.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log("Ocorreu um erro ao importar o arquivo");
    }
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="sm:grid grid-cols-2 sm:justify-between mx-auto py-4 px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Roteiro de entregas
            </h1>
            <ArrowPathIcon
              className="h-8 w-8 pt-1 cursor-pointer text-teal-600 focus:text-white"
              onClick={() => getRoutes()}
            />
          </div>

          {/* <NavLink to="/delivery-create" title="Novo roteiro">
            <Button
              type="button"
              title="Novo"
              icon={PlusIcon}
              color="primary"
            />
          </NavLink> */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-1 items-center border-2 rounded-lg w-96">
              <input
                className="hidden"
                type="file"
                accept=".xlsx, .xls"
                ref={hiddenFileInput}
                onChange={handleFileInput}
              />
              <Button
                color="primary"
                title="Selecione o arquivo"
                Icon={ArrowUpOnSquareIcon}
                onClick={handleSelectFile}
              />
              <label className="text-sm font-medium text-gray-700 pl-4">
                {file?.name}
              </label>
            </div>
            <Button
              title="Importar arquivo"
              color="primary"
              type="button"
              onClick={uploadFile}
              disabled={isLoading}
            />
          </div>
        </div>
      </header>

      {routes && routes?.length === 0 && (
        <Alert>Nenhum Pedido cadastrado</Alert>
      )}
      {routes && routes?.length > 0 && (
        <div className="flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Data Entrega
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>

                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Gerar rotas</span>
                        {/* <span className="sr-only">Excluir</span> */}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {routes &&
                      routes?.map((delivery: DeliveryRoute, index: number) => (
                        <tr
                          key={delivery?.id}
                          className={index % 2 === 0 ? undefined : "bg-gray-50"}
                        >
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {delivery?.id}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {formatDateOnly(delivery.data)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {delivery?.status}
                          </td>

                          <td className="relative whitespace-nowrap py-3 pl-2 pr-2 text-right text-sm font-medium sm:pr-12">
                            <div className="flex justify-end gap-4">
                              {delivery.status !== "AGUARDANDO_LAT_LONG" && (
                                <DataTableActions
                                  to={`/routes-delivery/${delivery.id}`}
                                  Icon={MapPinIcon}
                                  color="primary"
                                  title="Distribuir pedidos"
                                />
                              )}

                              {/* <label>Aguarde processamento das rotas</label> */}

                              {delivery.status === "AGUARDANDO_LAT_LONG" && (
                                <DataTableActions
                                  to="#"
                                  Icon={MapPinIcon}
                                  color="danger"
                                  title="Processando"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
