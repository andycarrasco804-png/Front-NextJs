import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClienteForm } from "@/components/clientes/ClienteForm";

interface Props {
  params: Promise<{ id: string }>;
}

async function getCliente(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL!;
    const res = await fetch(`${base}/clientes/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data ?? body;
  } catch {
    return null;
  }
}

export default async function EditarClientePage({ params }: Props) {
  const { id } = await params;
  const cliente = await getCliente(id);
  if (!cliente) notFound();

  return (
    <div>
      <PageHeader title="Editar Cliente" description={`Editando: ${cliente.nombre}`} />
      <ClienteForm cliente={cliente} />
    </div>
  );
}
