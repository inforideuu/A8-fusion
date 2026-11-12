import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { servicesData } from '../data/servicesData';
import { solutionsData } from '../data/solutionsData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Layers, 
  Cpu, 
  Server, 
  HelpCircle,
  ChevronRight,
  Terminal,
  FileCheck
} from 'lucide-react';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = servicesData.find(s => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Related solutions
  const relatedSolutions = solutionsData.slice(0, 3);

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Enterprise Service Practice"
        title={service.title}
        subtitle={service.heroSubtitle}
        bgImage="/services.png"
        breadcrumbs={[
          { label: 'Services', link: '/services' },
          { label: service.title }
        ]}
        primaryCtaText="Discuss This Practice Area"
        primaryCtaLink={`/request-project?service=${service.slug}`}
        secondaryCtaText="All Services Overview"
        secondaryCtaLink="/services"
      />

      {/* Overview & Key Capabilities */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Engineering Scope
              </span>
              <h2 className="text-3xl font-serif font-normal text-slate-900 leading-tight">
                Architectural Integrity for Mission-Critical Needs
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              
              <p className="text-sm font-serif italic text-slate-700">
                "{service.tagline}"
              </p>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                {service.overview}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-tech-ecosystem">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                  Primary Technology Ecosystem
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.technologies.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-mono bg-white text-slate-800 px-2.5 py-1 rounded border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Capabilities Grid */}
            <div className="lg:col-span-7 bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Key Technical Capabilities
                </h3>
                <span className="text-xs font-mono text-indigo-600">VERIFIED SPEC</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80 card-hover-capability-pill">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Challenges We Solve */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Problem Domain
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              Business Challenges We Mitigate
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Addressing systemic bottlenecks, regulatory hurdles, and architectural vulnerabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.challenges.map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-challenge">
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Engineering Approach for this Service */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Engineering Execution
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              Our Implementation Roadmap
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              A structured lifecycle delivering predictable results and zero unexpected downtime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.approach.map((st) => (
              <div key={st.step} className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative card-hover-roadmap-step">
                <span className="text-2xl font-serif font-bold text-indigo-600 block">{st.step}</span>
                <h4 className="text-base font-serif font-bold text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served & Related Platforms */}
      <section className="py-20 bg-[#0B172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
                Domain Applicability
              </span>
              <h2 className="text-3xl font-serif font-normal text-white">
                Sectors Leveraging This Practice
              </h2>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                Our practice is tuned to vertical statutory guidelines and throughput realities across international markets.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {service.industries.map((ind, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2 card-hover-sector-pill">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900/90 p-8 rounded-2xl border border-slate-800 space-y-5">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                Related Enterprise Software Suites
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Pre-Built Platform Modules Available
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Accelerate implementation by pairing custom development with our audited platform modules.
              </p>
              <div className="space-y-3">
                {relatedSolutions.map(sol => (
                  <Link
                    key={sol.id}
                    to={`/solutions/${sol.slug}`}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 card-hover-suite-link flex items-center justify-between text-xs text-slate-200 group transition-all"
                  >
                    <div>
                      <span className="font-serif font-bold text-white group-hover:text-indigo-400">{sol.title}</span>
                      <span className="text-[10px] text-slate-500 block">{sol.tagline}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Architectural Clarity
              </span>
              <h2 className="text-3xl font-serif font-normal text-slate-900">
                Frequently Addressed Technical Questions
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-faq">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <h4 className="text-base font-serif font-bold text-slate-900">{faq.q}</h4>
                  </div>
                  <p className="text-xs text-slate-600 pl-8 leading-relaxed font-sans">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Project Enquiry CTA */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Initiate Architecture Discovery for {service.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto leading-relaxed">
            Connect with our Principal Systems Architects to evaluate technical requirements, security boundaries, and delivery timelines.
          </p>
          <div className="pt-2">
            <Link
              to={`/request-project?service=${service.slug}`}
              className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Submit Enterprise Project Scope</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

