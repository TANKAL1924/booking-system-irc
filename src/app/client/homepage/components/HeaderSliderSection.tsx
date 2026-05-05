import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import { supabase } from '@/lib/supabase';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

interface HeaderItem {
  id: number;
  link: string;
}

export default function HeaderSliderSection() {
  const [items, setItems] = useState<HeaderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('header')
      .select('id, link')
      .not('link', 'is', null)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as HeaderItem[]);
        setLoading(false);
      });
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="pt-28 pb-16 px-4">
      <Swiper
        modules={[EffectCoverflow, Autoplay, Pagination]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={items.length > 2}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 40,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        className="w-full"
        style={
          {
            '--swiper-pagination-color': 'var(--color-primary, #e53e3e)',
            '--swiper-pagination-bullet-inactive-color': 'rgba(255,255,255,0.3)',
            '--swiper-pagination-bullet-inactive-opacity': '1',
            paddingBottom: '40px',
          } as React.CSSProperties
        }
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} style={{ width: '60%', maxWidth: '780px' }}>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={item.link}
                alt="Header"
                className="w-full object-cover aspect-video"
                draggable={false}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
