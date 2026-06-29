import { footerGroups } from './landing-data';

export default function HomeFooter() {
  return (
    <footer className="border-t border-[#f0eeee] bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src="/assets/images/new-logo.png"
            alt="Credinet"
            className="mb-4 h-14 w-auto sm:h-20"
          />
          <p className="max-w-xs text-sm leading-6 text-[#77777c]">
            A smarter way to recharge, pay bills and stay connected.
          </p>
        </div>
        {footerGroups.map(([heading, ...links]) => (
          <div key={heading}>
            <h3 className="mb-4 text-sm font-black">{heading}</h3>
            <ul className="space-y-3 text-sm text-[#77777c]">
              {links.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#ee1c25]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
