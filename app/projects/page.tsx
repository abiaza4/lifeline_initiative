import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects & Impact - LISS',
  description: 'See our impact through concrete projects and statistics.',
};

export default function ProjectsPage() {
  const impactStats = [
    { number: '25,000+', label: 'Households Supported', icon: '👨‍👩‍👧‍👦' },
    { number: '15,500', label: 'Children Educated', icon: '📚' },
    { number: '10,000+', label: 'GBV Survivors Assisted', icon: '🤝' },
  ];

  const projects = [
    {
      title: 'Climate-Smart Agriculture Initiative',
      location: 'Eastern Equatoria State',
      description: 'Training 5,000 farmers in climate-smart agriculture practices.',
      status: 'Ongoing',
    },
    {
      title: 'Mobile Health Clinic Program',
      location: 'Remote Areas',
      description: 'Providing healthcare to 10 remote communities.',
      status: 'Active',
    },
    {
      title: 'Youth Skills Center',
      location: 'Torit',
      description: 'Training center providing vocational skills to 500+ youth annually.',
      status: 'Established',
    },
    {
      title: 'GBV Hotline & Support Services',
      location: 'Nationwide',
      description: 'Confidential reporting and survivor support services.',
      status: 'Active',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Projects & Impact</h1>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Projects List */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Active Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">📍 {project.location}</p>
                </div>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {project.status}
                </span>
              </div>
              <p className="text-gray-700">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
