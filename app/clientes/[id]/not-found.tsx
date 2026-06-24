import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Cliente no encontrado</h2>
      <p className="mt-2 text-zinc-500">El cliente que buscas no existe o fue eliminado.</p>
      <Link href="/clientes" className="mt-6">
        <Button>Volver a Clientes</Button>
      </Link>
    </div>
  );
}
