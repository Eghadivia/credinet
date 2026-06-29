import { Skeleton } from "@/components/ui/skeleton";

 export function TableSkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="px-6 py-5">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-5">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="px-6 py-5">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-6 py-5">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>
      <td className="px-6 py-5">
        <Skeleton className="h-4 w-36" />
      </td>
      <td className="px-6 py-5">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
        </div>
      </td>
    </tr>
  );
}