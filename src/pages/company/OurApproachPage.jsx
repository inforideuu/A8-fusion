import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { 
  CheckCircle2, 
  FileCode, 
  ShieldCheck, 
  Workflow, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Server, 
  Lock, 
  FileText,
  BarChart3,
  RefreshCw,
  Search,
  Layers,
  Palette,
  Code2,
  Bug,
  Rocket,
  LifeBuoy
} from 'lucide-react';

export default function OurApproachPage() {
  const [selectedPhase, setSelectedPhase] = useState(1);

  const phases = [
    {
      num: 1,
      title: 'Discovery & Requirement Analysis',
      icon: Search,
      badge: 'Sprint 00',
      duration: 'Weeks 1 – 3',
      objective: 'Deconstruct complex institutional workflows, regulatory constraints, and domain boundaries before writing code.',
      activities: [
        'Stakeholder elicitation workshops with departmental directors and operational staff.',
        'Data taxonomy mapping, schema discovery, and volume throughput modeling.',
        'Sovereign regulatory compliance audit (GDPR, HIPAA, local data localization mandates).',
        'Drafting formal Functional Specification Document (FSD) and System Requirement Specification (SRS).'
      ],
      gateCriteria: 'Sign-off on SRS and Scope Boundary Matrix by Executive Steering Committee.'
    },
    {
      num: 2,
      title: 'Business & Technical Assessment',
      icon: Layers,
      badge: 'Feasibility',
      duration: 'Weeks 2 – 4',
      objective: 'Quantify existing technical debt, benchmark legacy database latencies, and establish feasibility parameters.',
      activities: [
        'Audit of legacy codebase, third-party dependencies, and proprietary mainframe connectors.',
        'Total Cost of Ownership (TCO) and FinOps cloud capacity projections.',
        'High-concurrency load modeling and network bandwidth baseline testing.',
        'Evaluating vendor lock-in risks and defining migration exit strategies.'
      ],
      gateCriteria: 'Execution of Technical Feasibility Report and Infrastructure CapEx/OpEx Budget.'
    },
    {
      num: 3,
      title: 'Enterprise Architecture & ADRs',
      icon: Server,
      badge: 'Blueprint',
      duration: 'Weeks 4 – 6',
      objective: 'Codify architectural invariants, distributed message topologies, and zero-trust security perimeters.',
      activities: [
        'Authoring formal Architecture Decision Records (ADRs) for database, cache, broker, and language selections.',
        'Designing micro-segmented VPC networking and geo-redundant disaster recovery failover paths.',
        'Constructing canonical data schemas and OpenAPI 3.1 contract specifications.',
        'Establishing cryptographic key management policies (HSM / KMS) and identity access boundaries.'
      ],
      gateCriteria: 'Architectural Review Board (ARB) formal approval of the Enterprise Architecture Document (EAD).'
    },
    {
      num: 4,
      title: 'UI/UX & Cognitive Workflows',
      icon: Palette,
      badge: 'Design Core',
      duration: 'Weeks 5 – 8',
      objective: 'Create intuitive, accessible, and fast enterprise interfaces that eliminate cognitive fatigue for daily operators.',
      activities: [
        'Interactive Figma design systems using high-contrast, accessible typography and enterprise component libraries.',
        'User journey simulations for high-stress operational scenarios (e.g. rapid patient intake or crisis dispatch).',
        'Accessibility compliance testing (WCAG 2.1 AA) and multi-device workstation responsiveness.',
        'Interactive prototype validation with actual end-user operators.'
      ],
      gateCriteria: 'Design System Freeze and 100% User Acceptance of key workflow interactive prototypes.'
    },
    {
      num: 5,
      title: 'Development & Core Engineering',
      icon: Code2,
      badge: 'Sprint Iterations',
      duration: 'Weeks 8 – 20+',
      objective: 'Test-driven software engineering organized into bi-weekly sprints with strict code governance.',
      activities: [
        'Isolated squad development utilizing GitFlow with mandatory two-peer senior engineer code reviews.',
        'Test-Driven Development (TDD) requiring minimum 85% unit test code coverage.',
        'Automated static code analysis (SonarQube) gating merge requests against security vulnerabilities.',
        'Continuous Integration (CI) producing containerized immutable artifacts tagged with git commit hashes.'
      ],
      gateCriteria: 'Successful bi-weekly sprint demos and clean automated security pipeline passes.'
    },
    {
      num: 6,
      title: 'Quality Assurance & Security Audits',
      icon: Bug,
      badge: 'Verification',
      duration: 'Weeks 18 – 24',
      objective: 'Subjecting the integrated platform to adversarial attack simulations, chaotic failure injection, and load testing.',
      activities: [
        'Automated regression suites covering end-to-end API workflows and UI automation.',
        'Stress and chaos testing (JMeter / k6) simulating 500% expected peak transaction volumes.',
        'Dynamic Application Security Testing (DAST) and independent third-party penetration testing.',
        'User Acceptance Testing (UAT) executed by designated client test squads.'
      ],
      gateCriteria: 'Zero critical or high-severity vulnerabilities and formal UAT sign-off certificates.'
    },
    {
      num: 7,
      title: 'Integration & Canary Deployment',
      icon: Rocket,
      badge: 'Go-Live',
      duration: 'Weeks 22 – 26',
      objective: 'Seamless production deployment with zero business downtime and automated rollback safety nets.',
      activities: [
        'Final data migration and automated checksum validation across source and destination databases.',
        'Blue-green or canary release routing 5% of live traffic initially, monitoring latency metrics.',
        'Activation of 24/7 hypercare bridge with senior architects and database administrators on standby.',
        'Comprehensive operational runbook handover to internal client infrastructure teams.'
      ],
      gateCriteria: '100% traffic migration with stable error budgets and successful post-deployment smoke tests.'
    },
    {
      num: 8,
      title: 'Maintenance & SRE Support',
      icon: LifeBuoy,
      badge: 'Continuous SLA',
      duration: 'Ongoing SLA',
      objective: 'Uncompromising 24/7/365 Site Reliability Engineering, proactive patching, and periodic architecture reviews.',
      activities: [
        '24/7 telemetry monitoring with automated pager escalation for SLA breaches (<15 min response for Tier 1).',
        'Monthly security patch cycles and third-party dependency vulnerability updates.',
        'Quarterly capacity planning and FinOps cloud spend optimization reviews.',
        'Semi-annual disaster recovery failover drill simulations.'
      ],
      gateCriteria: 'Monthly SLA compliance reports delivered to executive steering committee.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Engineering Governance"
        title="Our Enterprise Engineering Lifecycle"
        subtitle="A8Fusion enforces a rigorous 8-stage engineering framework designed to eliminate scope drift, security vulnerabilities, and architectural failures. Every milestone is guarded by auditable exit gates."
        bgImage="/aboutus.png"
        breadcrumbs={[
          { label: 'Company', link: '/company/about' },
          { label: 'Our Approach' }
        ]}
        primaryCtaText="Download Governance Specs"
        primaryCtaLink="/request-project"
        secondaryCtaText="Explore Core Services"
        secondaryCtaLink="/services"
      />

     

      {/* Deep-Dive Focused Phase Detail */}
      {(() => {
        const cur = phases.find(p => p.num === selectedPhase) || phases[0];
        const Icon = cur.icon;
        return (
          <section className="py-16 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-50 rounded-2xl p-8 lg:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start card-hover-approach-detail">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                          Stage 0{cur.num} // {cur.badge}
                        </span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs text-slate-500 font-mono">{cur.duration}</span>
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-slate-900">
                        {cur.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 font-sans leading-relaxed pt-2">
                    {cur.objective}
                  </p>

                  <div className="space-y-3 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Core Activities &amp; Methodology
                    </h4>
                    <ul className="space-y-2.5">
                      {cur.activities.map((act, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Gate Exit Criteria Card */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 card-hover-gate-criteria">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Mandatory Stage Exit Gate</span>
                  </div>

                  <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 font-sans leading-relaxed">
                    <strong>Quality Gate:</strong> {cur.gateCriteria}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Stage progression is blocked until all exit artifacts are certified in the corporate project tracking repository.
                  </p>

                  <div className="pt-2">
                    <Link
                      to="/request-project"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B172A] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <span>Initiate Stage 01 Discovery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}


       {/* Visual Lifecycle Flow Diagram Bar */}
      <section className="py-12 bg-[#0B172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              End-to-End Enterprise Process Flow
            </span>
            <h2 className="text-xl font-serif text-white mt-1">
              Deterministic 8-Stage Delivery Pipeline
            </h2>
          </div>

          {/* Interactive Flow Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {phases.map((phase) => {
              const Icon = phase.icon;
              const isActive = selectedPhase === phase.num;
              return (
                <button
                  key={phase.num}
                  type="button"
                  onClick={() => setSelectedPhase(phase.num)}
                  className={`p-3 rounded-xl text-center transition-all border relative flex flex-col items-center ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                    Stage 0{phase.num}
                  </span>
                  <span className="text-xs font-bold mt-0.5 line-clamp-1">{phase.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive All-Phases Narrative Table */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Full Spectrum Execution
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              The 8 Pillars of Enterprise Delivery
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Review our complete end-to-end framework governing technical specifications, code verification, security, and continuous uptime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phases.map((p) => (
              <div key={p.num} className="bg-white rounded-xl p-6 border border-slate-200 space-y-3 card-hover-stage-pillar">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-mono font-bold text-indigo-600">STAGE 0{p.num}</span>
                  <span className="text-xs font-mono text-slate-500">{p.duration}</span>
                </div>
                <h4 className="text-lg font-serif font-bold text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{p.objective}</p>
                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  <strong>Exit Deliverable:</strong> {p.gateCriteria}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Documentation & QA Standards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 card-hover-qa-spec">
              <FileCode className="w-6 h-6 text-indigo-600" />
              <h3 className="font-serif font-bold text-slate-900 text-lg">Milestone Documentation</h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                No code is merged into production without accompanying OpenAPI contracts, database migration scripts, and architecture decision logs.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 card-hover-qa-spec">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <h3 className="font-serif font-bold text-slate-900 text-lg">Continuous Security Testing</h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Automated static and dynamic vulnerability analysis prevents secret leaks, SQL injection, and outdated dependency vulnerabilities.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3 card-hover-qa-spec">
              <RefreshCw className="w-6 h-6 text-purple-600" />
              <h3 className="font-serif font-bold text-slate-900 text-lg">Transparent Handover</h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Our team conducts structured technical training sessions and hands over complete CI/CD configuration scripts, ensuring zero vendor hostage scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

