'use client';

import Link from 'next/link';
import { Smartphone, Wifi, Lightbulb, Tv, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardNav from '@/features/dashboard-nav/dashboard-nav';

interface PaymentService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}   

const services: PaymentService[] = [
  {
    id: 'airtime',
    name: 'Airtime Recharge',
    description: 'Top up mobile credits instantly',
    icon: <Smartphone className="w-8 h-8" />,
    color: 'bg-red-100 text-red-600',
    href: '/payments/airtime',
  },
  {
    id: 'data',
    name: 'Data Bundle Purchase',
    description: 'Stay connected anywhere',
    icon: <Wifi className="w-8 h-8" />,
    color: 'bg-green-100 text-green-600',
    href: '/payments/data',
  },
  {
    id: 'electricity',
    name: 'Electricity Bill Payment',
    description: 'Power up your home or office',
    icon: <Lightbulb className="w-8 h-8" />,
    color: 'bg-yellow-100 text-yellow-600',
    href: '/payments/electricity',
  },
  {
    id: 'cable-tv',
    name: 'Cable TV Subscription',
    description: 'Renew your favorite channels',
    icon: <Tv className="w-8 h-8" />,
    color: 'bg-blue-100 text-blue-600',
    href: '/payments/cable-tv',
  },
];

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 overflow-hidden rounded-[32px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ff5a57]">
            Payments
          </p>
          <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171717] sm:text-5xl">
            Make a Payment
          </h1>
          <p className="mt-3 text-[#77777c]">Choose a service to pay for</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link key={service.id} href={service.href}>
              <div className="group h-full cursor-pointer rounded-[28px] border border-[#f0eeee] bg-white p-8 shadow-[0_18px_50px_rgba(23,23,23,0.04)] transition hover:-translate-y-1 hover:border-[#ff5a57] hover:shadow-[0_24px_70px_rgba(238,28,37,0.10)]">
                <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 transition group-hover:scale-105`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black tracking-[-0.03em] text-[#171717] mb-2">{service.name}</h3>
                <p className="text-[#77777c] mb-6">{service.description}</p>
                <Button className="h-12 w-full rounded-full bg-gradient-to-r from-[#ff6b68] via-[#f45ca0] to-[#a855f7] text-white shadow-[0_18px_38px_rgba(242,33,124,0.20)] hover:opacity-95">
                  Continue <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import Link from 'next/link';
// import { Smartphone, Wifi, Lightbulb, Tv, ArrowRight, Zap } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import DashboardNav from '@/features/dashboard-nav/dashboard-nav';

// interface PaymentService {
//   id: string;
//   name: string;
//   description: string;
//   icon: React.ReactNode;
//   color: string;
//   href: string;
// }

// const services: PaymentService[] = [
//   {
//     id: 'airtime',
//     name: 'Airtime Recharge',
//     description: 'Top up mobile credits instantly',
//     icon: <Smartphone className="w-8 h-8" />,
//     color: 'bg-primary/10 text-primary',
//     href: '/payments/airtime',
//   },
//   {
//     id: 'data',
//     name: 'Data Bundle Purchase',
//     description: 'Stay connected anywhere',
//     icon: <Wifi className="w-8 h-8" />,
//     color: 'bg-primary/10 text-primary',
//     href: '/payments/data',
//   },
//   {
//     id: 'electricity',
//     name: 'Electricity Bill Payment',
//     description: 'Power up your home or office',
//     icon: <Lightbulb className="w-8 h-8" />,
//     color: 'bg-primary/10 text-primary',
//     href: '/payments/electricity',
//   },
//   {
//     id: 'cable-tv',
//     name: 'Cable TV Subscription',
//     description: 'Renew your favorite channels',
//     icon: <Tv className="w-8 h-8" />,
//     color: 'bg-primary/10 text-primary',
//     href: '/payments/cable-tv',
//   },
// ];

// export default function PaymentsPage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <DashboardNav />
//       <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-2 md:py-4 lg:py-6">
//         {/* Header Section */}
//         <div className="mb-8 sm:mb-2 md:mb-6 lg:mb-10">          
//           <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 tracking-tight">
//             Make a Payment
//           </h1>
//           <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
//             Choose a service to pay for. Fast, secure, and convenient payments at your fingertips.
//           </p>
//         </div>

//         {/* Services Grid - Responsive */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 md:mb-6 lg:mb-10">
//           {services.map((service) => (
//             <Link key={service.id} href={service.href}>
//               <div className="group relative h-full bg-card border border-border rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 p-5 sm:p-6 md:p-7 lg:p-8 cursor-pointer flex flex-col">
//                 {/* Icon Container */}
//                 <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg ${service.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
//                   <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">{service.icon}</div>
//                 </div>

//                 {/* Content */}
//                 <div className="space-y-2 sm:space-y-3 flex-1 mb-4 sm:mb-5 md:mb-6">
//                   <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
//                     {service.name}
//                   </h3>
//                   <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-2">
//                     {service.description}
//                   </p>
//                 </div>

//                 {/* Button with Arrow */}
//                 <div className="w-full pt-4 sm:pt-5 md:pt-6 border-t border-border">
//                   <button className="w-full flex items-center justify-between bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-semibold py-2.5 sm:py-3 md:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 group-hover:gap-2 sm:group-hover:gap-3">
//                     <span className="text-sm sm:text-base">Continue</span>
//                     <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
//                   </button>
//                 </div>

//                 {/* Decorative top border accent */}
//                 <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/50 to-transparent rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </div>
//             </Link>
//           ))}
//         </div>      
//       </div>
//     </div>
//   );
// }
