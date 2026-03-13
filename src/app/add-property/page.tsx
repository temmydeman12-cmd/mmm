'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveProperty } from '@/lib/storage';
import { osunTowns } from '@/lib/data';
import type { Property } from '@/lib/types';

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'rent' as 'rent' | 'sale',
    propertyType: 'apartment',
    bedrooms: '1',
    bathrooms: '1',
    town: '',
    address: '',
    imageUrls: '',
    videoUrls: '',
  });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'landlord' && user?.role !== 'agent')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title || !formData.description || !formData.price || !formData.town || !formData.address) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const selectedTown = osunTowns.find(t => t.name === formData.town);
    if (!selectedTown) {
      setError('Invalid town selected');
      setLoading(false);
      return;
    }

    const newProperty: Property = {
      id: Math.random().toString(36).substring(2, 11),
      title: formData.title,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      type: formData.type,
      propertyType: formData.propertyType as any,
      bedrooms: Number.parseInt(formData.bedrooms),
      bathrooms: Number.parseInt(formData.bathrooms),
      town: formData.town,
      address: formData.address,
      lat: selectedTown.lat,
      lng: selectedTown.lng,
      images: formData.imageUrls ? formData.imageUrls.split('\n').map(url => url.trim()).filter(Boolean) : [],
      videos: formData.videoUrls ? formData.videoUrls.split('\n').map(url => url.trim()).filter(Boolean) : [],
      ownerId: user?.id || '',
      ownerName: user?.name || '',
      ownerPhone: user?.phone || '',
      ownerEmail: user?.email || '',
      createdAt: new Date().toISOString(),
      featured: false,
    };

    saveProperty(newProperty);
    router.push('/my-properties');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 3 Bedroom Apartment in Osogbo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the property..."
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Listing Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="1000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="town">Town *</Label>
              <Select value={formData.town} onValueChange={(value) => setFormData({ ...formData, town: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select town" />
                </SelectTrigger>
                <SelectContent>
                  {osunTowns.map(town => (
                    <SelectItem key={town.id} value={town.name}>{town.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter street address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrls">Image URLs (one per line)</Label>
              <Textarea
                id="imageUrls"
                value={formData.imageUrls}
                onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrls">Video URLs (one per line)</Label>
              <Textarea
                id="videoUrls"
                value={formData.videoUrls}
                onChange={(e) => setFormData({ ...formData, videoUrls: e.target.value })}
                placeholder="https://example.com/video1.mp4"
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? 'Adding Property...' : 'Add Property'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
