import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  accent: string;
  iconColor: 'bg-red-100' | 'bg-green-100' | 'bg-yellow-100' | 'bg-blue-100';
  iconColorDark: 'text-red-600' | 'text-green-600' | 'text-yellow-600' | 'text-blue-600';
}

export default function ServiceCard({
  icon,
  title,
  description,
  href,
  accent,
  iconColor,
  iconColorDark,
}: ServiceCardProps) {
  return (
    <Link href={href} className="block h-full">
      <div className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-[#eeeaf3] bg-white p-5 transition hover:-translate-y-1 hover:border-[#f45ca0] hover:shadow-[0_20px_50px_rgba(168,85,247,0.10)]">
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 h-1 opacity-0 transition group-hover:opacity-100 ${accent}`}
        />
        <div className="flex min-h-[150px] flex-col justify-between">
          <div>
            <div className={`${iconColor} ${iconColorDark} mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-105`}>
              {icon}
            </div>
            <h3 className="mb-2 text-base font-black tracking-[-0.02em] text-[#171717]">
              {title}
            </h3>
            <p className="text-sm leading-6 text-[#77777c]">{description}</p>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#b1a8bb]">
              Start now
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fbf7ff] text-[#8b5cf6] transition group-hover:bg-[#8b5cf6] group-hover:text-white">
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
