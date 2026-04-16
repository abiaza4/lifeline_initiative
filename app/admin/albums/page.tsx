'use client';

import { useEffect, useState, useRef } from 'react';
import { albums } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Star, ImageIcon, Upload, Loader2, Images } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const categories = ['Projects', 'Events', 'Certificates & Awards', 'Field Activities'];

interface Album {
  id: number;
  title: string;
  description: string | null;
  coverImage: string | null;
  category: string;
  date: string | null;
  location: string | null;
  isFeatured: boolean;
  isActive: boolean;
  photos: { image: string }[];
  _count: { photos: number };
}

export default function AlbumsPage() {
  const router = useRouter();
  const [albumsList, setAlbumsList] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    category: 'Projects',
    date: '',
    location: '',
    isFeatured: false,
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await albums.getAll();
      setAlbumsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData({ ...formData, coverImage: data.url });
      setImagePreview(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
      };
      
      if (editingAlbum) {
        await albums.update(editingAlbum.id, submitData);
      } else {
        await albums.create(submitData);
      }
      setDialogOpen(false);
      resetForm();
      fetchAlbums();
    } catch (error) {
      console.error('Failed to save album:', error);
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      description: album.description || '',
      coverImage: album.coverImage || '',
      category: album.category,
      date: album.date ? album.date.split('T')[0] : '',
      location: album.location || '',
      isFeatured: album.isFeatured,
      isActive: album.isActive,
    });
    setImagePreview(album.coverImage || '');
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this album? All photos in this album will also be deleted.')) {
      try {
        await albums.delete(id);
        fetchAlbums();
      } catch (error) {
        console.error('Failed to delete album:', error);
      }
    }
  };

  const handleFeature = async (id: number) => {
    try {
      await albums.feature(id);
      fetchAlbums();
    } catch (error) {
      console.error('Failed to toggle feature:', error);
    }
  };

  const resetForm = () => {
    setEditingAlbum(null);
    setFormData({
      title: '',
      description: '',
      coverImage: '',
      category: 'Projects',
      date: '',
      location: '',
      isFeatured: false,
      isActive: true,
    });
    setImagePreview('');
  };

  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}${url}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Projects': return 'bg-blue-500';
      case 'Events': return 'bg-purple-500';
      case 'Certificates & Awards': return 'bg-yellow-500';
      case 'Field Activities': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gallery Albums</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Album
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAlbum ? 'Edit Album' : 'Add New Album'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Album Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., 2024 Flood Relief Project"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this album..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Torit, Eastern Equatoria"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Cover Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                      {imagePreview || formData.coverImage ? (
                        <Image 
                          src={getImageUrl(formData.coverImage)} 
                          alt="Preview" 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      )}
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? 'Uploading...' : 'Upload Cover'}
                      </Button>
                      <p className="text-xs text-muted-foreground">JPEG, PNG (max 5MB)</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {editingAlbum ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {albumsList.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No albums found. Click "Add Album" to create one.</p>
          </div>
        ) : (
          albumsList.map((album) => (
            <Card key={album.id} className="overflow-hidden">
              <div className="relative h-48">
                {album.coverImage || album.photos[0] ? (
                  <Image 
                    src={getImageUrl(album.coverImage || album.photos[0]?.image)} 
                    alt={album.title} 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <Images className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                <Badge className={`absolute top-4 left-4 ${getCategoryColor(album.category)}`}>
                  {album.category}
                </Badge>
                {album.isFeatured && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{album.title}</span>
                  {!album.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Images className="w-4 h-4" />
                    {album._count.photos} photos
                  </span>
                  {album.location && <span>{album.location}</span>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/admin/albums/${album.id}`)}
                  >
                    Manage Photos
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleFeature(album.id)}
                    title={album.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                  >
                    <Star className={`h-4 w-4 ${album.isFeatured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(album)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(album.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
