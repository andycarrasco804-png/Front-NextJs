import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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

export default async function DetalleClientePage({ params }: Props) {
  const { id } = await params;
  const cliente = await getCliente(id);

  if (!cliente) notFound();

  return (
    <div>
      <PageHeader
        title={cliente.nombre}
        description="Detalles del cliente"
        action={
          <Link href={`/clientes/${id}/editar`}>
            <Button>Editar</Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Email</dt>
            <dd className="font-medium">{cliente.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Teléfono</dt>
            <dd className="font-medium">{cliente.telefono ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">País</dt>
            <dd className="font-medium">{cliente.pais?.nombre ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Ciudad</dt>
            <dd className="font-medium">{cliente.ciudad ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Dirección</dt>
            <dd className="font-medium">{cliente.direccion ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Código Postal</dt>
            <dd className="font-medium">{cliente.codigoPostal ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Estado</dt>
            <dd>
              <Badge variant={cliente.estado === "activo" ? "active" : "inactive"}>
                {cliente.estado}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Creado</dt>
            <dd className="font-medium">
              {new Date(cliente.fechaCreacion).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
