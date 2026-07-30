'use client';

import * as React from 'react';
import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const reviews = [
  {
    name: 'Tunde A.',
    quote: 'Credinet makes my data and electricity payments stress-free.',
    image: '/assets/images/home-2/iamge-1.png',
  },
  {
    name: 'Sarah K.',
    quote: 'Fast, clean and reliable. I use it for all my family top-ups.',
    image: '/assets/images/home-2/imge-2.png',
  },
  {
    name: 'Ayo M.',
    quote: 'The transaction history helps me track everything easily.',
    image: '/assets/images/home-2/imge-3.png',
  },
  {
    name: 'Mariam O.',
    quote: 'Everything feels simple, secure and much faster than before.',
  },
  {
    name: 'Daniel E.',
    quote: 'Airtime, cable and electricity all in one place saves me time.',
  },
];

const avatarGradients = [
  'from-[#fff0c8] to-[#ffd66d] text-[#6b4300]',
  'from-[#f6d9ff] to-[#d8b4fe] text-[#5b247a]',
  'from-[#dbeafe] to-[#93c5fd] text-[#153e75]',
  'from-[#dcfce7] to-[#86efac] text-[#14532d]',
  'from-[#ffe4e6] to-[#fda4af] text-[#881337]',
];

function ReviewCard({
  name,
  quote,
  image,
  index,
}: {
  name: string;
  quote: string;
  image?: string;
  index: number;
}) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .replace('.', '');

  return (
    <article className="flex h-full min-h-[330px] flex-col rounded-[28px] border border-white/80 bg-white/95 px-7 py-7 shadow-[0_20px_55px_rgba(75,50,160,0.11)] backdrop-blur-sm sm:min-h-[360px] sm:px-8 sm:py-8">
      <div className="flex items-center justify-between gap-5">
        <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7138ed] to-[#4511d7] text-white shadow-[0_9px_22px_rgba(87,39,219,0.24)]">
          <Quote className="h-5 w-5 fill-current" aria-hidden="true" />
        </span>
        <div
          className="flex gap-1 text-[#ffb703]"
          aria-label="5 out of 5 stars"
        >
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Star
              key={starIndex}
              className="h-[19px] w-[19px] fill-current stroke-current"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <p className="mt-8 flex-1 text-[1.05rem] font-medium leading-[1.8] text-[#15152b] sm:text-[1.1rem]">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="mt-7 flex items-center gap-4 border-t border-[#ece9f6] pt-5">
        {image ? (
          <Image
            src={image}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-extrabold ${avatarGradients[index % avatarGradients.length]}`}
            aria-hidden="true"
          >
            {initials}
          </span>
        )}
        <p className="text-lg font-extrabold tracking-[-0.02em] text-[#111126]">
          {name}
        </p>
        <Quote
          className="ml-auto h-12 w-12 rotate-180 fill-[#eee9ff] text-[#eee9ff]"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}

function ReviewsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[170px] -top-[190px] h-[570px] w-[430px] rounded-[50%] bg-gradient-to-br from-[#cfb9ff] via-[#b99df7] to-[#eee8ff] opacity-90 blur-[1px]" />
      <div className="absolute left-[7%] top-0 h-[180px] w-[260px] opacity-45 [background-image:radial-gradient(#c7b5f7_2px,transparent_2px)] [background-size:26px_26px]" />
      <div className="absolute -bottom-[180px] -right-[150px] h-[430px] w-[430px] rounded-full bg-[#d6c3ff]/45 blur-[90px]" />
      <div className="absolute left-[28%] top-[35%] h-[300px] w-[420px] rounded-full bg-[#e8dfff]/60 blur-[95px]" />

      <svg
        className="absolute -right-24 -top-8 h-[520px] w-[580px] text-[#c8b3fa] opacity-25"
        viewBox="0 0 580 520"
        fill="none"
      >
        {Array.from({ length: 14 }).map((_, index) => (
          <path
            key={index}
            d={`M ${125 + index * 10} -20 C ${35 + index * 8} 150, ${
              145 + index * 7
            } 330, ${600 + index * 6} ${305 + index * 12}`}
            stroke="currentColor"
            strokeWidth="1.4"
          />
        ))}
      </svg>

      <svg
        className="absolute -bottom-28 -left-20 h-[330px] w-[760px] text-[#bda3f5] opacity-35"
        viewBox="0 0 760 330"
        fill="none"
      >
        {Array.from({ length: 13 }).map((_, index) => (
          <path
            key={index}
            d={`M -20 ${205 + index * 9} C 170 ${75 + index * 5}, 310 ${
              310 + index * 3
            }, 790 ${55 + index * 9}`}
            stroke="currentColor"
            strokeWidth="1.4"
          />
        ))}
      </svg>
    </div>
  );
}

export default function Home2Reviews() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    update();
    api.on('select', update);
    api.on('reInit', update);

    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e4d7ff_0%,#f6f2ff_42%,#f1eaff_68%,#ddccff_100%)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <ReviewsBackground />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#c6b6ef] sm:w-16" />
            <p className="text-xs font-extrabold uppercase tracking-[0.36em] text-[#5623d8] sm:text-sm">
              Reviews
            </p>
            <span className="h-px w-12 bg-[#c6b6ef] sm:w-16" />
          </div>
          <h2 className="mx-auto mt-5 max-w-[760px] text-[2.4rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-[#0d0c28] sm:text-[3.3rem] lg:text-[4rem]">
            Customers{' '}
            <span className="bg-gradient-to-r from-[#7334ee] to-[#4715d8] bg-clip-text text-transparent">
              love us.
            </span>
          </h2>
        </div>

        <div className="mt-12 lg:mt-16">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent className="-ml-5">
              {reviews.map((review, index) => (
                <CarouselItem
                  key={`${review.name}-${review.quote}`}
                  className="pl-5 md:basis-1/2 lg:basis-1/3"
                >
                  <ReviewCard {...review} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-10 flex items-center justify-center gap-3">
            {Array.from({ length: snapCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to review group ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`h-3.5 w-3.5 rounded-full transition-all duration-300 ${
                  selectedIndex === index
                    ? 'scale-110 bg-[#6029df]'
                    : 'bg-[#d8cff3] hover:bg-[#bba9ea]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
