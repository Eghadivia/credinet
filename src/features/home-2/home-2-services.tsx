const services = [
  {
    title: 'Airtime Recharge',
    copy: 'Top up MTN, Airtel, Glo and 9mobile instantly.',
    image: '/assets/images/home-2/Service1.png',
    badgeIcon: '/assets/images/home-2/s1.png',
  },
  {
    title: 'Data Bundles',
    copy: 'Affordable daily, weekly and monthly plans.',
    image: '/assets/images/home-2/Service3.png',
    badgeIcon: '/assets/images/home-2/s2.png',
  },
  {
    title: 'Electricity Bills',
    copy: 'Pay prepaid and postpaid meter bills in seconds.',
    image: '/assets/images/home-2/Service4.png',
    badgeIcon: '/assets/images/home-2/s3.png',
  },
  {
    title: 'Cable TV Renewal',
    copy: 'Renew DStv, GOtv and Startimes subscriptions.',
    image: '/assets/images/home-2/Service5.png',
    badgeIcon: '/assets/images/home-2/s6.png',
  },
  {
    title: '24/7 Service',
    copy: 'Recharge and pay bills anytime, even at midnight.',
    image: '/assets/images/home-2/Service23.png',
    badgeIcon: '/assets/images/home-2/s5.png',
  },
  {
    title: 'Trusted Support',
    copy: 'Quick help whenever a transaction needs attention.',
    image: '/assets/images/home-2/Service24.png',
    badgeIcon: '/assets/images/home-2/s4.png',
  },
];

function ServiceCard({
  title,
  copy,
  image,
  badgeIcon,
}: (typeof services)[number]) {
  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(41,56,121,0.10)]">
      <div className="relative h-[190px] overflow-hidden sm:h-[220px]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(255,255,255,0.06)_100%)]" />
      </div>

      <div className="relative px-6 pb-7 pt-8 sm:px-7">
        <div className="absolute -top-8 left-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#FE494A] to-[#A135FF] shadow-[0_12px_28px_rgba(55,55,55,0.12)] sm:left-7">
          <img
            src={badgeIcon}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain"
          />
        </div>
        <h3 className="text-[1.75rem] font-black leading-none tracking-[-0.04em] text-[#121212] sm:text-[1.95rem]">
          {title}
        </h3>
        <p className="mt-4 max-w-[18rem] text-base leading-7 text-[#2a2a2a] sm:text-[1.05rem]">
          {copy}
        </p>
      </div>
    </article>
  );
}

export default function Home2Services() {
  return (
    <section id="services" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-[#151515] sm:text-sm">
            Our Services
          </p>
          <h2 className="mx-auto mt-5 max-w-[760px] text-[2.35rem] font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-[3rem] lg:text-[40px]">
            Recharge has never felt this good.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
