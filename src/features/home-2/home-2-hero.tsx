import Link from 'next/link';

const featureItems = ['Secure & Encrypted', 'Instant Payments', '24/7 Support'];

const statItems = [
  {
    value: '12M+',
    label: 'Successful transactions',
    icon: '/assets/images/home-2/b1.png',
  },
  {
    value: '850K',
    label: 'Happy customers',
    icon: '/assets/images/home-2/b2.png',
  },
  {
    value: '99.98%',
    label: 'Platform uptime',
    icon: '/assets/images/home-2/b3.png',
  },
  {
    value: '₦240B',
    label: 'Bills processed',
    icon: '/assets/images/home-2/b4.png',
  },
];

const serviceCards = [
  {
    eyebrow: 'Airtime Top up',
    title: 'MTN',
    copy: 'Instant top up',
    className: 'bg-[#fff2c6] text-[#131313]',
    content: (
      <img
        src="/assets/images/home-2/mtv.png"
        alt=""
        aria-hidden="true"
        className="h-13 w-24 object-contain"
      />
    ),
  },
  {
    eyebrow: 'Premium',
    title: 'DStv',
    copy: 'Renewed',
    className: 'bg-gradient-to-r from-[#c26bff] to-[#9333ea] text-white',
    content: (
      <img
        src="/assets/images/home-2/dstv.png"
        alt=""
        aria-hidden="true"
        className="h-14 w-14 object-contain"
      />
    ),
  },
  {
    eyebrow: 'Data Bundle',
    title: '10GB',
    copy: 'Active 30 days',
    className: 'bg-gradient-to-r from-[#66d2ff] to-[#2ca9f4] text-white',
    content: (
      <img
        src="/assets/images/home-2/wifi.png"
        alt=""
        aria-hidden="true"
        className="h-14 w-14 object-contain"
      />
    ),
  },
  {
    eyebrow: 'Instant Delivery',
    title: '3 Sec',
    copy: 'avg delivery time',
    className: 'bg-gradient-to-br from-[#ff909a] to-[#ff686d] text-white',
    content: (
      <img
        src="/assets/images/home-2/electercity.png"
        alt=""
        aria-hidden="true"
        className="h-12 w-12 object-contain"
      />
    ),
  },
];

