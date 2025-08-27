import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Check, Crown, Zap, Users, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      href: '/signup',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Zap,
      features: [
        '5 preset downloads per month',
        'Basic customization tools',
        'Community support',
        'Standard quality exports',
        'Personal use license',
      ],
      limitations: [
        'No premium presets',
        'Limited AI customizations',
        'No team collaboration',
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-700 hover:bg-gray-600',
      popular: false,
    },
    {
      name: 'Pro',
      price: 19,
      period: 'month',
      href: '/signup?trial=true',
      description: 'For professional creators',
      icon: Crown,
      features: [
        'Unlimited preset downloads',
        'Advanced AI customization',
        'Premium preset access',
        'High-quality exports',
        'Commercial use license',
        'Priority support',
        'Custom branding',
        'Analytics dashboard',
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 99,
      period: 'month',
      href: '/contact-sales',
      description: 'For teams and organizations',
      icon: Users,
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Advanced team management',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Custom training',
        'White-label options',
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-accent-600 hover:bg-accent-700',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
    },
    {
      question: 'Is there a free trial for Pro plans?',
      answer: 'Yes, we offer a 14-day free trial for Pro plans with full access to all features.',
    },
    {
      question: 'Can I use presets for commercial projects?',
      answer: 'Pro and Enterprise plans include commercial use licenses. Free plans are limited to personal use.',
    },
    {
      question: 'What happens to my presets if I cancel?',
      answer: 'You can continue to use any presets you downloaded during your subscription period.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your <span className="text-primary-400">Plan</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the full potential of PresetFlow with plans designed for creators,
              professionals, and teams of all sizes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={plan.href}>
                  <Button
                    className="w-full"
                    variant={
                      plan.popular ? 'default' : plan.name === 'Free' ? 'secondary' : 'accent'
                    }
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-300">
              See what's included in each plan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-6 text-white font-semibold">Features</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">Free</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">Pro</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[
                    ['Preset Downloads', '5/month', 'Unlimited', 'Unlimited'],
                    ['Premium Presets', '✗', '✓', '✓'],
                    ['AI Customization', 'Basic', 'Advanced', 'Advanced'],
                    ['Team Collaboration', '✗', '✗', '✓'],
                    ['Commercial License', '✗', '✓', '✓'],
                    ['Priority Support', '✗', '✓', '✓'],
                    ['Custom Branding', '✗', '✓', '✓'],
                    ['Analytics', '✗', '✓', '✓'],
                    ['API Access', '✗', '✗', '✓'],
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="py-4 px-6 font-medium">{row[0]}</td>
                      <td className="py-4 px-6 text-center">{row[1]}</td>
                      <td className="py-4 px-6 text-center">{row[2]}</td>
                      <td className="py-4 px-6 text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about our pricing
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of creators already using PresetFlow to accelerate their design workflow.
            </p>
            <Link to="/signup?trial=true">
              <Button size="lg">Start Your Free Trial</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;