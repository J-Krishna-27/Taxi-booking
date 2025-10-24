import Layout from '../components/Layout';
import { MessageSquare, Phone, Mail, HelpCircle, FileText, Shield } from 'lucide-react';

const supportOptions = [
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team',
    action: 'Start Chat',
    color: 'blue',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Call us at 1-800-RIDE-NOW',
    action: 'Call Now',
    color: 'green',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@ridenow.com',
    action: 'Send Email',
    color: 'red',
  },
];

const faqItems = [
  {
    question: 'How do I book a ride?',
    answer: 'Enter your pickup and drop-off locations, select your preferred ride type, and tap "Confirm Ride". A driver will be assigned to you shortly.',
  },
  {
    question: 'Can I schedule a ride in advance?',
    answer: 'Yes! Enable "Schedule for later" when booking and choose your preferred date and time up to 7 days in advance.',
  },
  {
    question: 'How do I cancel a ride?',
    answer: 'You can cancel a ride from your ride details page. Please note that cancellation fees may apply depending on how close to pickup time you cancel.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, digital wallets, and cash payments. You can manage your payment methods in your profile settings.',
  },
  {
    question: 'How do I rate my driver?',
    answer: 'After your ride is completed, you will be prompted to rate your driver on a scale of 1-5 stars and leave optional feedback.',
  },
];

export default function Support() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">We're here to help you 24/7</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div
                  className={`w-12 h-12 bg-${option.color}-100 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 text-${option.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  {option.action} →
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-12">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {faqItems.map((item, index) => (
              <details key={index} className="group">
                <summary className="p-6 cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{item.question}</h3>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Browse our comprehensive guides and tutorials
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Docs →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Center</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn about our safety features and policies
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
