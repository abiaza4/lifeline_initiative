'use client';

import { useEffect, useState } from 'react';
import { volunteers } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Trash2 } from 'lucide-react';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string | null;
  availability: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function VolunteersPage() {
  const [volunteersList, setVolunteersList] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVolunteers();
  }, [filter]);

  const fetchVolunteers = async () => {
    try {
      setError(null);
      const params: any = {};
      if (filter !== 'all') params.status = filter;
      const data = await volunteers.getAll(params);
      setVolunteersList(data || []);
    } catch (err) {
      console.error('Failed to fetch volunteers:', err);
      setError('Failed to load volunteers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await volunteers.updateStatus(id, status);
      fetchVolunteers();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this volunteer application?')) {
      try {
        await volunteers.delete(id);
        fetchVolunteers();
      } catch (error) {
        console.error('Failed to delete volunteer:', error);
      }
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
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg">
          {error}
          <button onClick={() => fetchVolunteers()} className="ml-2 underline">Retry</button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Volunteers</h2>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
            All
          </Button>
          <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
            Pending
          </Button>
          <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => setFilter('approved')}>
            Approved
          </Button>
          <Button variant={filter === 'rejected' ? 'default' : 'outline'} onClick={() => setFilter('rejected')}>
            Rejected
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {volunteersList.length === 0 ? (
          <p className="col-span-full text-muted-foreground">No volunteer applications found</p>
        ) : (
          volunteersList.map((volunteer) => (
            <Card key={volunteer.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{volunteer.name}</CardTitle>
                  <Badge
                    variant={
                      volunteer.status === 'approved'
                        ? 'default'
                        : volunteer.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {volunteer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Email:</span> {volunteer.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {volunteer.phone}
                  </p>
                  {volunteer.skills && (
                    <p>
                      <span className="font-medium">Skills:</span> {volunteer.skills}
                    </p>
                  )}
                  {volunteer.availability && (
                    <p>
                      <span className="font-medium">Availability:</span> {volunteer.availability}
                    </p>
                  )}
                  <p className="text-muted-foreground line-clamp-3">{volunteer.message}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  {volunteer.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleUpdateStatus(volunteer.id, 'approved')}>
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(volunteer.id, 'rejected')}>
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleDelete(volunteer.id)}>
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
