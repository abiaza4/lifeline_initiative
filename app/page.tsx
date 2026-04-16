import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Leaf, Heart, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSlider = dynamic(() => import('@/components/hero-slider').then(mod => ({ default: mod.HeroSlider })), {
  loading: () => <Skeleton className="h-[500px] lg:h-[600px]" />,
  ssr: false,
});

const AnimatedCounter = dynamic(() => import('@/components/animated-counter').then(mod => ({ default: mod.AnimatedCounter })), {
  ssr: false,
  loading: () => <span>0</span>,
});

const VolunteerForm = dynamic(() => import('@/components/volunteer-form').then(mod => ({ default: mod.VolunteerForm })), {
  loading: () => <Skeleton className="h-64" />,
});

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  raisedAmount: number;
  goalAmount: number | null;
  isActive: boolean;
}

async function getProjects(): Promise<Project[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  try {
    const res = await fetch(`${API_URL}/projects?active=true`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const projects = await getProjects();

  const impactStats = [
    { number: 25000, suffix: '+', label: 'Households Supported', color: 'primary' },
    { number: 15500, suffix: '', label: 'Children Educated', color: 'secondary' },
    { number: 10000, suffix: '+', label: 'GBV Survivors Assisted', color: 'accent' },
    { number: 5000, suffix: '+', label: 'Volunteers Engaged', color: 'primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSlider />

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">About LISS</h2>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-lg text-foreground mb-6">
              Lifeline Initiative – South Sudan is a non-profit organization dedicated to improving the lives of vulnerable communities through Food Security, Health, Education, and GBV Prevention.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
              <Link href="/volunteer">
                <Button size="lg" className="bg-primary">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center">Our Core Programs</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We work across four strategic areas to create lasting change
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { slug: 'food-security', title: 'Food Security & Climate Resilience', icon: Leaf },
              { slug: 'health', title: 'Community Health & Nutrition', icon: Heart },
              { slug: 'education', title: 'Education & Skills Training', icon: BookOpen },
              { slug: 'gbv', title: 'GBV Response & Prevention', icon: AlertCircle },
            ].map((program) => {
              const Icon = program.icon;
              return (
                <Link
                  key={program.slug}
                  href={`/programs/${program.slug}`}
                  className="bg-card border border-border rounded-lg shadow p-6 hover:shadow-lg transition-all text-center group"
                >
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{program.title}</h3>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/programs">
              <Button variant="outline" size="lg">
                Explore Our Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-6 text-white text-center ${
                  stat.color === 'primary'
                    ? 'bg-primary'
                    : stat.color === 'secondary'
                    ? 'bg-secondary'
                    : 'bg-accent'
                }`}
              >
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button size="lg" className="bg-primary">
                See Our Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center">Active Campaigns & Projects</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Support our ongoing initiatives and help us create lasting change
          </p>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={project.image || '/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    {project.goalAmount && (
                      <div className="mb-3">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${Math.min(
                                project.goalAmount ? ((project.raisedAmount || 0) / project.goalAmount) * 100 : 0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ${(project.raisedAmount || 0).toLocaleString()} of ${project.goalAmount ? project.goalAmount.toLocaleString() : '0'}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Link href="/donate" className="flex-1">
                        <Button className="w-full" size="sm">
                          Donate
                        </Button>
                      </Link>
                      <Link href="/projects" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No active projects at the moment.</p>
              <p className="text-sm text-muted-foreground">
                Check back soon or browse our programs to get involved.
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/projects">
              <Button variant="outline" size="lg">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GetInvolvedSection />
    </div>
  );
}

function GetInvolvedSection() {
  return (
    <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-12">Get Involved</h2>
        <p className="text-lg mb-12 max-w-2xl mx-auto">
          Join us in our mission to save lives and build futures. Choose the way that works best for you.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4">Volunteer</h3>
            <p className="mb-6 opacity-90">Share your skills and time to help communities in need.</p>
            <div className="flex flex-col gap-2">
              <Link href="/volunteer">
                <Button className="bg-accent hover:bg-orange-600">
                  Apply Now
                </Button>
              </Link>
              <Link href="/get-involved#volunteer">
                <Button variant="outline" className="border-white text-white hover:bg-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-4">Partner With Us</h3>
            <p className="mb-6 opacity-90">Work with us on long-term initiatives to create lasting change.</p>
            <Link href="/get-involved#partner">
              <Button className="bg-primary hover:bg-green-700">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">💖</div>
            <h3 className="text-2xl font-bold mb-4">Donate Today</h3>
            <p className="mb-6 opacity-90">Your financial support enables us to expand our programs.</p>
            <Link href="/donate">
              <Button className="bg-accent hover:bg-orange-600">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
