'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { albums, photos } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Loader2, Trash2, ImageIcon, GripVertical, Check } from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface Album {
  id: number;
  title: string;
  description: string | null;
  category: string;
}

interface Photo {
  id: number;
  albumId: number;
  image: string;
  caption: string | null;
  order: number;
}

export default function AlbumPhotosPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = parseInt(params.id as string);
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [photoList, setPhotoList] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [captionText, setCaptionText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, [albumId]);

  const fetchData = async () => {
    try {
      const [albumData, photosData] = await Promise.all([
        albums.getById(albumId),
        photos.getByAlbum(albumId)
      ]);
      setAlbum(albumData);
      setPhotoList(Array.isArray(photosData) ? photosData : []);
    } catch (error) {
      console.error('Failed to fetch album:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadPhoto(file);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedPhotos: { image: string; caption: string | null }[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload the file first
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
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        uploadedPhotos.push({
          image: data.url,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        });
      }

      // Create photos in bulk
      await photos.createBulk(uploadedPhotos.map((p, idx) => ({
        albumId,
        image: p.image,
        caption: p.caption,
        order: photoList.length + idx
      })));

      fetchData();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setUploading(false);
      if (multiFileInputRef.current) {
        multiFileInputRef.current.value = '';
      }
    }
  };

  const uploadPhoto = async (file: File, caption: string = '') => {
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
      
      await photos.create({
        albumId,
        image: data.url,
        caption: caption || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        order: photoList.length
      });

      fetchData();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (photoId: number) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        await photos.delete(photoId);
        fetchData();
      } catch (error) {
        console.error('Failed to delete photo:', error);
      }
    }
  };

  const startEditCaption = (photo: Photo) => {
    setEditingCaption(photo.id);
    setCaptionText(photo.caption || '');
  };

  const saveCaption = async (photoId: number) => {
    try {
      await photos.update(photoId, { caption: captionText });
      setEditingCaption(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update caption:', error);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}${url}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Album not found.</p>
        <Button variant="outline" onClick={() => router.push('/admin/albums')} className="mt-4">
          Back to Albums
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/admin/albums')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Albums
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{album.title}</h2>
          <Badge className="mt-1">{album.category}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Photos ({photoList.length})</span>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleSingleUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Single
              </Button>
              <input
                type="file"
                ref={multiFileInputRef}
                onChange={handleBulkUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button
                onClick={() => multiFileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Multiple
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photoList.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No photos in this album yet.</p>
              <p className="text-sm text-muted-foreground">Upload photos to add them to this album.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photoList.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(photo.image)}
                      alt={photo.caption || `Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => startEditCaption(photo)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => handleDelete(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {editingCaption === photo.id ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={captionText}
                        onChange={(e) => setCaptionText(e.target.value)}
                        placeholder="Add caption..."
                        className="text-sm"
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => saveCaption(photo.id)}>
                          <Check className="mr-1 h-3 w-3" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCaption(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    photo.caption && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{photo.caption}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
