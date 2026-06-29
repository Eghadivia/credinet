import type { LucideIcon } from 'lucide-react';
import {
  Check,
  Clock3,
  Headphones,
  Lightbulb,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Tv,
  WalletCards,
  Wifi,
} from 'lucide-react';

export type ServiceItem = {
  icon: LucideIcon;
  title: string;
  copy: string;
};

export const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#how', label: 'How it works' },
  { href: '#security', label: 'Security' },
  { href: '#faq', label: 'FAQ' },
];

export const services: ServiceItem[] = [
  {
    icon: Smartphone,
    title: 'Airtime Recharge',
    copy: 'Top up MTN, Airtel, Glo and 9mobile instantly.',
  },
  {
    icon: Wifi,
    title: 'Data Bundles',
    copy: 'Affordable daily, weekly and monthly plans.',
  },
  {
    icon: Lightbulb,
    title: 'Electricity Bills',
    copy: 'Pay prepaid and postpaid meter bills in seconds.',
  },
  {
    icon: Tv,
    title: 'Cable TV Renewal',
    copy: 'Renew DStv, GOtv and Startimes subscriptions.',
  },
  {
    icon: Clock3,
    title: '24/7 Service',
    copy: 'Recharge and pay bills anytime, even at midnight.',
  },
  {
    icon: Headphones,
    title: 'Trusted Support',
    copy: 'Quick help whenever a transaction needs attention.',
  },
];

export const steps = [
  ['01', 'Create Account', 'Sign up in under a minute.'],
  ['02', 'Select Package', 'Choose the service you need.'],
  ['03', 'Pay Securely', 'Complete and get instant value.'],
];

export const stats = [
  ['12M+', 'Successful transactions'],
  ['850K', 'Happy customers'],
  ['99.98%', 'Platform uptime'],
  ['₦240B', 'Bills processed'],
];

export const security = [
  { icon: LockKeyhole, title: 'SSL Secure', copy: 'Every payment is encrypted.' },
  {
    icon: ShieldCheck,
    title: 'Encrypted Payments',
    copy: 'Your card details stay protected.',
  },
  {
    icon: Check,
    title: 'PCI-DSS Compliant',
    copy: 'Built around payment safety standards.',
  },
  {
    icon: WalletCards,
    title: 'Safe Transactions',
    copy: 'Track every purchase from your dashboard.',
  },
];

export const reviews = [
  ['Tunde A.', 'Credinet makes my data and electricity payments stress-free.'],
  ['Sarah K.', 'Fast, clean and reliable. I use it for all my family top-ups.'],
  ['Ayo M.', 'The transaction history helps me track everything easily.'],
];

export const faqs = [
  [
    'Do I need a wallet to use Credinet?',
    'No. You can pay securely and complete each transaction directly.',
  ],
  [
    'How fast are purchases delivered?',
    'Most airtime, data and bill payments are processed instantly.',
  ],
  [
    'Which networks are supported?',
    'MTN, Airtel, Glo, 9mobile, DStv, GOtv, Startimes and electricity providers.',
  ],
  [
    'Can I pay electricity bills?',
    'Yes. Credinet supports prepaid and postpaid electricity bill payments.',
  ],
  [
    'Is my card information safe?',
    'Yes. Payments are processed through secure payment infrastructure.',
  ],
];

export const footerGroups = [
  ['Product', 'Airtime', 'Data', 'Bills', 'Cable TV'],
  ['Company', 'About', 'Contact', 'Support', 'Careers'],
  ['Legal', 'Terms', 'Privacy', 'Refunds', 'Security'],
];
