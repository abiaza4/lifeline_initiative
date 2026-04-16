import { Metadata } from 'next';
import { LeadershipTeam } from '@/components/leadership-team';

export const metadata: Metadata = {
  title: 'About Us - LISS',
  description: 'Learn about Lifeline Initiative – South Sudan and our mission to improve lives.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">About LISS</h1>
        
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Our Mission</h2>
          <p className="text-foreground mb-6">
            Lifeline Initiative – South Sudan is a non-profit organization dedicated to improving the lives of vulnerable communities through Food Security, Health, Education, and GBV Prevention.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Our Vision</h2>
          <p className="text-foreground mb-6">
            We envision a South Sudan where communities are empowered, resilient, and have access to essential services and opportunities for sustainable development.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">What We Do</h2>
          <ul className="text-foreground space-y-4 mb-6">
            <li>• <strong>Food Security & Climate Resilience:</strong> Supporting agricultural development and climate adaptation</li>
            <li>• <strong>Community Health & Nutrition:</strong> Providing healthcare and nutritional support</li>
            <li>• <strong>Education & Skills Training:</strong> Empowering through education and vocational training</li>
            <li>• <strong>GBV Response & Prevention:</strong> Working to eliminate gender-based violence</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Our Values</h2>
          <ul className="text-foreground space-y-3 mb-6">
            <li>• <strong>Community-centered:</strong> Communities lead in designing solutions</li>
            <li>• <strong>Accountability:</strong> Transparent and responsible use of resources</li>
            <li>• <strong>Compassion:</strong> Deep commitment to dignity and human rights</li>
            <li>• <strong>Innovation:</strong> Creative approaches to complex challenges</li>
          </ul>
        </div>
      </div>

      {/* Leadership Team Section */}
      <LeadershipTeam />
    </div>
  );
}
