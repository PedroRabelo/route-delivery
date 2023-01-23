import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateOnly(responseDate: Date) {
  const dateStr: string = new Date(responseDate).toString();
  const date = new Date(dateStr);
  const result = new Date(date.toISOString().slice(0, -1));

  return format(new Date(result), "dd/MM/yyyy", { locale: ptBR });
}
