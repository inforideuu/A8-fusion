import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { servicesData } from '../data/servicesData';
import { 
  ArrowRight, 
  ShieldCheck, 
  Server, 
  Cpu, 
  Database, 
  Lock, 
  Workflow, 
  Boxes, 
  Layers, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function ServicesPage() {
  const iconMap = {
    'enterprise-software-development': Server,
    'artificial-intelligence': Cpu,
    'cloud-infrastructure': Database,
    'cybersecurity': Lock,
    'system-integration': Boxes,
    'digital-transformation': Workflow,
    'technology-consulting': Layers
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Enterprise Services"
        title="Mission-Critical Enterprise Technology Services"
        subtitle="End-to-end engineering, sovereign infrastructure advisory, and high-concurrency software development designed for international conglomerates and public institutions."
        bgImage="/services.png"
        breadcrumbs={[
          { label: 'Services' }
        ]}
        primaryCtaText="Discuss an Enterprise Project"
        primaryCtaLink="/request-project"
        secondaryCtaText="Explore Enterprise Solutions"
        secondaryCtaLink="/solutions"
      />

      {/* Services Directory Catalog */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {servicesData.map((service, index) => {
              const IconComp = iconMap[service.slug] || Server;
              return (
                <div
                  key={service.id}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-8 lg:p-10 border border-slate-200 card-hover-service-catalog grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group"
                >
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                          Practice Area 0{index + 1}
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm font-serif italic text-slate-700">
                      "{service.tagline}"
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {service.overview}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B172A] hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        <span>View Dedicated Specification</span>
                        <ArrowRight className="w-4 h-4 text-indigo-300" />
                      </Link>
                    </div>
                  </div>

                  {/* Capabilities Column */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between border-b border-slate-100 pb-2">
                      <span>Core Capabilities &amp; Architecture</span>
                      <span className="text-indigo-600">Enterprise Standard</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.capabilities.slice(0, 6).map((cap, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Stack:</span>
                      {service.technologies.slice(0, 5).map((tech, i) => (
                        <span key={i} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Flexible Governance
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              Enterprise Engagement Models
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Structured contractual agreements tailored for corporate compliance and government procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 card-hover-engagement-model">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Model 01</span>
              <h3 className="text-xl font-serif font-bold text-slate-900">Dedicated Engineering Squads</h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Full-stack autonomous squads composed of Principal Architects, Senior Engineers, and QA Leads dedicated exclusively to your multi-year digital roadmap.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Transparent sprint velocity &amp; burndown</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Direct Slack/Teams bridge with leads</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 card-hover-engagement-model">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">Model 02</span>
              <h3 className="text-xl font-serif font-bold text-slate-900">Milestone-Gated Deliveries</h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Fixed-price or cap-and-collar contracts aligned to verified milestone deliverables, architecture approvals, and rigorous user acceptance testing.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Zero budget ambiguity or hidden fees</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Strict contractual SLA guarantees</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 card-hover-engagement-model">
              <span className="text-xs font-mono font-bold text-purple-600 uppercase">Model 03</span>
              <h3 className="text-xl font-serif font-bold text-slate-900">Sovereign Architecture Advisory</h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                High-level CTO and security consulting for ministerial tenders, enterprise RFP formulation, and independent technical due diligence audits.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Objective vendor-agnostic evaluations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Direct board and steering committee reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

