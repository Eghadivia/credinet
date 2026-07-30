import Link from 'next/link';
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Headphones,
  ReceiptText,
  ShieldCheck,
  WalletCards,
  Zap,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Do I need a wallet to use CrediNet?',
    answer: 'No. You can pay securely and complete each transaction directly.',
    icon: WalletCards,
  },
  {
    question: 'How fast are purchases delivered?',
    answer: 'Most airtime, data and bill payments are processed instantly.',
    icon: Zap,
  },
  {
    question: 'Which networks are supported?',
    answer:
      'MTN, Airtel, Glo, 9mobile, DStv, GOtv, Startimes and electricity providers.',
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    question: 'Can I pay electricity bills?',
    answer:
      'Yes. CrediNet supports prepaid and postpaid electricity bill payments.',
    icon: ReceiptText,
  },
  {
    question: 'Is my card information safe?',
    answer:
      'Yes. Payments are processed through secure payment infrastructure.',
    icon: ShieldCheck,
  },
];

export default function Home2Faq() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#fbfaff] px-4 py-18 sm:px-6 sm:py-22 lg:px-8 lg:py-26"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#f5f1ff] sm:-left-24 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-56 -top-24 h-[560px] w-[560px] rounded-full bg-[#f5f1ff] lg:-right-48 lg:h-[680px] lg:w-[680px]" />
      <div className="pointer-events-none absolute -right-56 top-44 h-[640px] w-[430px] rotate-[24deg] rounded-[50%] bg-gradient-to-b from-[#e8ddff] to-[#f5f0ff] opacity-90 sm:-right-44 sm:w-[520px] lg:-right-28" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[9%] top-16 hidden grid-cols-6 gap-4 opacity-60 lg:grid"
      >
        {Array.from({ length: 36 }, (_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#dcd0ff]" />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1000px]">
        <div className="text-center">
          <p className="mx-auto inline-flex rounded-full bg-[#eee8ff] px-6 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#6b32dc] sm:text-sm">
            FAQ
          </p>
          <h3 className="mx-auto mt-5 max-w-[760px] text-[2.35rem] font-black leading-[1.02] tracking-[-0.05em] text-[#080d32] sm:text-[3rem] lg:text-[40px]">
            Quick <span className="text-[#6429e8]">answers.</span>
          </h3>
          <p className="mx-auto mt-5 max-w-[590px] text-base leading-7 text-[#545a76] sm:text-xl sm:leading-8">
            Find answers to the most common questions
            <br className="hidden sm:block" /> about using CrediNet.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-[940px] sm:mt-12">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-3"
          >
            {faqs.map((faq, index) => {
              const Icon = faq.icon;

              return (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="group overflow-hidden rounded-[18px] border border-[#ececf2] bg-white shadow-[0_8px_24px_rgba(29,30,70,0.07)] transition-colors data-[state=open]:border-[#9a72f5] sm:rounded-[20px]"
                >
                  <AccordionTrigger className="pjs_font items-center px-4 py-4 text-lg font-extrabold leading-7 tracking-[-0.03em] text-[#0c102e] hover:no-underline sm:px-7 sm:py-5 sm:text-xl lg:text-2xl [&>svg]:h-9 [&>svg]:w-9 [&>svg]:rounded-full [&>svg]:border [&>svg]:border-[#e6e6ee] [&>svg]:p-2 [&>svg]:text-[#74798d] data-[state=open]:[&>svg]:border-0 data-[state=open]:[&>svg]:bg-[#eee8ff] data-[state=open]:[&>svg]:text-[#6b32dc]">
                    <span className="flex min-w-0 items-center gap-4 text-left sm:gap-6">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eee8ff] text-[#6429e8] transition-colors group-data-[state=open]:bg-gradient-to-br group-data-[state=open]:from-[#8d5cf7] group-data-[state=open]:to-[#5425dc] group-data-[state=open]:text-white sm:h-12 sm:w-12">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pjs_font border-t border-[#f0eef8] px-4 pb-5 pt-4 text-lg font-medium leading-8 tracking-[-0.02em] text-[#252a44] sm:px-7 sm:pb-6 sm:pl-[100px] sm:text-xl lg:text-2xl">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="mx-auto mt-6 flex max-w-[940px] flex-col items-center gap-5 rounded-[20px] bg-[#eee9ff] px-5 py-6 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ddd3ff] text-[#6429e8]">
              <Headphones className="h-7 w-7" strokeWidth={2.3} />
            </span>
            <div>
              <h4 className="text-lg font-extrabold tracking-[-0.02em] text-[#0c102e]">
                Still have questions?
              </h4>
              <p className="mt-1 text-sm text-[#454b68] sm:text-base">
                Our support team is here to help you.
              </p>
            </div>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-13 w-full items-center justify-center gap-5 rounded-[14px] bg-gradient-to-r from-[#5c24d8] to-[#7130ee] px-7 text-sm font-extrabold tracking-[-0.01em] text-white shadow-[0_12px_28px_rgba(96,42,222,0.2)] sm:w-auto sm:text-base"
          >
            Contact Support
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
