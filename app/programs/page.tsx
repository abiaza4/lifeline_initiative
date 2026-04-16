import { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Heart, BookOpen, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Programs - LISS',
  description: 'Explore our core programs in food security, health, education, and GBV prevention.',
};

const programs = [
  {
    slug: 'food-security',
    title: 'Food Security & Climate Resilience',
    icon: Leaf,
    description: 'Supporting sustainable agriculture and climate adaptation strategies for vulnerable communities.',
    details: 'We work with farmers to improve crop yields, diversify food sources, and build resilience to climate change.',
  },
  {
    slug: 'health',
    title: 'Community Health & Nutrition',
    icon: Heart,
    description: 'Providing healthcare services and nutrition support to vulnerable populations.',
    details: 'Our health programs include maternal health services, nutrition programs, and disease prevention initiatives.',
  },
  {
    slug: 'education',
    title: 'Education & Skills Training',
    icon: BookOpen,
    description: 'Empowering individuals through education and vocational skills development.',
    details: 'We provide scholarships, vocational training, and capacity building for youth and adults.',
  },
  {
    slug: 'gbv',
    title: 'GBV Response & Prevention',
    icon: AlertCircle,
    description: 'Working to eliminate gender-based violence through prevention and survivor support.',
    details: 'Our GBV programs include awareness raising, survivor support, and community mobilization.',
  },
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Our Core Programs</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Discover how LISS is making a difference across Eastern Equatoria State
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="p-8">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h2>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <p className="text-gray-500 text-sm">{program.details}</p>
                  <div className="mt-6 inline-flex items-center text-primary font-semibold group-hover:gap-2 gap-0 transition-all">
                    Learn More <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
