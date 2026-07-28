import { useLiveQuery } from "dexie-react-hooks";
// Hook que re-renderiza sozinho quando a tabela muda no banco.
// Ex.: const serves = useLiveTable(() => serveRepo.all(), []);
export function useLiveTable(queryFn, deps = []) {
  return useLiveQuery(queryFn, deps);
}
