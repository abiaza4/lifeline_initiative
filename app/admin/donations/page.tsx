'use client';

import { useEffect, useState } from 'react';
import { donations } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface Donation {
  id: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  donorName: string | null;
  donorEmail: string | null;
  message: string | null;
  isAnonymous: boolean;
  donationDate: string;
  campaign: { title: string };
  user: { name: string; email: string } | null;
}

export default function DonationsPage() {
  const [donationsList, setDonationsList] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  const fetchDonations = async () => {
    try {
      setError(null);
      const params: any = {};
      if (filter !== 'all') params.status = filter;
      const data = await donations.getAll(params);
      setDonationsList(data || []);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
      setError('Failed to load donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      await donations.confirm(id);
      fetchDonations();
    } catch (error) {
      console.error('Failed to confirm donation:', error);
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
          <button onClick={() => fetchDonations()} className="ml-2 underline">Retry</button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Donations</h2>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
            All
          </Button>
          <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>
            Completed
          </Button>
          <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
            Pending
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Records</CardTitle>
        </CardHeader>
        <CardContent>
          {donationsList.length === 0 ? (
            <p className="text-muted-foreground">No donations found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Campaign</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Method</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donationsList.map((donation) => (
                    <tr key={donation.id} className="border-b">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {donation.isAnonymous ? 'Anonymous' : donation.donorName || donation.user?.name || 'Unknown'}
                          </p>
                          {!donation.isAnonymous && (donation.donorEmail || donation.user?.email) && (
                            <p className="text-xs text-muted-foreground">
                              {donation.donorEmail || donation.user?.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{donation.campaign.title}</td>
                      <td className="py-3 px-4 font-medium">${donation.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 capitalize">{donation.paymentMethod.replace('_', ' ')}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            donation.paymentStatus === 'completed'
                              ? 'default'
                              : donation.paymentStatus === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {donation.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(donation.donationDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {donation.paymentStatus === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleConfirm(donation.id)}>
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
