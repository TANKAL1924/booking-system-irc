import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';


interface Tier {
  id: number;
  name: string;
  price: number;
  list_details: string[];
  wa_number: string;
}

export default function MembershipTiersSection() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('tier').select('*').order('price').then(({ data }) => {
      if (data) setTiers(data as Tier[]);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 block">
            Membership Plans
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter leading-none text-white">
            CHOOSE YOUR <span className="gradient-text-brand">TIER</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.id} className="flex flex-col">
              <div
                className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full"
              >
                <div className="bg-white/5 p-6 sm:p-8 border-b border-white/5">
                  <h3 className="text-2xl font-black text-white mb-1">{tier.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-accent">RM {tier.price}</span>
                    <span className="text-white/40 text-sm mb-1">/month</span>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1 mb-8">
                    {(tier.list_details ?? []).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <Icon name="CheckCircleIcon" size={16} className="text-accent shrink-0 mt-0.5" variant="solid" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  {tier.wa_number && (
                    <a
                      href={`https://wa.me/${tier.wa_number}?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(tier.name)}%20membership.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-[#25D366]/20 transition-all"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.533 5.843L.054 23.25l5.548-1.456A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.933 0-3.742-.523-5.29-1.432l-.379-.225-3.293.864.88-3.21-.247-.393A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      Get This Plan
                    </a>
                  )}
                </div>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}