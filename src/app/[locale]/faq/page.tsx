'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const categoryKeys = [
  'ordersShipping',
  'returnsExchanges',
  'productsSizing',
  'ticketsEvents',
  'accountPayment',
] as const;

const itemKeys: Record<typeof categoryKeys[number], string[]> = {
  ordersShipping: ['shippingTime', 'internationalShipping', 'trackOrder', 'lostDamaged'],
  returnsExchanges: ['returnPolicy', 'startReturn', 'exchange', 'refundTime'],
  productsSizing: ['findSize', 'authentic', 'customize', 'materials'],
  ticketsEvents: ['purchaseTickets', 'transferable', 'cancelled', 'accessible'],
  accountPayment: ['paymentMethods', 'paymentSecure', 'createAccount', 'forgotPassword'],
};

export default function FAQPage() {
  const t = useTranslations('faq');

  const faqData: FAQCategory[] = useMemo(() => {
    return categoryKeys.map((categoryKey) => ({
      title: t(`categories.${categoryKey}.title`),
      icon: t(`categories.${categoryKey}.icon`),
      items: itemKeys[categoryKey].map((itemKey) => ({
        question: t(`categories.${categoryKey}.items.${itemKey}.question`),
        answer: t(`categories.${categoryKey}.items.${itemKey}.answer`),
      })),
    }));
  }, [t]);

  const [openCategory, setOpenCategory] = useState<string | null>(faqData[0]?.title);
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
              {t('pageTitle')}
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              {t('pageSubtitle')}
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
              placeholder={t('searchPlaceholder')}
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
                  <p className="text-white/50">{t('noResults')} &quot;{searchQuery}&quot;</p>
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
            <h2 className="text-2xl font-bold text-white mb-2">{t('stillHaveQuestions')}</h2>
            <p className="text-white/60 mb-6">
              {t('stillHaveQuestionsDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-night-900 font-bold rounded-xl"
                >
                  {t('contactSupport')}
                </motion.button>
              </Link>
              <a href="mailto:support@worldcuplegends.com">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-night-700 text-white/70 rounded-xl hover:bg-night-600 hover:text-white transition-colors"
                >
                  {t('emailUs')}
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
