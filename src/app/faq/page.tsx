'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'Orders & Shipping',
    icon: '📦',
    items: [
      {
        question: 'How long does shipping take?',
        answer:
          'Standard shipping typically takes 5-7 business days within the US. Express shipping (2-3 business days) and overnight options are also available at checkout. International shipping times vary by destination, usually 7-14 business days.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Yes! We ship to over 100 countries worldwide. International shipping rates and delivery times are calculated at checkout based on your location. Please note that customs duties and taxes may apply.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order ships, you\'ll receive an email with your tracking number and a link to track your package. You can also track your order anytime by visiting our Track Order page and entering your order ID.',
      },
      {
        question: 'What if my order is lost or damaged?',
        answer:
          'We stand behind our shipping! If your package is lost or arrives damaged, please contact our support team within 48 hours of expected delivery. We\'ll work to resolve the issue promptly with a replacement or full refund.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    icon: '↩️',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 30-day return policy for unworn, unwashed items with original tags attached. Items must be in their original packaging. Sale items and personalized jerseys are final sale.',
      },
      {
        question: 'How do I start a return?',
        answer:
          'Visit our Returns page or your account\'s order history to initiate a return. You\'ll receive a prepaid shipping label (US orders) or return instructions. Refunds are processed within 5-7 business days of receiving your return.',
      },
      {
        question: 'Can I exchange an item?',
        answer:
          'Yes! For exchanges, start a return for your original item and place a new order for the correct item. This ensures you get your new item as quickly as possible. We\'ll refund your original purchase once we receive the return.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method. Please allow an additional 3-5 business days for your bank to process the credit.',
      },
    ],
  },
  {
    title: 'Products & Sizing',
    icon: '👕',
    items: [
      {
        question: 'How do I find my size?',
        answer:
          'Check our detailed Size Guide page for measurements and fitting tips. We recommend measuring a similar garment you own and comparing it to our size chart. If you\'re between sizes, we generally recommend sizing up.',
      },
      {
        question: 'Are the jerseys authentic?',
        answer:
          'All our jerseys are officially licensed World Cup Legends merchandise. They feature authentic embroidery, premium materials, and official competition specifications. Each jersey comes with a certificate of authenticity.',
      },
      {
        question: 'Can I customize my jersey?',
        answer:
          'Yes! Many jerseys can be customized with your favorite legend\'s name and number, or your own name. Customization options are available on eligible product pages. Please note that customized items are final sale.',
      },
      {
        question: 'What materials are used?',
        answer:
          'Our jerseys use premium moisture-wicking fabric (typically 100% recycled polyester) with advanced cooling technology. T-shirts and casual wear use a cotton-poly blend for comfort. All materials are ethically sourced.',
      },
    ],
  },
  {
    title: 'Tickets & Events',
    icon: '🎟️',
    items: [
      {
        question: 'How do I purchase tickets?',
        answer:
          'Tickets for the World Cup Legends 2026 can be purchased directly through our Tickets page. We offer various packages including single match tickets, multi-game passes, and VIP experiences.',
      },
      {
        question: 'Are tickets transferable?',
        answer:
          'Yes, tickets can be transferred to another person through our official ticket portal. Simply log into your account, select the tickets you wish to transfer, and enter the recipient\'s email address.',
      },
      {
        question: 'What if an event is cancelled?',
        answer:
          'In the event of a cancellation, all ticket holders will receive a full refund automatically. If an event is postponed, your tickets will be valid for the rescheduled date, or you can request a refund.',
      },
      {
        question: 'Is there accessible seating?',
        answer:
          'Yes, all venues offer accessible seating options. When purchasing tickets, select the accessibility option to view available accessible seats. Contact our support team if you need additional assistance.',
      },
    ],
  },
  {
    title: 'Account & Payment',
    icon: '💳',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. For select regions, we also offer buy-now-pay-later options through Klarna and Afterpay.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Absolutely. We use industry-standard SSL encryption and never store your full credit card details. All transactions are processed through PCI-compliant payment processors.',
      },
      {
        question: 'How do I create an account?',
        answer:
          'Click the "Register" button in the navigation or during checkout. You\'ll need to provide an email address and create a password. Having an account lets you track orders, save addresses, and manage your wishlist.',
      },
      {
        question: 'I forgot my password. What do I do?',
        answer:
          'Click "Forgot Password" on the login page and enter your email. You\'ll receive a link to reset your password within minutes. If you don\'t see the email, check your spam folder.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(faqData[0].title);
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(question)) {
        next.delete(question);
      } else {
        next.add(question);
      }
      return next;
    });
  };

  const filteredFAQs = searchQuery
    ? faqData
        .map((category) => ({
          ...category,
          items: category.items.filter(
            (item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.items.length > 0)
    : faqData;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-6xl block mb-6">❓</span>
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Find answers to common questions about orders, shipping, returns, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 bg-night-800 border border-gold-500/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {searchQuery ? (
            // Search Results
            <div className="space-y-6">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-4">🔍</span>
                  <p className="text-white/50">No results found for &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                filteredFAQs.map((category) => (
                  <div key={category.title}>
                    <h2 className="text-gold-400 font-semibold mb-4 flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.title}
                    </h2>
                    <div className="space-y-3">
                      {category.items.map((item) => (
                        <FAQAccordion
                          key={item.question}
                          question={item.question}
                          answer={item.answer}
                          isOpen={openQuestions.has(item.question)}
                          onToggle={() => toggleQuestion(item.question)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Category View
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Category Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="lg:sticky lg:top-32 space-y-2">
                  {faqData.map((category) => (
                    <button
                      key={category.title}
                      onClick={() => setOpenCategory(category.title)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        openCategory === category.title
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'text-white/60 hover:text-white hover:bg-night-700'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {faqData
                    .filter((c) => c.title === openCategory)
                    .map((category) => (
                      <motion.div
                        key={category.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        {category.items.map((item) => (
                          <FAQAccordion
                            key={item.question}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openQuestions.has(item.question)}
                            onToggle={() => toggleQuestion(item.question)}
                          />
                        ))}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-4">💬</span>
            <h2 className="text-2xl font-bold text-white mb-2">Still have questions?</h2>
            <p className="text-white/60 mb-6">
              Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                >
                  Contact Support
                </motion.button>
              </Link>
              <a href="mailto:support@worldcuplegends.com">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 hover:text-white transition-colors"
                >
                  Email Us
                </motion.button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQAccordion({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div className="glass rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-white font-medium pr-4">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gold-400 flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-white/60 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
