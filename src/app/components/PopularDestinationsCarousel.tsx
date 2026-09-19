'use client';

import React from 'react';
import { Carousel, Card } from '@/components/ui/specials-linear-carousel';

export interface PopularDestinationsCarouselProps {
  destinations: Array<{
    id: string;
    slug?: string;
    name: string;
    territoryName: string;
    type: string;
    image: string;
    shortDescription?: string;
  }>;
}

export default function PopularDestinationsCarousel({ destinations }: PopularDestinationsCarouselProps) {
  const cards = destinations.map((dest, index) => (
    <Card
      key={dest.id || dest.name}
      card={{
        src: dest.image,
        title: dest.name,
        category: `${dest.territoryName} • ${dest.type}`,
        content: <p>{dest.shortDescription}</p>,
        href: `/destinations/${dest.slug || dest.id}`,
      }}
      index={index}
    />
  ));

  return (
    <div className="w-full">
      <Carousel items={cards} autoplay={true} autoplayInterval={3400} />
    </div>
  );
}
