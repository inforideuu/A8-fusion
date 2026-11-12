import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Cpu, 
  Server, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Award 
} from 'lucide-react';
import { leadershipData, governancePrinciples } from '../../data/leadershipData';

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Corporate Identity"
        title="Engineering Excellence for Global Enterprises & Sovereign Institutions"
        subtitle="A8Fusion was established with a single foundational charter: to design, build, and maintain mission-critical software systems capable of operating under intense regulatory scrutiny, extreme concurrency, and generational scale."
        bgImage="/aboutus.png"
        breadcrumbs={[
          { label: 'Company', link: '/company/about' },
          { label: 'About Us' }
        ]}
        primaryCtaText="Discuss an Enterprise Project"
        primaryCtaLink="/request-project"
        secondaryCtaText="Explore Leadership"
        secondaryCtaLink="/company/leadership"
      />

      {/* 2. Company Introduction */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Corporate Foundations
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                An Independent Enterprise Technology Corporation
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                A8Fusion operates with its own independent corporate identity, engineering leadership, and dedicated product portfolio. We do not provide generic agency services. Instead, we architect sovereign digital infrastructure, private artificial intelligence platforms, and high-concurrency enterprise resource planning systems.
              </p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                Our engineering practices are intentionally designed to counter the common failure modes of large-scale IT projects: opaque codebases, inflated vendor licensing, and fragile architectures that collapse under production workloads.
              </p>

              <div className="pt-2 flex items-center gap-6">
                <div>
                  <div className="text-2xl font-serif font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-mono">Independent Architecture</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <div className="text-2xl font-serif font-bold text-slate-900">Zero</div>
                  <div className="text-xs text-slate-500 font-mono">Proprietary Lock-in</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <div className="text-2xl font-serif font-bold text-slate-900">Multi-Region</div>
                  <div className="text-xs text-slate-500 font-mono">Delivery Governance</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-900 w-full h-[380px] sm:h-[440px] lg:h-[480px] relative group">
                <img
                  src="/office_interior.jpg"
                  alt="A8Fusion Corporate Engineering Headquarters - Sovereign Enterprise Software Architecture"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Vision and Mission */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Corporate Direction
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Vision &amp; Strategic Mission
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              The foundational charters defining our architectural sovereignty and commitment to mission-critical engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden group card-hover-vision flex flex-col justify-between">
              {/* Top Accent Gradient Wash & Ambient Watermark */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:from-indigo-200/40 transition-colors duration-500"></div>

              <div className="relative z-10 space-y-6">
                {/* Header Meta Row with Icon & Charter Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200/80 text-indigo-700 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-indigo-400 transition-all duration-300">
                    <Compass className="w-7 h-7 text-indigo-600 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
                    CHARTER 01
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase font-bold tracking-widest text-indigo-600 block">
                    Our Strategic Vision
                  </span>
                  <div className="pl-4 border-l-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors duration-300">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug group-hover:text-indigo-950 transition-colors">
                      To become a globally recognised technology company delivering intelligent, scalable and impactful digital solutions.
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-2">
                  We envision a future where public sector agencies and multinational enterprises possess total sovereignty over their computing infrastructure, free from monopolistic vendor traps and opaque algorithmic black boxes.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden group card-hover-mission flex flex-col justify-between">
              {/* Top Accent Gradient Wash & Ambient Watermark */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:from-blue-200/40 transition-colors duration-500"></div>

              <div className="relative z-10 space-y-6">
                {/* Header Meta Row with Icon & Charter Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200/80 text-blue-700 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-blue-400 transition-all duration-300">
                    <Target className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs">
                    CHARTER 02
                  </span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase font-bold tracking-widest text-blue-600 block">
                    Our Engineering Mission
                  </span>
                  <div className="pl-4 border-l-2 border-blue-500/30 group-hover:border-blue-500 transition-colors duration-300">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug group-hover:text-blue-950 transition-colors">
                      To engineer advanced technology platforms that solve complex organisational challenges and enable sustainable digital transformation.
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-2">
                  We exist to translate intricate institutional workflows, regulatory constraints, and high-frequency data streams into stable, secure, and intuitive digital backbones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. Values and Technology Philosophy */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Technology Philosophy &amp; Corporate Values
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Our engineering philosophy dictates that elegance is the byproduct of structural simplicity, rigorous testing, and ethical transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {governancePrinciples.map((prin, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 card-hover-philosophy">
                <span className="text-xs font-mono font-bold text-indigo-600">PRINCIPLE 0{i+1}</span>
                <h4 className="text-base font-serif font-bold text-slate-900">{prin.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{prin.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 & 8. Engineering Approach & Commitment to Clients */}
      <section className="py-20 bg-[#0B172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
                Engineering Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
                Our Commitment to Enterprise Clients
              </h2>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                When an enterprise or sovereign entity entrusts A8Fusion with its technology platform, we honor that mandate with unwavering fiduciary discipline.
              </p>
              <div className="space-y-3 text-xs text-slate-300 font-sans">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Technical Ambiguity:</strong> Formal schema definitions, API contracts, and milestone exit criteria established prior to sprint execution.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Complete IP Ownership:</strong> 100% of custom application code, build scripts, and configuration repositories belong unconditionally to the client.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Strict Confidentiality:</strong> All engineers operate under comprehensive non-disclosure agreements with isolated VPN enclaves and cleanroom development workstations.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/company/our-approach"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300"
                >
                  <span>Explore Our 8-Stage Project Lifecycle</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4 card-hover-about-governance">
              <h3 className="font-serif font-bold text-white text-lg">Leadership Oversight</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Every enterprise deployment is sponsored by an executive board member, ensuring direct escalation paths and board-level accountability throughout the engagement lifecycle.
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs font-mono text-indigo-400">EXECUTIVE_STEERING_ACTIVE</span>
                <Link to="/company/leadership" className="text-xs text-white font-bold hover:text-indigo-400 flex items-center gap-1">
                  <span>Meet the Executive Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 & 10. Leadership Intro & Contact CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
            Initiate Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
            Let's Discuss Your Institutional Objectives
          </h2>
          <p className="text-sm text-slate-600 font-sans max-w-2xl mx-auto">
            Schedule a confidential technical discovery session with our senior systems architects and international delivery leads.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/request-project"
              className="px-7 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              Request Project Proposal
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Corporate Contact Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

