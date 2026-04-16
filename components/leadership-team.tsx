'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string | null;
  email: string;
  phone: string;
  image: string;
  skills: string | null;
  isActive: boolean;
}

export function LeadershipTeam() {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`${API_URL}/team?active=true`);
      const data = await response.json();
      setTeamList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;
    // If it's a /team/ path, use local (frontend public folder)
    if (url.startsWith('/team/')) return url;
    // Otherwise it's from uploads, use backend URL
    return `http://localhost:5001${url}`;
  };

  const sortedTeamList = [...teamList].sort((a, b) => {
    const aIsFounder = a.position.toLowerCase().includes('founder');
    const bIsFounder = b.position.toLowerCase().includes('founder');
    if (aIsFounder && !bIsFounder) return -1;
    if (!aIsFounder && bIsFounder) return 1;
    return 0;
  });

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Leadership Team
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-muted" />
                <div className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sortedTeamList.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground">Meet our dedicated team members</p>
          </div>
          <p className="text-center text-muted-foreground">Team members coming soon...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Leadership Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dedicated professionals committed to empowering communities and saving lives in South Sudan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeamList.map((leader) => (
            <div
              key={leader.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Profile Image */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-muted">
                <Image
                  src={getImageUrl(leader.image)}
                  alt={leader.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">{leader.name}</h3>
                  <p className="text-sm font-semibold text-primary mt-1">{leader.position}</p>
                </div>

                {leader.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{leader.bio}</p>
                )}

                <div className="space-y-2 border-t border-border pt-4">
                  <a
                    href={`mailto:${leader.email}`}
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{leader.email}</span>
                  </a>
                  {leader.phone && (
                    <a
                      href={`tel:${leader.phone}`}
                      className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{leader.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
