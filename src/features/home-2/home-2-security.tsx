const securityItems = [
  {
    title: 'SSL Secure',
    copy: 'Every payment is encrypted.',
    icon: '/assets/images/home-2/sf1.png',
  },
  {
    title: 'Encrypted Payments',
    copy: 'Your card details stay protected.',
    icon: '/assets/images/home-2/sf2.png',
  },
  {
    title: 'PCI-DSS Compliant',
    copy: 'Built around payment safety standards.',
    icon: '/assets/images/home-2/sf3.png',
  },
  {
    title: 'Safe Transactions',
    copy: 'Track every purchase from your dashboard.',
    icon: '/assets/images/home-2/sf4.png',
  },
];

function SecurityCard({
  title,
  copy,
  icon,
}: (typeof securityItems)[number]) {
  return (
    <article className="rounded-[28px] bg-[#ece8ff] px-7 py-7 sm:px-9 sm:py-8">
      <div className="flex items-center gap-6">
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_12px_24px_rgba(0,0,0,0.04)] sm:h-20 sm:w-20">
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
          />
        </div>
        <div>
          <h3 className="text-[1.9rem] font-black leading-none tracking-[-0.04em] text-[#131313] sm:text-[2.1rem]">
            {title}
          </h3>
          <p className="mt-3 text-base leading-7 text-[#2f2f2f] sm:text-[1.05rem]">
            {copy}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Home2Security() {
  return (
    <section id="security" className="bg-white px-4 py-18 sm:px-6 sm:py-22 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[#181818] sm:text-sm">
            Safe by design
          </p>
          <h2 className="mx-auto mt-5 max-w-[760px] text-[2.35rem] font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-[3.2rem] lg:text-[4rem]">
            Your money, fully protected.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:gap-6 lg:mt-14 lg:grid-cols-2">
          {securityItems.map((item) => (
            <SecurityCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
