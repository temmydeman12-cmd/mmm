'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPropertiesByOwner, deleteProperty } from '@/lib/storage';
import type { Property } from '@/lib/types';

export default function MyPropertiesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'landlord' && user?.role !== 'agent')) {
      router.push('/login');
      return;
    }

    const userProperties = getPropertiesByOwner(user.id);
    setProperties(userProperties);
  }, [isAuthenticated, user, router]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/add-property">Add New Property</Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't listed any properties yet.</p>
          <Button asChild>
            <Link href="/add-property">Add Your First Property</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {property.images.length > 0 ? (
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                )}
                <Badge className="absolute top-2 right-2 bg-emerald-600">
                  {property.type === 'rent' ? 'For Rent' : 'For Sale'}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {property.town}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  ₦{property.price.toLocaleString()}
                  {property.type === 'rent' && <span className="text-sm text-gray-500">/year</span>}
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/properties/${property.id}`}>View</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(property.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
