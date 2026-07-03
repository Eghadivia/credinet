'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
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
  },
  {
    name: 'Sarah K.',
    quote: 'Fast, clean and reliable. I use it for all my family top-ups.',
  },
  {
    name: 'Ayo M.',
    quote: 'The transaction history helps me track everything easily.',
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

function ReviewCard({
  name,
  quote,
}: {
  name: string;
  quote: string;
}) {
  return (
    <article className="h-full rounded-[28px] bg-white px-8 py-8 shadow-[0_18px_50px_rgba(46,46,46,0.08)] sm:px-9 sm:py-9">
      <div className="mb-6 flex gap-1 text-[#f7b719]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <p className="text-[1.1rem] leading-8 text-[#191919]">&quot;{quote}&quot;</p>
      <p className="mt-8 text-xl font-black text-[#111111]">{name}</p>
    </article>
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
    <section className="bg-[#dddddd] px-4 py-18 sm:px-6 sm:py-22 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1160px]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-[#181818] sm:text-sm">
            Reviews
          </p>
          <h2 className="mx-auto mt-5 max-w-[760px] text-[2.35rem] font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-[3.2rem] lg:text-[4rem]">
            Customers love us.
          </h2>
        </div>

        <div className="mt-12 lg:mt-14">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent className="-ml-5">
              {reviews.map((review) => (
                <CarouselItem
                  key={`${review.name}-${review.quote}`}
                  className="pl-5 md:basis-1/2 xl:basis-1/3"
                >
                  <ReviewCard {...review} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-8 flex items-center justify-center gap-3">
            {Array.from({ length: snapCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to review group ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`h-4 w-4 rounded-full transition ${
                  selectedIndex === index ? 'bg-white' : 'bg-[#aaaaaa]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
