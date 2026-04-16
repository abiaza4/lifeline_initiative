import { VolunteerForm } from '@/components/volunteer-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volunteer - LISS',
  description: 'Join our team and make a difference in South Sudan',
};

export default function VolunteerPage() {
  return <VolunteerForm />;
}
