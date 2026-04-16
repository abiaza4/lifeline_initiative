import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, Briefcase, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Get Involved - LISS',
  description: 'Make a difference: volunteer, partner, or support our mission.',
};

export default function GetInvolvedPage() {
  const opportunities = [
    {
      id: 'volunteer',
      icon: Heart,
      title: 'Volunteer',
      description: 'Share your skills and time to help communities in need.',
      points: [
        'Use your professional skills',
        'Make direct community impact',
        'Build meaningful relationships',
        'Flexible time commitments',
      ],
    },
    {
      id: 'partner',
      icon: Briefcase,
      title: 'Become a Partner',
      description: 'Work with us on long-term initiatives to create lasting change.',
      points: [
        'Corporate partnerships',
        'NGO collaborations',
        'Government partnerships',
        'International cooperation',
      ],
    },
    {
      id: 'donate',
      icon: Users,
      title: 'Donate',
      description: 'Your financial support enables us to expand our programs.',
      points: [
        'One-time donations',
        'Monthly giving',
        'Donate for specific programs',
        'Corporate donations',
      ],
    },
    {
      id: 'gbv-report',
      icon: MessageSquare,
      title: 'Report GBV Safely',
      description: 'Confidential support and reporting for gender-based violence survivors.',
      points: [
        'Safe confidential reporting',
        'Survivor support services',
        'Community awareness',
        'Professional counseling',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Get Involved</h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Join us in our mission to improve lives and build futures. Choose the way that works best for you.
        </p>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {opportunities.map((opp) => {
            const Icon = opp.icon;
            return (
              <div
                key={opp.id}
                id={opp.id}
                className="bg-white rounded-lg shadow-lg p-8 scroll-mt-20"
              >
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{opp.title}</h2>
                <p className="text-gray-600 mb-6">{opp.description}</p>

                <h3 className="font-semibold text-gray-900 mb-4">What You Can Do:</h3>
                <ul className="space-y-3 mb-8">
                  {opp.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={
                    opp.id === 'donate'
                      ? '/donate'
                      : opp.id === 'gbv-report'
                      ? '/contact'
                      : '#'
                  }
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded inline-block transition-colors"
                >
                  {opp.id === 'donate' ? 'Donate Now' : opp.id === 'gbv-report' ? 'Get Help' : 'Learn More'}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Community Champions Section */}
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Community Champion</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Lead advocacy efforts in your community, raise awareness about our programs, and help us reach more people who need our support.
          </p>
          <Link
            href="/contact"
            className="bg-accent hover:bg-orange-500 text-white font-semibold py-3 px-8 rounded transition-colors"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
