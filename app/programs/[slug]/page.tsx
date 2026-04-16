import Link from 'next/link';
import { notFound } from 'next/navigation';

const programsData: Record<string, any> = {
  'food-security': {
    title: 'Food Security & Climate Resilience',
    description: 'Building resilient food systems in Eastern Equatoria State',
    content: `
      <h2>Saving Lives Through Food Security</h2>
      <p>Our Food Security & Climate Resilience program works directly with farmers and communities to improve agricultural productivity while building resilience to climate shocks.</p>
      
      <h3>What We Do</h3>
      <ul>
        <li>Promote sustainable farming practices</li>
        <li>Provide agricultural inputs and training</li>
        <li>Support crop diversification</li>
        <li>Build climate adaptation strategies</li>
        <li>Establish community seed banks</li>
      </ul>
      
      <h3>Impact</h3>
      <p>Through this program, we have helped over 10,000 households improve their food security and agricultural productivity. Communities are now better equipped to handle drought and climate variability.</p>
      
      <h3>Get Involved</h3>
      <p>You can support our food security initiatives through donations, volunteering, or partnerships. Every contribution helps us expand our reach and impact.</p>
    `,
  },
  'health': {
    title: 'Community Health & Nutrition',
    description: 'Improving health outcomes across vulnerable communities',
    content: `
      <h2>Building Healthier Communities</h2>
      <p>Our Community Health & Nutrition program provides essential healthcare services and nutrition support to some of South Sudan's most vulnerable populations.</p>
      
      <h3>What We Do</h3>
      <ul>
        <li>Operate mobile health clinics</li>
        <li>Provide maternal and child health services</li>
        <li>Conduct nutrition programs and counseling</li>
        <li>Implement disease prevention initiatives</li>
        <li>Train community health workers</li>
      </ul>
      
      <h3>Impact</h3>
      <p>We have served over 15,500 children through our nutrition programs and maternal health services. Our trained community health workers reach remote areas providing life-saving healthcare.</p>
      
      <h3>Support This Program</h3>
      <p>Your support helps us provide free healthcare to those who cannot afford it. Together, we can ensure every community member has access to basic health services.</p>
    `,
  },
  'education': {
    title: 'Education & Skills Training',
    description: 'Empowering through education and vocational skills',
    content: `
      <h2>Empowering Through Education</h2>
      <p>Education is the foundation for breaking cycles of poverty. Our Education & Skills Training program provides quality education and vocational training to youth and adults.</p>
      
      <h3>What We Do</h3>
      <ul>
        <li>Provide scholarships for vulnerable children</li>
        <li>Offer vocational skills training</li>
        <li>Support school infrastructure development</li>
        <li>Conduct teacher training programs</li>
        <li>Establish community learning centers</li>
      </ul>
      
      <h3>Impact</h3>
      <p>Over 15,500 children have benefited from our education programs. We have trained hundreds of youth in marketable skills, helping them find employment opportunities.</p>
      
      <h3>Invest in Education</h3>
      <p>By supporting education, you invest in the future. Help us provide more scholarships and build better schools for communities across South Sudan.</p>
    `,
  },
  'gbv': {
    title: 'GBV Response & Prevention',
    description: 'Ending gender-based violence in our communities',
    content: `
      <h2>Combating Gender-Based Violence</h2>
      <p>Gender-based violence is a critical issue affecting thousands of people across South Sudan. Our GBV Response & Prevention program works to prevent violence and support survivors.</p>
      
      <h3>What We Do</h3>
      <ul>
        <li>Conduct awareness and prevention campaigns</li>
        <li>Provide psychosocial support to survivors</li>
        <li>Facilitate community dialogue and mobilization</li>
        <li>Train community response teams</li>
        <li>Document and report GBV incidents safely</li>
      </ul>
      
      <h3>Impact</h3>
      <p>Our program has assisted over 10,000 GBV survivors, providing them with safe reporting mechanisms and comprehensive support services. Communities are increasingly engaged in prevention efforts.</p>
      
      <h3>Report Safely</h3>
      <p>If you or someone you know needs help, we provide confidential reporting mechanisms. You can contact us at our hotline for immediate assistance and support.</p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(programsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programsData[slug];
  if (!program) return {};
  return {
    title: `${program.title} - LISS`,
    description: program.description,
  };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programsData[slug];

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/programs"
          className="text-primary hover:text-primary/80 font-semibold mb-8 inline-flex items-center"
        >
          ← Back to Programs
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-4">{program.title}</h1>
        <p className="text-xl text-muted-foreground mb-8">{program.description}</p>

        <div className="prose prose-lg max-w-none text-foreground">
          <div
            dangerouslySetInnerHTML={{
              __html: program.content
                .replace(/<h2>/g, '<h2 style="font-size: 1.875rem; font-weight: bold; color: var(--primary); margin-top: 2rem; margin-bottom: 1rem;">')
                .replace(/<h3>/g, '<h3 style="font-size: 1.25rem; font-weight: 600; color: var(--secondary); margin-top: 1.5rem; margin-bottom: 0.75rem;">')
                .replace(/<p>/g, '<p style="color: var(--foreground); margin-bottom: 1rem; line-height: 1.6;">')
                .replace(/<ul>/g, '<ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">')
                .replace(/<li>/g, '<li style="color: var(--foreground); margin-bottom: 0.5rem; line-height: 1.6;">')
                .replace(/<\/li>/g, '</li>'),
            }}
          />
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-8 mt-12">
          <h3 className="text-xl font-bold text-primary mb-4">Support This Program</h3>
          <p className="text-muted-foreground mb-6">
            Your support helps us expand our reach and deepen our impact in communities across South Sudan.
          </p>
          <Link
            href="/donate"
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded inline-block transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
}
