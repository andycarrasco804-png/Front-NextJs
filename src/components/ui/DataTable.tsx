"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Pagination } from "./Pagination";
import { EmptyState } from "./EmptyState";
import { Spinner } from "./Spinner";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  loading?: boolean;
  error?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  page?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  actionsPosition?: "left" | "right";
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading,
  error,
  emptyTitle = "No hay datos",
  emptyDescription,
  emptyAction,
  searchable,
  searchPlaceholder = "Buscar...",
  onSearch,
  searchTerm: externalSearchTerm,
  page,
  total,
  limit = 10,
  onPageChange,
  onRowClick,
  actions,
  actionsPosition = "right",
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const searchTerm = externalSearchTerm ?? internalSearch;

  const handleSearch = (value: string) => {
    setInternalSearch(value);
    onSearch?.(value);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortDir(null); setSortKey(null); }
      else { setSortKey(key); setSortDir("asc"); }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === "string"
        ? aVal.localeCompare(String(bVal))
        : Number(aVal) - Number(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const showSortIcon = (key: string) => {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {searchable && (
          <div className="h-10 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        )}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          <div className="bg-zinc-50 p-4 dark:bg-zinc-800">
            <div className="flex gap-8">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"
                />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-8 border-t border-zinc-100 p-4 dark:border-zinc-800">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-4 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div>
        {searchable && searchBar()}
        <EmptyState
          title={searchTerm ? "Sin resultados" : emptyTitle}
          description={searchTerm ? `No se encontraron coincidencias para "${searchTerm}"` : emptyDescription}
          action={!searchTerm ? emptyAction : undefined}
        />
      </div>
    );
  }

  function searchBar() {
    return (
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full max-w-xs rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-800"
        />
      </div>
    );
  }

  return (
    <div>
      {searchable && searchBar()}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              {actions && actionsPosition === "left" && (
                <th className="w-12 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Acciones
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400",
                    col.sortable && "cursor-pointer select-none hover:text-zinc-700 dark:hover:text-zinc-300",
                    col.hideOnMobile && "hidden sm:table-cell",
                    col.className
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="text-zinc-300 dark:text-zinc-600">{showSortIcon(col.key)}</span>
                    )}
                  </span>
                </th>
              ))}
              {actions && actionsPosition === "right" && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
            {sorted.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
              >
                {actions && actionsPosition === "left" && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300",
                      col.hideOnMobile && "hidden sm:table-cell",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "-")}
                  </td>
                ))}
                {actions && actionsPosition === "right" && (
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {page !== undefined && total !== undefined && onPageChange && (
        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
