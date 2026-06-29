"use client";

import Link from "next/link";

import type { AdminUserRow } from "@/types/admin";
import type { ApiUserStatus } from "@/types/admin-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<AdminUserRow["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Suspended: "bg-rose-50 text-rose-700 border-rose-200",
  Restricted: "bg-amber-50 text-amber-800 border-amber-200",
};

const SORT_OPTIONS = [
  {
    value: "createdAt:desc",
    sort: "createdAt" as const,
    order: "desc" as const,
    label: "Registered (newest)",
  },
  {
    value: "createdAt:asc",
    sort: "createdAt" as const,
    order: "asc" as const,
    label: "Registered (oldest)",
  },
  {
    value: "updatedAt:desc",
    sort: "updatedAt" as const,
    order: "desc" as const,
    label: "Updated (newest)",
  },
  {
    value: "updatedAt:asc",
    sort: "updatedAt" as const,
    order: "asc" as const,
    label: "Updated (oldest)",
  },
];

export function AdminUsersTable({
  rows,
  isLoading,
  search,
  onSearchChange,
  page,
  pageSize,
  total,
  onPageChange,
  sort,
  order,
  onSortChange,
  canManageStatus,
  onStatusChange,
  statusBusyId,
}: {
  rows: AdminUserRow[];
  isLoading?: boolean;
  search: string;
  onSearchChange: (q: string) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  sort: "createdAt" | "updatedAt";
  order: "asc" | "desc";
  onSortChange: (
    sort: "createdAt" | "updatedAt",
    order: "asc" | "desc",
  ) => void;
  canManageStatus: boolean;
  onStatusChange?: (userId: string, status: ApiUserStatus) => void;
  statusBusyId?: string | null;
}) {
  const sortValue = `${sort}:${order}`;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users by name, email, phone, ID…"
          className="h-11 max-w-md rounded-xl border-zinc-200 bg-white placeholder:text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={sortValue}
            onValueChange={(v) => {
              const opt = SORT_OPTIONS.find((o) => o.value === v);
              if (opt) onSortChange(opt.sort, opt.order);
            }}
          >
            <SelectTrigger className="h-11 w-[200px] rounded-xl border-zinc-200 bg-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/80">
              <TableHead>S.No</TableHead>
              <TableHead>Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-sm text-zinc-500"
                >
                  Loading users…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-sm text-zinc-500"
                >
                  No users match your filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u, index) => (
                <TableRow key={u.id} className="hover:bg-zinc-50/60">
                  <TableCell className="font-medium text-zinc-900">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="text-zinc-800">{u.fullName}</TableCell>
                  <TableCell className="text-zinc-700">{u.email}</TableCell>
                  <TableCell className="text-zinc-700">{u.phone}</TableCell>
                  <TableCell className="text-sm text-zinc-600">
                    {u.registeredAt}
                  </TableCell> 
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border",
                        STATUS_BADGE[u.status],
                      )}
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-lg border-zinc-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/users/${encodeURIComponent(u.id)}`}
                          >
                            View profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={!canManageStatus || statusBusyId === u.id}
                          onSelect={() => onStatusChange?.(u.id, "SUSPENDED")}
                        >
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!canManageStatus || statusBusyId === u.id}
                          onSelect={() => onStatusChange?.(u.id, "RESTRICTED")}
                        >
                          Restrict
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!canManageStatus || statusBusyId === u.id}
                          onSelect={() => onStatusChange?.(u.id, "ACTIVE")}
                        >
                          Activate
                        </DropdownMenuItem>
                        {!canManageStatus ? (
                          <p className="px-2 py-1.5 text-xs text-zinc-500">Requires admin permission</p>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          Page <span className="font-semibold text-zinc-900">{page}</span> of{" "}
          <span className="font-semibold text-zinc-900">{totalPages}</span>
          <span className="text-zinc-500"> · {total} users</span>
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-zinc-200 bg-white"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-zinc-200 bg-white"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
