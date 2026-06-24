import { Card, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";

async function getStats() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL!;
    const [clientesRes, paisesRes] = await Promise.all([
      fetch(`${base}/clientes?page=1&limit=1`),
      fetch(`${base}/paises`),
    ]);
    const clientes = await clientesRes.json();
    const paises = await paisesRes.json();
    return {
      totalClientes: clientes.meta?.total ?? 0,
      totalPaises: Array.isArray(paises) ? paises.length : paises.data?.length ?? 0,
    };
  } catch {
    return { totalClientes: 0, totalPaises: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <PageHeader title="Dashboard" description="Resumen general del sistema" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/clientes">
          <Card className="transition-colors hover:border-zinc-400 dark:hover:border-zinc-500">
            <CardTitle>Clientes</CardTitle>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats.totalClientes}
            </p>
            <p className="mt-1 text-sm text-zinc-500">registrados</p>
          </Card>
        </Link>
        <Link href="/paises">
          <Card className="transition-colors hover:border-zinc-400 dark:hover:border-zinc-500">
            <CardTitle>Países</CardTitle>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats.totalPaises}
            </p>
            <p className="mt-1 text-sm text-zinc-500">disponibles</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
