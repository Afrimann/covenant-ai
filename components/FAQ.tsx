"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "Is the AI biblically accurate?",
    answer:
      "Answers are grounded in scripture references and supported by trusted theological sources.",
  },
  {
    question: "Which Bible translations are supported?",
    answer:
      "Multiple translations are supported, with clear citations for each verse used.",
  },
  {
    question: "Can pastors use this for sermon preparation?",
    answer:
      "Yes. Sermon builder tools are included with outlines, references, and notes.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16" id="faq">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="space-y-10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--color-accent)">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-(--color-primary)">
              Answers for faithful study
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-(--color-border) bg-white/95"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-(--color-primary)"
                    onClick={() =>
                      setOpenIndex((prev) => (prev === index ? null : index))
                    }
                  >
                    {faq.question}
                    <span className="text-lg text-(--color-accent)">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-sm text-(--color-muted)">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
