import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transparency - LISS',
  description: 'Our commitment to transparency and accountability.',
};

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Transparency & Accountability</h1>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Our Commitment</h2>
          <p className="text-gray-700 mb-6">
            LISS is committed to transparency and accountability in all our operations. We believe that our donors, partners, and the communities we serve deserve to know exactly how their contributions are being used.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Financial Accountability</h2>
          <p className="text-gray-700 mb-6">
            We maintain comprehensive financial records and undergo regular audits by independent auditors. Our financial statements are available upon request and clearly show how funds are allocated across our programs.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Budget Allocation</h3>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>• 70% - Direct program delivery</li>
            <li>• 15% - Administrative costs</li>
            <li>• 15% - Fundraising and resource mobilization</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Program Monitoring & Evaluation</h2>
          <p className="text-gray-700 mb-6">
            All our programs are monitored regularly to ensure they are achieving their intended outcomes. We conduct baseline surveys, regular monitoring visits, and end-of-project evaluations.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Governance</h2>
          <p className="text-gray-700 mb-6">
            LISS is governed by a Board of Directors comprising community representatives, development professionals, and civil society leaders. Our governance structure ensures oversight and accountability.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Board Committees</h3>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li>• Finance and Audit Committee</li>
            <li>• Program and Evaluation Committee</li>
            <li>• Human Resources and Compliance Committee</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Compliance</h2>
          <p className="text-gray-700 mb-6">
            We comply with all applicable laws and regulations of South Sudan and international standards for NGOs. We maintain appropriate registration and licenses.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Complaints and Feedback</h2>
          <p className="text-gray-700 mb-6">
            We welcome feedback and complaints about our programs and operations. We have established mechanisms for receiving and responding to complaints from community members, staff, and partners.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Annual Reports</h2>
          <p className="text-gray-700 mb-6">
            LISS publishes comprehensive annual reports detailing our activities, achievements, and financial performance. These reports are available upon request.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Get Detailed Reports</h2>
          <p className="text-gray-700 mb-6">
            For more detailed information about our operations, programs, and impact, please contact us directly. We are happy to provide annual reports, financial statements, and program evaluations.
          </p>
        </div>

        <div className="bg-green-50 border-2 border-primary rounded-lg p-8 mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Our Finance Team</h3>
          <p className="text-gray-700 mb-4">
            Have questions about our finances or operations? We are transparent and happy to answer.
          </p>
          <a
            href="mailto:finance@liss.org"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            finance@liss.org
          </a>
        </div>
      </div>
    </div>
  );
}
