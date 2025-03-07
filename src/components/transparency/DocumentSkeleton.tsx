
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentSkeleton = () => (
  <div className="h-full">
    <Card className="bg-white bg-opacity-70 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-glass h-full">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <Skeleton className="h-14 w-14 rounded-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4 flex-grow" />
        <Skeleton className="h-9 w-32" />
      </CardContent>
    </Card>
  </div>
);

export default DocumentSkeleton;
