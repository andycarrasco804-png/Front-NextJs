import { PageHeader } from "@/components/layout/PageHeader";
import { ClienteForm } from "@/components/clientes/ClienteForm";

export default function NuevoClientePage() {
  return (
    <div>
      <PageHeader title="Nuevo Cliente" description="Completa el formulario para registrar un nuevo cliente" />
      <ClienteForm />
    </div>
  );
}
