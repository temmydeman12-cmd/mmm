'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { getProperties } from '@/lib/storage';
import type { Property } from '@/lib/types';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-200 animate-pulse rounded-lg" />
});

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const allProperties = getProperties();
    setProperties(allProperties);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Properties Map</h1>
      <Card className="p-4">
        <MapComponent properties={properties} />
      </Card>
    </div>
  );
}
