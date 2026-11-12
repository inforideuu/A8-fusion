import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import GlobalGlobe3D from '../components/common/GlobalGlobe3D';
import { 
  Globe2, 
  ShieldCheck, 
  Building2, 
  Users2, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ExternalLink,
  MapPin
} from 'lucide-react';

export default function GlobalBusinessPage() {
  const targetMarkets = [
    { 
      country: 'Singapore', 
      region: 'Asia-Pacific HQ Hub', 
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      focus: 'Financial technology, maritime logistics cores, high-concurrency cloud engineering, and ASEAN enterprise integration.' 
    },
    { 
      country: 'United Arab Emirates', 
      region: 'Middle East & GCC', 
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      focus: 'Sovereign cloud infrastructure, smart city municipal platforms, digital citizen portals, and government advisory.' 
    },
    { 
      country: 'United Kingdom', 
      region: 'EMEA & Western Europe', 
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      focus: 'Enterprise ERP modernization, financial compliance, cross-border system integration, and GDPR data governance.' 
    },
    { 
      country: 'Malaysia', 
      region: 'Southeast Asia Delivery', 
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
      focus: 'Industrial IoT shop-floor systems, multi-branch supply chain integration, and enterprise software engineering squads.' 
    },
    { 
      country: 'European Union', 
      region: 'Continental Europe', 
      image: 'https://images.unsplash.com/photo-1546726747-421c6d69c929?auto=format&fit=crop&w=800&q=80',
      focus: 'Sovereign AI implementations, private cloud migrations, and institutional healthcare technology frameworks.' 
    },
    { 
      country: 'Selected International Markets', 
      region: 'Global Institutional', 
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      focus: 'Strategic systems partnerships, global technology outsourcing contracts, and capital infrastructure software.' 
    }
  ];

  const deliveryCapabilities = [
    {
      title: 'Dedicated Engineering Squads',
      desc: 'Cross-functional engineering pods (Lead Architect, 4 Senior Engineers, DevOps Lead, QA Specialist) assigned exclusively to client portfolios.'
    },
    {
      title: 'Cross-Border System Integration',
      desc: 'Synchronizing multi-currency ledgers, disparate regional subsidiaries, and cross-border regulatory reporting pipelines in real-time.'
    },
    {
      title: 'Enterprise Software Contracts',
      desc: 'Formal master services agreements (MSAs) featuring transparent milestone definitions, performance SLAs, and source code protection.'
    },
    {
      title: 'International Partner Ecosystem',
      desc: 'Structured co-delivery consortiums with accredited local system integrators, compliance auditors, and sovereign cloud infrastructure providers.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="International Enterprise Practice"
        title="Global Business &amp; Technology Partnerships"
        subtitle="Bridging international corporate standards with sovereign regulatory compliance. We architect, deliver, and govern enterprise technology for multinationals and institutional partners across major global hubs."
        bgImage="/global.png"
        breadcrumbs={[
          { label: 'Global Business' }
        ]}
        primaryCtaText="Explore Strategic Partnerships"
        primaryCtaLink="/partnerships"
        secondaryCtaText="Enterprise Project Scope"
        secondaryCtaLink="/request-project"
      />

      {/* 1. Global Business Introduction */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: International Positioning Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                International Positioning
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                Engineering Discipline Without Geographical Boundaries
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                As multinational corporations expand across Southeast Asia, the Middle East, and Europe, they face severe architectural fragmentation: divergent statutory reporting rules, varying data residency mandates, and incompatible regional software silos.
              </p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                A8Fusion acts as the central engineering backbone. We unify global technology roadmaps while respecting domestic sovereignty laws, providing international enterprises with the architectural predictability required for sustainable global scale.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
                <div className="text-indigo-700 font-bold">ETHICAL DISCLOSURE PRINCIPLE:</div>
                <p>
                  A8Fusion lists only verified operational presence and authorized delivery hubs in Singapore, the UAE, and the UK. We reject artificial international representations.
                </p>
              </div>
            </div>

            {/* Right Column: Responsive Global Business Hub Architecture */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-100 w-full h-[380px] sm:h-[440px] lg:h-[480px] relative group">
                <img
                  src="/global_business.jpg"
                  alt="A8Fusion International Financial & Engineering Infrastructure"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />
                
                {/* Floating International Operations Ribbon */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between text-white backdrop-blur-md bg-slate-950/60 p-3.5 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center text-white flex-shrink-0">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold leading-tight">
                        Cross-Border Delivery Grid
                      </div>
                      <div className="text-xs font-serif font-bold text-white leading-tight mt-0.5">
                        Singapore · United Arab Emirates · United Kingdom
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-semibold hidden sm:inline">
                    FOLLOW-THE-SUN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Border Delivery Model (3 Columns) */}
          <div className="mt-12 pt-10 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-delivery-model">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <Layers className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
                  <span>24/7 SRE FOLLOW-THE-SUN</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Continuous engineering and Site Reliability squads operating across overlapping Asian, Middle Eastern, and European business hours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-delivery-model">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
                  <span>REGULATORY ALIGNMENT</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Native compliance with GDPR (Europe), PDPA (Singapore &amp; Malaysia), and national cloud sovereignty statutes (UAE).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs card-hover-delivery-model">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <Briefcase className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
                  <span>STANDARDIZED MSAs</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Structured under international arbitration frameworks (SIAC / LCIA) with transparent SLAs and total IP protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global 3D Mesh Infrastructure Section */}
      <section className="py-20 bg-[#060B18] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
              Real-Time Sovereign Topology
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
              Verified International Delivery Mesh
            </h2>
            <p className="text-sm text-slate-300 font-sans">
              Interactive 3D representation of our cross-border engineering corridors and synchronized sovereign data centers.
            </p>
          </div>
          <GlobalGlobe3D />
        </div>
      </section>

      {/* 2 to 7. Delivery Capabilities & Dedicated Squads */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Global Operations
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              International Delivery Capabilities
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Predictable, milestone-gated software engineering orchestrated across distributed international squads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryCapabilities.map((cap, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-global-cap">
                <span className="text-xs font-mono font-bold text-indigo-600">CAPABILITY 0{i + 1}</span>
                <h3 className="text-base font-serif font-bold text-slate-900">{cap.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Regional Market Focus */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Strategic Jurisdictions
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Regional Market Focus &amp; Operations
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Targeted technology engineering aligned with regional industrial strengths and statutory frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetMarkets.map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden card-hover-jurisdiction group flex flex-col justify-between">
                <div>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={m.image}
                      alt={`A8Fusion ${m.country} Sovereign Technology Delivery Hub - ${m.region}`}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-semibold block">
                        {m.region}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white drop-shadow-sm">
                        {m.country}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {m.focus}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-indigo-600 font-bold uppercase">
                  <span>Verified Jurisdiction</span>
                  <span className="text-slate-400">Node 0{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. International Enquiry CTA */}
      <section className="py-20 bg-[#0B172A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
            Establish a Cross-Border Technology Engagement
          </h2>
          <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            Connect with our international engagement directors to discuss multi-country deployments, dedicated engineering teams, or strategic partnership consortiums.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/request-project"
              className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Submit International Project Scope</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/partnerships"
              className="px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Apply as Strategic Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

