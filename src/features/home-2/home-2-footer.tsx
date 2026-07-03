const footerGroups = [
  {
    title: 'Product',
    links: ['Airtime', 'Data', 'Bills', 'Cable TV'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Support', 'Careers'],
  },
  {
    title: 'Legal',
    links: ['Terms', 'Privacy', 'Refunds', 'Security'],
  },
];

export default function Home2Footer() {
  return (
    <footer className="bg-[#dedede] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-18">
      <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
        <div className="max-w-[320px]">
          <img
            src="/assets/images/newlogo.png"
            alt="CrediNet"
            className="h-12 w-auto"
          />
          <p className="mt-8 text-[1.05rem] leading-8 text-[#2a2a2a]">
            A smarter way to recharge, pay bills and stay connected.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[1.1rem] font-black text-[#171717]">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-5 text-[1.05rem] text-[#2a2a2a]">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-[#ff4d54]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
