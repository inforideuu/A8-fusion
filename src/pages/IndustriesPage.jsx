import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { industriesData } from '../data/industriesData';
import { 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  GraduationCap, 
  Factory, 
  Hammer, 
  Truck, 
  Landmark, 
  Compass, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function IndustriesPage() {
  const iconMap = {
    'government': ShieldCheck,
    'healthcare': HeartPulse,
    'education': GraduationCap,
    'manufacturing': Factory,
    'construction': Hammer,
    'logistics': Truck,
    'banking-finance': Landmark,
    'real-estate': Compass,
    'energy-utilities': Zap
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Sector Engineering"
        title="Vertical Industry Platforms &amp; Compliance"
        subtitle="Custom-architected technology suites tailored to the unique regulatory mandates, throughput demands, and operational realities of global industries."
        bgImage="/industries.png"
        breadcrumbs={[
          { label: 'Industries' }
        ]}
        primaryCtaText="Discuss Industry Solutions"
        primaryCtaLink="/request-project"
        secondaryCtaText="Government &amp; Sovereign Tech"
        secondaryCtaLink="/government"
      />

      {/* Industries Directory */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industriesData.map((ind, i) => {
              const Icon = iconMap[ind.id] || Building2;
              const link = ind.id === 'government' ? '/government' : `/industries/${ind.slug}`;
              return (
                <div
                  key={ind.id}
                  className="bg-white rounded-2xl border border-slate-200 card-hover-industry-catalog flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={ind.image}
                        alt={`A8Fusion ${ind.title} Digital Transformation & Software Architecture`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur text-indigo-700 flex items-center justify-center shadow">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block">
                          Sector 0{i + 1}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-white drop-shadow">
                          {ind.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-xs font-serif italic text-slate-500">
                        "{ind.tagline}"
                      </p>

                      <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                        {ind.overview}
                      </p>

                      <div className="pt-2 space-y-1.5 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                          Domain Challenges Mitigated:
                        </span>
                        {ind.challenges.slice(0, 2).map((ch, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{ch}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 pt-4">
                    <Link
                      to={link}
                      className="text-xs font-bold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-800 flex items-center justify-between"
                    >
                      <span>Explore Sector Suite</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

