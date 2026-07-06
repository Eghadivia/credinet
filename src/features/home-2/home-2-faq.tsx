import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Do I need a wallet to use Credinet?',
    answer: 'No. You can pay securely and complete each transaction directly.',
  },
  {
    question: 'How fast are purchases delivered?',
    answer: 'Most airtime, data and bill payments are processed instantly.',
  },
  {
    question: 'Which networks are supported?',
    answer:
      'MTN, Airtel, Glo, 9mobile, DStv, GOtv, Startimes and electricity providers.',
  },
  {
    question: 'Can I pay electricity bills?',
    answer:
      'Yes. Credinet supports prepaid and postpaid electricity bill payments.',
  },
  {
    question: 'Is my card information safe?',
    answer:
      'Yes. Payments are processed through secure payment infrastructure.',
  },
];

export default function Home2Faq() {
  return (
    <section id="faq" className="bg-white px-4 py-18 sm:px-6 sm:py-22 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[#181818] sm:text-sm">
            FAQ
          </p>
          <h2 className="mx-auto mt-5 max-w-[760px] text-[2.35rem] font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-[3rem] lg:text-[40px]">
            Quick answers.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-[920px] lg:mt-14">
          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-5">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="overflow-hidden rounded-[28px] border-0 bg-[#f6f6f6]"
              >
                <AccordionTrigger className="px-6 py-7 text-[1.05rem] font-black leading-7 text-[#151515] hover:no-underline sm:px-8 sm:text-[1.15rem]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="border-t border-[#ececec] px-6 pb-8 pt-6 text-base leading-8 text-[#232323] sm:px-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mx-auto mt-14 max-w-[950px] rounded-[30px] bg-black px-6 py-14 text-center text-white shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:px-10 sm:py-18 lg:mt-16 lg:rounded-[32px]">
          <h3 className="text-[2.35rem] font-black leading-[1.02] tracking-[-0.05em] sm:text-[3rem] lg:text-[40px]">
            Get on Credinet today.
          </h3>
          <p className="mx-auto mt-5 max-w-[620px] text-base leading-8 text-white/80 sm:text-lg">
            Join thousands already paying bills faster with a secure, simple
            dashboard.
          </p>
          <Link
            href="/signup"
            className="mt-9 inline-flex h-15 items-center justify-center rounded-full bg-gradient-to-r from-[#ff494c] via-[#ec4ca7] to-[#8b3ff5] px-8 text-lg font-medium text-white shadow-[0_18px_40px_rgba(164,55,255,0.28)]"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
