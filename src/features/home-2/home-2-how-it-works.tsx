import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Account',
    copy: 'Sign up in under a minute.',
    icon: '/assets/images/home-2/g1.png',
  },
  {
    number: '02',
    title: 'Select Package',
    copy: 'Choose the service you need.',
    icon: '/assets/images/home-2/g2.png',
  },
  {
    number: '03',
    title: 'Pay Securely',
    copy: 'Complete and get instant value.',
    icon: '/assets/images/home-2/g3.png',
  },
];

function StepItem({
  number,
  title,
  copy,
  icon,
  isLast,
  index,
}: (typeof steps)[number] & { isLast: boolean; index: number }) {
  return (
    <div
      className="u-anim-how-step relative flex flex-col items-center text-center"
      style={{ animationDelay: `${index * 180}ms` }}
    >
      <div className="relative">
        <span className="u-anim-badge-drift absolute -left-4 top-0 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#8833FB] px-2 text-xs font-black text-white shadow-[0_8px_18px_rgba(136,51,251,0.28)] sm:-left-2">
          {number}
        </span>
        <div className="u-anim-how-circle flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-r from-[#FE494A] to-[#8833FB] shadow-[0_20px_50px_rgba(136,51,251,0.18)] sm:h-40 sm:w-40 lg:h-44 lg:w-44">
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="h-15 w-15 object-contain sm:h-17 sm:w-17 lg:h-18 lg:w-18"
          />
        </div>
      </div>

      {!isLast ? (
        <div className="my-6 flex items-center justify-center lg:absolute lg:left-[72%] lg:top-[72px] lg:my-0 lg:w-[44%] xl:w-[52%]">
          <div className="u-anim-flow-line hidden h-px flex-1 border-t border-dashed border-[#8e8e94] lg:block" />
          <ArrowRight className="u-anim-flow-arrow hidden h-4 w-4 text-[#6b6b6f] lg:block" />
        </div>
      ) : null}

      <div className="mt-8 max-w-[240px]">
        <h3 className="text-[2rem] font-black leading-none tracking-[-0.04em] text-[#121212]">
          {title}
        </h3>
        <p className="mt-3 text-lg leading-7 text-[#2c2c31]">{copy}</p>
      </div>
    </div>
  );
}

export default function Home2HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#ececec] px-4 py-18 sm:px-6 sm:py-22 lg:px-8 lg:py-26"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[#181818] sm:text-sm">
            How it works
          </p>
          <h2 className="mx-auto mt-5 max-w-[720px] text-[2.35rem] font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-[3rem] lg:text-[40px]">
            Done before your tea cools.
          </h2>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-8 xl:mt-18">
          {steps.map((step, index) => (
            <StepItem
              key={step.number}
              {...step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
