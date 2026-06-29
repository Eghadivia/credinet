'use client';

export default function Footer() {
  return (
    <footer className="bg-[#0B014B] text-white">
      <div className="container mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-5 mb-10 lg:mb-12">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-5">
              <img
                src="/logo.png"
                alt="CrediNet"
                className="h-14 sm:h-[70px] lg:h-[86px] w-auto"
              />
              <p className="text-[#DBEAFE] text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-[420px] w-full">
                The smartest way to pay bills, buy airtime, and manage utility
                payments securely online.
              </p>
              <div className="flex gap-3 sm:gap-4 pt-1">
                <a
                  href="#"
                  className="w-8 h-8 sm:w-9 sm:h-9 border border-[#D0D0D0] rounded-full flex items-center justify-center hover:border-red-500 transition"
                >
                  <svg
                    width={16}
                    height={19}
                    viewBox="0 0 16 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.783 13.3219V5.39643C10.783 5.39643 11.6768 6.88648 14.9058 6.97508C15.0829 6.98313 15.2198 6.83815 15.2198 6.66901V4.4299C15.2198 4.26076 15.091 4.12383 14.9219 4.11578C12.4176 3.97886 11.2259 2.05386 11.1051 0.289955C11.097 0.128868 10.9521 0 10.791 0H8.23844C8.06934 0 7.93245 0.144981 7.93245 0.314122V12.9192C7.93245 14.2884 6.88564 15.4724 5.51675 15.5449C3.95459 15.6174 2.68232 14.2723 2.87558 12.6856C3.01247 11.5661 3.90628 10.6479 5.02556 10.4948C5.25102 10.4626 5.46843 10.4599 5.67779 10.4868C5.863 10.5029 6.02404 10.366 6.02404 10.1807V7.93355C6.02404 7.77246 5.90326 7.63554 5.74221 7.62748C5.42549 7.606 5.09803 7.61406 4.75983 7.65165C2.29581 7.93355 0.306884 9.92297 0.0331047 12.3876C-0.321198 15.6416 2.21529 18.3962 5.39596 18.3962C8.36727 18.3962 10.783 15.9879 10.783 13.0078"
                      fill="#D0D0D0"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-9 sm:h-9 border border-[#D0D0D0] rounded-full flex items-center justify-center hover:border-red-500 transition"
                >
                  <svg
                    width={17}
                    height={17}
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.7811 4.05135V12.734C16.7811 14.965 14.9693 16.7853 12.7307 16.7853H4.05033C1.81178 16.7853 0 14.965 0 12.734V4.05135C0 1.81223 1.81178 0 4.05033 0H12.7307C14.9693 0 16.7811 1.81223 16.7811 4.05135ZM15.3397 4.3413C15.3397 2.73848 14.0433 1.44173 12.4409 1.44173H4.34021C2.74585 1.44173 1.44942 2.73848 1.44942 4.3413V12.444C1.44942 14.0388 2.74585 15.3355 4.34021 15.3355H12.4409C14.0433 15.3355 15.3397 14.0388 15.3397 12.444V4.3413Z"
                      fill="#D0D0D0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.739 8.39258C12.739 10.7847 10.7984 12.7339 8.39881 12.7339C6.00726 12.7339 4.05859 10.7847 4.05859 8.39258C4.05859 5.99237 6.00726 4.05127 8.39881 4.05127C10.7984 4.05127 12.739 5.99237 12.739 8.39258ZM11.2896 8.39258C11.2896 6.79781 9.99317 5.493 8.39881 5.493C6.80444 5.493 5.50801 6.79781 5.50801 8.39258C5.50801 9.98734 6.80444 11.2841 8.39881 11.2841C9.99317 11.2841 11.2896 9.98734 11.2896 8.39258Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M13.0288 4.62237C12.5537 4.62237 12.1592 4.23585 12.1592 3.76076C12.1592 3.27762 12.5537 2.89111 13.0288 2.89111C13.512 2.89111 13.8985 3.27762 13.8985 3.76076C13.8985 4.23585 13.512 4.62237 13.0288 4.62237Z"
                      fill="#D0D0D0"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-9 sm:h-9 border border-[#D0D0D0] rounded-full flex items-center justify-center hover:border-red-500 transition"
                >
                  <svg
                    width={19}
                    height={14}
                    viewBox="0 0 19 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.7297 2.46463V11.0909C18.7297 12.4521 17.6185 13.5555 16.2577 13.5555H2.47206C1.11122 13.5555 0 12.4521 0 11.0909V2.46463C0 1.10345 1.11122 0 2.47206 0H16.2577C17.6185 0 18.7297 1.10345 18.7297 2.46463ZM11.5793 6.18575L7.74635 4.26881C7.30347 4.04329 6.78007 4.36547 6.78007 4.86484V8.69872C6.78007 9.19003 7.30347 9.51221 7.74635 9.29474L11.5793 7.3778C12.0705 7.12811 12.0705 6.42738 11.5793 6.18575Z"
                      fill="#D0D0D0"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Link groups */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
              {/* Services */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                  Services
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-white text-sm sm:text-base lg:text-lg">
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Airtime top-up
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Data Bundles
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Electricity Bills
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Cable TV
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                  Company
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-white text-sm sm:text-base lg:text-lg">
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                  Legal
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-white text-sm sm:text-base lg:text-lg">
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Refund Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-red-500 text-white transition">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-[rgba(255,255,255,0.2)] py-6 sm:py-8">
            <p className="text-center text-[#D0D0D0] text-sm sm:text-base font-medium">
              Copyright @ Virtual Top-up 2026. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
