"use client";

import { useState, useEffect } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import type { Pais } from "@/types";

const columns: Column<Pais>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "nombre", header: "Nombre", sortable: true },
  { key: "codigoIso", header: "Código ISO", sortable: true },
];

export default function PaisesPage() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/backend/paises")
      .then((res) => res.json())
      .then((body) => setPaises(body.data ?? body ?? []))
      .catch(() => setError("Error al cargar países"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Países" description="Lista de países disponibles" />
      <DataTable
        columns={columns}
        data={paises}
        keyExtractor={(p) => p.id}
        loading={loading}
        error={error}
        searchable
        searchPlaceholder="Buscar país..."
        emptyTitle="No hay países"
      />
    </div>
  );
}
