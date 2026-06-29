import { Skeleton } from "@/components/ui/skeleton";

export  function DataPlanCardSkeleton() {
  return (
    <div className="p-6 border-2 rounded-xl bg-white">      
      <div className="flex items-start justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>    
      <Skeleton className="h-10 w-24 mt-4" />    
      <Skeleton className="h-4 w-28 mt-2" />     
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
