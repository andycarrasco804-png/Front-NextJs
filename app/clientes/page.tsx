"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClienteForm } from "@/components/clientes/ClienteForm";
import { clientesService } from "@/services/clientes.service";
import { useDebounce } from "@/lib/useDebounce";
import type { Cliente } from "@/types";

const columns: Column<Cliente>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "nombre", header: "Nombre", sortable: true },
  { key: "email", header: "Email", sortable: true, hideOnMobile: true },
  {
    key: "estado",
    header: "Estado",
    sortable: true,
    render: (c) => (
      <Badge variant={c.estado === "activo" ? "active" : "inactive"}>
        {c.estado}
      </Badge>
    ),
  },
  {
    key: "pais",
    header: "País",
    render: (c) => c.pais?.nombre ?? "-",
    hideOnMobile: true,
  },
  {
    key: "fechaCreacion",
    header: "Creado",
    sortable: true,
    render: (c) => new Date(c.fechaCreacion).toLocaleDateString("es-ES"),
    hideOnMobile: true,
  },
];

export default function ClientesPage() {
  const router = useRouter();
  const [allData, setAllData] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const load = useCallback(async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await clientesService.getAll(page, meta.limit);
      setAllData(res.data);
      setMeta(res.meta);
    } catch {
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }, [meta.limit]);

  useEffect(() => {
    load(meta.page);
  }, [meta.page, load]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return allData;
    const q = debouncedSearch.toLowerCase();
    return allData.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [allData, debouncedSearch]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await clientesService.delete(id);
      load(meta.page);
    } catch {
      setError("Error al eliminar cliente");
    }
  };

  return (
    <div>
      <PageHeader
        title="Clientes"
        description={`Gestión de clientes registrados${debouncedSearch ? ` (filtrados)` : ""}`}
        action={
          <Button onClick={() => router.push("/clientes/nuevo")}>
            + Nuevo Cliente
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(c) => c.id}
        loading={loading}
        error={error}
        searchable
        searchTerm={search}
        onSearch={setSearch}
        searchPlaceholder="Buscar por nombre o email..."
        page={meta.page}
        total={meta.total}
        limit={meta.limit}
        onPageChange={(p) => setMeta((prev) => ({ ...prev, page: p }))}
        emptyTitle="No hay clientes"
        emptyDescription="Crea tu primer cliente para comenzar"
        emptyAction={
          <Button onClick={() => router.push("/clientes/nuevo")}>
            + Nuevo Cliente
          </Button>
        }
        actionsPosition="left"
        actions={(c) => (
          <DropdownMenu
            trigger={<span className="text-lg font-medium leading-none">⋯</span>}
            items={[
              {
                label: "Editar",
                onClick: () => setEditingCliente(c),
              },
              {
                label: "Eliminar",
                variant: "danger",
                onClick: () => handleDelete(c.id),
              },
            ]}
          />
        )}
      />

      <Modal
        open={!!editingCliente}
        onClose={() => setEditingCliente(null)}
        title="Editar Cliente"
      >
        {editingCliente && (
          <ClienteForm
            cliente={editingCliente}
            onSuccess={() => {
              setEditingCliente(null);
              load(meta.page);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
