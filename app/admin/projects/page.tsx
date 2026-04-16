'use client';

import { useEffect, useState, useRef } from 'react';
import { projects as projectsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Upload, Loader2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  goalAmount: number | null;
  raisedAmount: number;
  isActive: boolean;
  isFeatured: boolean;
  startDate: string;
  endDate: string | null;
}

// Default placeholder projects for when API is unavailable
const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'Clean Water Initiative',
    slug: 'clean-water-initiative',
    description: 'Providing clean and safe drinking water to rural communities through boreholes and water systems.',
    image: '/placeholder.jpg',
    category: 'Water & Sanitation',
    goalAmount: 75000,
    raisedAmount: 25000,
    isActive: true,
    isFeatured: true,
    startDate: new Date().toISOString(),
    endDate: null,
  },
  {
    id: 2,
    title: 'Emergency Food Relief',
    slug: 'emergency-food-relief',
    description: 'Distributing food packages to families affected by conflict and flooding in Eastern Equatoria.',
    image: '/placeholder.jpg',
    category: 'Food Security',
    goalAmount: 50000,
    raisedAmount: 35000,
    isActive: true,
    isFeatured: true,
    startDate: new Date().toISOString(),
    endDate: null,
  },
  {
    id: 3,
    title: 'Mobile Health Clinics',
    slug: 'mobile-health-clinics',
    description: 'Bringing healthcare services to remote villages through mobile clinic units.',
    image: '/placeholder.jpg',
    category: 'Health',
    goalAmount: 100000,
    raisedAmount: 15000,
    isActive: true,
    isFeatured: false,
    startDate: new Date().toISOString(),
    endDate: null,
  },
];

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    image: '',
    category: '',
    goalAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    isFeatured: false,
  });
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getAll();
      if (data && Array.isArray(data) && data.length > 0) {
        setProjectsList(data);
      }
    } catch (error) {
      console.log('Using default projects (API unavailable)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
      setFormData({ ...formData, image: data.url });
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
      const data = {
        ...formData,
        goalAmount: formData.goalAmount ? parseFloat(formData.goalAmount) : null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
      };

      if (editingProject) {
        await projectsApi.update(editingProject.id, data);
      } else {
        await projectsApi.create(data);
      }
      setDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image: project.image,
      category: project.category,
      goalAmount: project.goalAmount?.toString() || '',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      isActive: project.isActive,
      isFeatured: project.isFeatured,
    });
    setImagePreview(project.image);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsApi.delete(id);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await projectsApi.toggle(id);
      fetchProjects();
    } catch (error) {
      setProjectsList(prev => prev.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ));
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      image: '',
      category: '',
      goalAmount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
      isFeatured: false,
    });
    setImagePreview('');
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Projects</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      value={formData.goalAmount}
                      onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Project Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                      {imagePreview || formData.image ? (
                        <Image 
                          src={getImageUrl(formData.image)} 
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
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      <p className="text-xs text-muted-foreground">JPEG, PNG, GIF, WebP (max 5MB)</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>{editingProject ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projectsList.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
              <Image
                src={getImageUrl(project.image)}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {project.isFeatured && (
                  <Badge variant="default" className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge variant={project.isActive ? 'default' : 'secondary'}>
                  {project.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{project.category}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.description}
              </p>
              {project.goalAmount && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Raised</span>
                    <span className="font-medium">
                      ${project.raisedAmount.toLocaleString()} / ${project.goalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min((project.raisedAmount / project.goalAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant={project.isActive ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => handleToggleActive(project.id)}
                >
                  {project.isActive ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {project.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