function ServiceCard({
  eyebrow,
  title,
  copy,
  className,
  content,
}: (typeof serviceCards)[number]) {
  return (
    <article className={`rounded-[28px] p-5 shadow-[0_18px_50px_rgba(72,84,159,0.12)] ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium opacity-90">{eyebrow}</p>
          <h3 className="mt-2 text-3xl font-black leading-none">{title}</h3>
          <p className="mt-3 text-sm opacity-90">{copy}</p>
        </div>
        {content}
      </div>
    </article>
  );
}

export default function Home2Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(212,240,255,0.95),_rgba(232,235,255,0.95)_42%,_rgba(223,247,246,0.9)_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(199,207,255,0.12),rgba(255,255,255,0)_18%,rgba(188,183,255,0.18)_48%,rgba(255,255,255,0)_77%,rgba(166,255,240,0.16))]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[28%] bg-[linear-gradient(135deg,rgba(199,231,255,0.5)_0%,rgba(199,231,255,0)_60%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[28%] bg-[linear-gradient(225deg,rgba(208,255,244,0.35)_0%,rgba(208,255,244,0)_60%)]" />

      <div className="relative mx-auto max-w-[1360px] px-4 pb-18 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-14">
        <div className="grid items-start gap-10 xl:grid-cols-[1.05fr_1.35fr]">
          <div className="max-w-[520px] pt-4 lg:pt-14">
            <div className="inline-flex rounded-full border border-[#dfb8ff] bg-[#f8ecff] px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-[#1c1c1c]">
              All utility bills in one place
            </div>
            <h1 className="mt-8 text-[3.4rem] font-black leading-[0.92] tracking-[-0.06em] text-black sm:text-[4.75rem] lg:text-[6.4rem]">
              Top up.
              <br />
              Power on.
            </h1>
            <p className="mt-8 max-w-[620px] text-lg leading-9 text-[#1c1c1c] sm:text-[1.05rem]">
              Pay airtime, data, electricity and cable bills with one clean,
              secure dashboard built for everyday Nigerians.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-16 items-center justify-center rounded-full bg-gradient-to-r from-[#ff494c] via-[#ec4ca7] to-[#8b3ff5] px-10 text-xl font-medium text-white shadow-[0_18px_40px_rgba(174,72,255,0.24)] sm:text-lg"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-xl font-medium text-[#171717] shadow-[0_12px_32px_rgba(37,37,37,0.08)] sm:text-lg"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr_0.72fr]">
              <div className="relative order-1 flex min-h-[280px] items-end justify-center xl:order-none xl:min-h-[560px]">
                <img
                  src="/assets/images/home-2/business-man.png"
                  alt="CrediNet customer"
                  className="relative z-10 h-auto max-h-[440px] w-full max-w-[340px] -translate-y-[4.25rem] object-contain sm:-translate-y-[5.25rem] lg:-translate-y-[6.25rem] xl:max-h-[560px] xl:max-w-[380px]"
                />
                <img
                  src="/assets/images/phone.png"
                  alt="CrediNet app phone"
                  className="absolute left-1/2 top-10 z-20 w-24 -translate-x-[85%] rounded-[22px] shadow-[0_16px_40px_rgba(131,79,255,0.2)] sm:w-28 xl:top-14 xl:w-30"
                />
              </div>

              <div className="order-3 xl:order-none">
                <div className="rounded-[34px] bg-white p-6 shadow-[0_30px_90px_rgba(56,70,138,0.14)] sm:p-8">
                  <p className="text-[15px] font-medium uppercase text-[#7d7d89]">
                    Payment
                  </p>
                  <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-black sm:text-5xl">
                    Quick top up
                  </h2>

                  <div className="mt-7 grid grid-cols-4 gap-2">
                    {['MTN', 'Airtel', 'Glo', '9mobile'].map((item, index) => (
                      <div
                        key={item}
                        className={`flex h-11 items-center justify-center rounded-2xl text-sm font-medium ${
                          index === 0
                            ? 'bg-[#ff7d7b] text-white'
                            : 'bg-[#f5f5f8] text-[#242424]'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 space-y-5">
                    <div>
                      <p className="mb-3 text-sm font-medium text-[#212121]">
                        Phone number
                      </p>
                      <div className="flex h-16 items-center rounded-2xl border border-[#ececf2] bg-[#fafafa] px-5 text-xl font-semibold text-[#1a1a1a] sm:text-lg">
                        0802 345 6789
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-sm font-medium text-[#212121]">
                        Amount
                      </p>
                      <div className="flex h-16 items-center rounded-2xl border border-[#ececf2] bg-[#fafafa] px-5 text-xl font-semibold text-[#1a1a1a] sm:text-lg">
                        ₦2,000
                      </div>
                    </div>
                  </div>

                  <button className="mt-8 flex h-16 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff494c] via-[#ec4ca7] to-[#8b3ff5] text-xl font-medium text-white shadow-[0_18px_40px_rgba(174,72,255,0.22)] sm:text-lg">
                    Continue to Pay
                  </button>
                </div>
              </div>

              <div className="order-2 grid content-start gap-5 sm:grid-cols-2 xl:order-none xl:grid-cols-1">
                {serviceCards.slice(0, 3).map((card) => (
                  <ServiceCard key={card.title} {...card} />
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:absolute xl:bottom-[-22px] xl:left-[6%] xl:max-w-[610px]">
              <ServiceCard {...serviceCards[3]} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 text-center text-lg font-medium text-[#1c1c1c] lg:mt-16">
          {featureItems.map((item, index) => (
            <div key={item} className="flex items-center gap-5">
              <span>{item}</span>
              {index < featureItems.length - 1 ? (
                <span className="hidden h-7 w-px bg-[#d8d4e8] sm:block" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[1120px] rounded-[36px] bg-white px-8 py-8 shadow-[0_20px_70px_rgba(64,78,150,0.09)] sm:px-10 lg:mt-12 lg:rounded-[40px]">
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {statItems.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#f7f1ff]">
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div>
                  <p className="text-4xl font-black tracking-[-0.04em] text-[#7c3aed]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-lg leading-7 text-[#191919]">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
