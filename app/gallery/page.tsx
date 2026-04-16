'use client';

import { useEffect, useState } from 'react';
import { albums, photos } from '@/lib/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { Download, X, ChevronLeft, ChevronRight, Calendar, MapPin, Images } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface Album {
  id: number;
  title: string;
  description: string | null;
  coverImage: string | null;
  category: string;
  date: string | null;
  location: string | null;
  isFeatured: boolean;
  photos: { image: string }[];
  _count: { photos: number };
}

interface Photo {
  id: number;
  albumId: number;
  image: string;
  caption: string | null;
}

const categories = ['All', 'Projects', 'Events', 'Certificates & Awards', 'Field Activities'];

export default function GalleryPage() {
  const [albumsList, setAlbumsList] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await albums.getAll({ active: true });
      setAlbumsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlbums = selectedCategory === 'All'
    ? albumsList
    : albumsList.filter(album => album.category === selectedCategory);

  const openAlbum = async (album: Album) => {
    setSelectedAlbum(album);
    setLoadingPhotos(true);
    try {
      const data = await photos.getByAlbum(album.id);
      setAlbumPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      setAlbumPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setAlbumPhotos([]);
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % albumPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);
  };

  const downloadImage = (photo: Photo) => {
    const imageUrl = photo.image.startsWith('http') ? photo.image : `${API_URL.replace('/api', '')}${photo.image}`;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = photo.caption || `photo-${photo.id}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-muted rounded animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-muted" />
                <div className="p-4">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Album Grid View */}
      {!selectedAlbum && (
        <>
          <div className="bg-secondary/20 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Our Gallery</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore moments from our projects, events, and achievements. Click on any album to view the full collection.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-primary' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Albums Grid */}
            {filteredAlbums.length === 0 ? (
              <div className="text-center py-16">
                <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Albums Yet</h3>
                <p className="text-muted-foreground">
                  {selectedCategory === 'All'
                    ? 'Gallery albums will appear here soon.'
                    : `No albums in the ${selectedCategory} category yet.`}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlbums.map((album) => (
                  <Card
                    key={album.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => openAlbum(album)}
                  >
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-muted">
                      {album.coverImage ? (
                        <Image
                          src={getImageUrl(album.coverImage)}
                          alt={album.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : album.photos[0] ? (
                        <Image
                          src={getImageUrl(album.photos[0].image)}
                          alt={album.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Images className="w-16 h-16 text-muted-foreground/50" />
                        </div>
                      )}
                      <Badge className={`absolute top-4 left-4 ${getCategoryColor(album.category)}`}>
                        {album.category}
                      </Badge>
                      {album.isFeatured && (
                        <Badge className="absolute top-4 right-4 bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Images className="w-4 h-4" />
                        {album._count.photos}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">{album.title}</h3>
                      {album.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {album.description}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="px-4 pb-4 pt-0 flex gap-4 text-xs text-muted-foreground">
                      {album.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(album.date)}
                        </span>
                      )}
                      {album.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {album.location}
                        </span>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Album Photos View */}
      {selectedAlbum && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={closeAlbum}>
              Back to Gallery
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{selectedAlbum.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <Badge className={getCategoryColor(selectedAlbum.category)}>
                  {selectedAlbum.category}
                </Badge>
                {selectedAlbum.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedAlbum.date)}
                  </span>
                )}
                {selectedAlbum.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedAlbum.location}
                  </span>
                )}
                <span>{albumPhotos.length} photos</span>
              </div>
            </div>
          </div>

          {selectedAlbum.description && (
            <p className="text-muted-foreground mb-8">{selectedAlbum.description}</p>
          )}

          {loadingPhotos ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : albumPhotos.length === 0 ? (
            <div className="text-center py-16">
              <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No photos in this album yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albumPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={getImageUrl(photo.image)}
                    alt={photo.caption || `Photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(photo);
                        }}
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <div className="relative h-[80vh] flex items-center justify-center">
            {albumPhotos[currentPhotoIndex] && (
              <>
                <Image
                  src={getImageUrl(albumPhotos[currentPhotoIndex].image)}
                  alt={albumPhotos[currentPhotoIndex].caption || 'Photo'}
                  fill
                  className="object-contain"
                  quality={100}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => downloadImage(albumPhotos[currentPhotoIndex])}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={closeLightbox}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {albumPhotos[currentPhotoIndex].caption && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg max-w-md text-center">
                    {albumPhotos[currentPhotoIndex].caption}
                  </div>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                  {currentPhotoIndex + 1} / {albumPhotos.length}
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
