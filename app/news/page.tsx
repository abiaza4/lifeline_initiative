import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News - LISS',
  description: 'Latest news and updates from LISS.',
};

export default function NewsPage() {
  const news = [
    {
      date: 'December 15, 2024',
      title: 'LISS Reaches 25,000 Households with Food Security Program',
      excerpt: 'A milestone achievement in our climate-smart agriculture initiative.',
      category: 'Program Update',
    },
    {
      date: 'December 1, 2024',
      title: 'New Mobile Health Clinic Launched in Remote Areas',
      excerpt: 'Bringing healthcare services to communities previously without access.',
      category: 'Healthcare',
    },
    {
      date: 'November 20, 2024',
      title: 'Youth Skills Center Trains 500 Graduates',
      excerpt: 'Vocational training program celebrates successful cohort.',
      category: 'Education',
    },
    {
      date: 'November 10, 2024',
      title: 'Community Leaders Trained on GBV Prevention',
      excerpt: 'Empowering local champions to prevent gender-based violence.',
      category: 'GBV Prevention',
    },
    {
      date: 'October 28, 2024',
      title: 'LISS Partners with International Health Organization',
      excerpt: 'Strengthening health programs through strategic partnership.',
      category: 'Partnership',
    },
    {
      date: 'October 15, 2024',
      title: 'Climate Resilience Training Benefits 2,000 Farmers',
      excerpt: 'Farmers learn sustainable agriculture techniques.',
      category: 'Agriculture',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">News & Updates</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Stay informed about LISS's latest programs, initiatives, and impact stories.
        </p>

        <div className="space-y-6">
          {news.map((item, index) => (
            <article
              key={index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">{item.date}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
                </div>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{item.excerpt}</p>
              <button className="text-primary hover:text-primary/80 font-semibold">
                Read More →
              </button>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-green-50 border-2 border-primary rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-700 mb-6">
            Subscribe to our newsletter to receive updates about our programs and impact.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
