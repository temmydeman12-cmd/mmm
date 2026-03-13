'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getProperties } from '@/lib/storage';
import { osunTowns } from '@/lib/data';
import type { Property } from '@/lib/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    town: 'all',
    type: 'all',
    propertyType: 'all',
    searchQuery: '',
  });

  useEffect(() => {
    const allProperties = getProperties();
    setProperties(allProperties);
    setFilteredProperties(allProperties);
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    if (filters.town !== 'all') {
      filtered = filtered.filter(p => p.town === filters.town);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.town.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Properties</h1>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search properties..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
            <Select value={filters.town} onValueChange={(value) => setFilters({ ...filters, town: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Town" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Towns</SelectItem>
                {osunTowns.map(town => (
                  <SelectItem key={town.id} value={town.name}>{town.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Rent or Sale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.propertyType} onValueChange={(value) => setFilters({ ...filters, propertyType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">{filteredProperties.length} properties found</p>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
          <Button asChild>
            <Link href="/register">List a Property</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                  <span className="capitalize">{property.propertyType}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/properties/${property.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
