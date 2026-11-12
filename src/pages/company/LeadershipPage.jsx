import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Quote, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { leadershipData, governancePrinciples } from '../../data/leadershipData';

export default function LeadershipPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Executive Governance"
        title="Leadership & Corporate Governance"
        subtitle="Our leadership team unites deep academic computer science credentials, decades of sovereign infrastructure advisory, and proven track records directing multi-national enterprise transformations."
        bgImage="/aboutus.png"
        breadcrumbs={[
          { label: 'Company', link: '/company/about' },
          { label: 'Leadership' }
        ]}
        primaryCtaText="Contact Executive Office"
        primaryCtaLink="/contact"
        secondaryCtaText="Our Engineering Approach"
        secondaryCtaLink="/company/our-approach"
      />

      {/* 1. Leadership Introduction */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Board Stewardship
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              Steered by Seasoned Systems Architects &amp; Sovereign Advisors
            </h2>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              At A8Fusion, our executive directors remain active engineers and architects. We do not manage from detached ivory towers; our senior leadership personally reviews technical designs, stress-tests security architectures, and engages directly with client steering committees.
            </p>
          </div>
        </div>
      </section>

      {/* 2, 3, 4. Leadership Profiles */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {leadershipData.map((leader, index) => (
              <div
                key={leader.id}
                className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center card-hover-executive"
              >
                {/* Profile Photo & Vital Stats */}
                <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                  <div className="relative">
                    <img
                      src={leader.image}
                      alt={`${leader.name} - ${leader.role} at A8Fusion`}
                      className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
                    />
                    <div className="absolute -bottom-3 right-2 bg-indigo-600 text-white p-2 rounded-lg shadow">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-wide">
                      {leader.designation}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      {leader.department}
                    </span>
                  </div>

                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <span className="w-4 h-4 rounded bg-[#0077b5] text-white flex items-center justify-center text-[10px] font-bold">in</span>
                    <span>Verified Executive Profile</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>

                {/* Detailed Biography, Experience & Philosophy */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Experience & Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{leader.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <GraduationCap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>{leader.education}</span>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Executive Background
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">
                      {leader.bio}
                    </p>
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Key Responsibilities &amp; Focus
                    </h4>
                    <p className="text-xs text-slate-600 font-sans">
                      {leader.focus}
                    </p>
                  </div>

                  {/* Leadership Philosophy Quote */}
                  <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-indigo-600 text-slate-700 text-xs italic space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-semibold not-italic font-serif">
                      <Quote className="w-3.5 h-3.5" />
                      <span>Leadership Philosophy</span>
                    </div>
                    <p>"{leader.philosophy}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Corporate Governance Approach */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Institutional Accountability
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Corporate Governance &amp; Ethics
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Our governance model ensures total auditability, statutory compliance, and transparent fiduciary stewardship for every client engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 card-hover-ethics">
              <h3 className="font-serif font-bold text-slate-900 text-xl">
                Independent Steering Committees
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                For major government infrastructure and enterprise platform deployments, A8Fusion establishes an independent project steering committee composed of client stakeholders, principal architects, and sovereign security leads. Meeting monthly, this committee governs scope, evaluates risk registers, and signs off on formal milestone deliverables.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Formal Architecture Decision Records (ADRs) signed off by both parties</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quarterly external third-party vulnerability penetration audits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Uncompromised source code escrow protection options</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 card-hover-ethics">
              <h3 className="font-serif font-bold text-slate-900 text-xl">
                Anti-Bribery, Sanctions &amp; Sovereign Compliance
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                A8Fusion operates under strict zero-tolerance policies regarding bribery, corrupt practices, or illegal software licensing. We comply with all international sanctions, export control mandates, and regional data localization regulations across APAC, the GCC, and Europe.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strict anti-corruption and fair competition policy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Whistleblower protection and anonymous reporting channel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Regular governance reviews managed through institutional oversight committees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact CTA */}
      <section className="py-20 bg-[#0B172A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
            Engage Directly With Executive Leadership
          </h2>
          <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            For institutional partnerships, strategic public-sector tenders, or executive technology evaluations, reach our corporate boardroom directly.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>Schedule Executive Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
