"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { paisesService } from "@/services/paises.service";
import { clientesService } from "@/services/clientes.service";
import type { Cliente, Pais, CrearClientePayload } from "@/types";

interface ClienteFormProps {
  cliente?: Cliente;
  onSuccess?: () => void;
}

type FormErrors = Partial<Record<keyof CrearClientePayload | "estado", string>>;

const initialState: CrearClientePayload & { estado: string } = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  paisId: undefined,
  codigoPostal: "",
  estado: "activo",
};

export function ClienteForm({ cliente, onSuccess }: ClienteFormProps) {
  const router = useRouter();
  const isEdit = !!cliente;
  const [paises, setPaises] = useState<Pais[]>([]);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    paisesService
      .getAll()
      .then(setPaises)
      .catch(() => setLoadError("Error al cargar países"));
  }, []);

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono ?? "",
        direccion: cliente.direccion ?? "",
        ciudad: cliente.ciudad ?? "",
        paisId: cliente.paisId ?? undefined,
        codigoPostal: cliente.codigoPostal ?? "",
        estado: cliente.estado,
      });
    }
  }, [cliente]);

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    if (!form.nombre || form.nombre.length < 2) errs.nombre = "Mínimo 2 caracteres";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email inválido";
    return errs;
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "paisId" ? (value ? Number(value) : undefined) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        telefono: form.telefono || undefined,
        direccion: form.direccion || undefined,
        ciudad: form.ciudad || undefined,
        codigoPostal: form.codigoPostal || undefined,
        paisId: form.paisId || undefined,
      };

      if (isEdit) {
        await clientesService.update(cliente!.id, payload);
      } else {
        await clientesService.create(payload);
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/clientes");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      setErrors({ nombre: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return <p className="text-center text-red-500">{loadError}</p>;
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="nombre"
          name="nombre"
          label="Nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          error={errors.nombre}
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="telefono"
            name="telefono"
            label="Teléfono"
            placeholder="+54 11 1234-5678"
            value={form.telefono}
            onChange={handleChange}
          />
          <Input
            id="ciudad"
            name="ciudad"
            label="Ciudad"
            placeholder="Buenos Aires"
            value={form.ciudad}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="paisId"
            name="paisId"
            label="País"
            placeholder="Seleccionar país"
            options={paises.map((p) => ({ value: p.id, label: p.nombre }))}
            value={form.paisId ?? ""}
            onChange={handleChange}
          />
          <Input
            id="codigoPostal"
            name="codigoPostal"
            label="Código Postal"
            placeholder="1000"
            value={form.codigoPostal}
            onChange={handleChange}
          />
        </div>
        <Input
          id="direccion"
          name="direccion"
          label="Dirección"
          placeholder="Av. Siempre Viva 742"
          value={form.direccion}
          onChange={handleChange}
        />
        {isEdit && (
          <Select
            id="estado"
            name="estado"
            label="Estado"
            options={[
              { value: "activo", label: "Activo" },
              { value: "inactivo", label: "Inactivo" },
            ]}
            value={form.estado}
            onChange={handleChange}
          />
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => (onSuccess ? onSuccess() : router.back())}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
