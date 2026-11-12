import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useEnquiry } from '../context/EnquiryContext';
import { 
  ShieldCheck, 
  Building2, 
  Landmark, 
  Users, 
  Workflow, 
  Database, 
  Lock, 
  Cpu, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle,
  Scale,
  GitBranch,
  GraduationCap
} from 'lucide-react';

export default function GovernmentPage() {
  const { submitEnquiry } = useEnquiry();
  const [submittedRef, setSubmittedRef] = useState(null);
  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    country: '',
    projectCategory: 'E-Governance & Digital Citizen Services',
    description: '',
    estimatedBudget: '',
    tenderReference: '',
    consent: false
  });

  const categories = [
    'E-Governance & Digital Citizen Services',
    'Smart City IoT & Municipal Platforms',
    'Public Administration & Registry Core',
    'Sovereign Cloud & In-Country Data Residency',
    'Public Infrastructure & Utility Telemetry',
    'Government Tender Architecture Advisory'
  ];

  const govPillars = [
    { title: 'E-Governance Solutions', desc: 'Single-Sign-On citizen credentials, digital identity verification, and multi-departmental service integration.' },
    { title: 'Smart City Platforms', desc: 'Municipal telemetry aggregating street lighting, water pressure, smart meters, and traffic dispatch.' },
    { title: 'Public Administration Systems', desc: 'Secure civil registry databases, land titles, vital statistics, and judicial filing archives.' },
    { title: 'Digital Citizen Services', desc: 'Intuitive web and mobile portals for business permits, licenses, birth registrations, and tax filing.' },
    { title: 'Government Workflow Automation', desc: 'Automating multi-tier ministerial approval hierarchies with tamper-evident cryptographic logs.' },
    { title: 'Public Infrastructure Management', desc: 'Asset lifecycle tracking for public transit networks, bridges, reservoirs, and public hospitals.' },
    { title: 'Data Analytics & Dashboards', desc: 'Real-time cabinet decision boards tracking public budget expenditures, inflation indices, and health data.' },
    { title: 'System Integration & Mainframe Bridges', desc: 'Secure middleware connecting legacy departmental mainframes with modern cloud citizen portals.' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm official government authorization and consent.');
      return;
    }
    const ref = submitEnquiry({
      ...formData,
      type: 'Government'
    });
    setSubmittedRef(ref);
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Sovereign Digital Infrastructure"
        title="Government &amp; Public Sector Technology Solutions"
        subtitle="Engineering resilient e-governance backbones, sovereign data platforms, and secure digital citizen services designed to withstand state-level threat vectors and adhere strictly to domestic data sovereignty laws."
        bgImage="/government.png"
        breadcrumbs={[
          { label: 'Government & Public Sector' }
        ]}
        primaryCtaText="Submit Official Tender / RFP Enquiry"
        primaryCtaLink="#government-tender-form"
        secondaryCtaText="Review Governance Philosophy"
        secondaryCtaLink="/company/our-approach"
      />

      {/* 1. Sovereign Government Technology Introduction */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Sovereign Mandate Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                Sovereign Mandate
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                Architectural Independence for Public Sector Institutions
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                National digital sovereignty is the prerequisite for civic trust. Modern government departments cannot risk their critical citizen registries or municipal billing cores being held hostage by foreign SaaS terms of service or offshore data centers.
              </p>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                A8Fusion designs sovereign technology platforms intended for on-premise government cloud enclaves or strictly designated domestic data regions. Every line of application code, database schema, and cryptographic key remains entirely under sovereign control.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>TRANSPARENT PROCUREMENT COMPLIANCE NOTICE</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  A8Fusion operates strictly as an independent enterprise technology and systems engineering corporation. In accordance with honest disclosure standards, we participate in public tenders on technical merit and do not claim unverified government empanelment or artificial vendor preferences.
                </p>
              </div>
            </div>

            {/* Right Column: Responsive Government Building Frame */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-100 w-full h-[380px] sm:h-[440px] lg:h-[480px] relative group">
                <img
                  src="/government_building.jpg"
                  alt="A8Fusion Sovereign Public Sector Infrastructure &amp; Civic Government Systems"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />
                
                {/* Floating Civic Institution Ribbon */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between text-white backdrop-blur-md bg-slate-950/60 p-3.5 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center text-white flex-shrink-0">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold leading-tight">
                        Sovereign Civic Infrastructure
                      </div>
                      <div className="text-xs font-serif font-bold text-white leading-tight mt-0.5">
                        Civil Administration &amp; Institutional Governance
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-semibold hidden sm:inline">
                    AIR-GAPPED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sovereign Core Policy Framework (3 Columns) */}
          <div className="mt-12 pt-10 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-white border border-slate-200/90 space-y-2 shadow-xs card-premium hover:border-indigo-300">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>DOMESTIC DATA RESIDENCY</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  100% of citizen Personally Identifiable Information (PII) resides within authorized domestic state borders.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200/90 space-y-2 shadow-xs card-premium hover:border-indigo-300">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>HSM KEY GOVERNANCE</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Master cryptographic keys are owned exclusively by state authorities with hardware multi-custody quorum.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200/90 space-y-2 shadow-xs card-premium hover:border-indigo-300">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>CODE ESCROW &amp; AUDIT</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Full source code escrow access and complete architectural documentation delivered with every system deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 to 9. The 8 Core Government Technology Solutions */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Civic Capability Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Government Technology Capabilities
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Eight integrated solution domains engineered for municipal councils, state departments, and federal ministries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {govPillars.map((pillar, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-premium">
                <span className="text-xs font-mono font-bold text-indigo-600">CAPABILITY 0{i + 1}</span>
                <h3 className="text-base font-serif font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Government Project Implementation Approach */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Public Procurement Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Civic Project Implementation Methodology
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Government contracts demand transparency, formal milestone certifications, and independent quality oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phase A */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm card-hover-civic-methodology flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-indigo-100/35 via-slate-50/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-indigo-200/45 group-hover:scale-125 transition-all duration-500" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="civic-icon-emblem w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-slate-200/80 text-indigo-700 flex items-center justify-center shadow-xs transition-all duration-300">
                    <Scale className="w-6 h-6" />
                  </div>
                  <span className="civic-phase-badge px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 shadow-xs transition-all duration-300">
                    PHASE A
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                    Legislative &amp; Privacy Mapping
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed pt-2">
                    Auditing statutory mandates, public records acts, and accessibility standards prior to writing technical specifications.
                  </p>
                </div>
              </div>

              
            </div>

            {/* Phase B */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm card-hover-civic-methodology flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-blue-100/35 via-slate-50/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-blue-200/45 group-hover:scale-125 transition-all duration-500" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="civic-icon-emblem w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-200/80 text-blue-700 flex items-center justify-center shadow-xs transition-all duration-300">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <span className="civic-phase-badge px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-blue-50/90 text-blue-700 border border-blue-200/80 shadow-xs transition-all duration-300">
                    PHASE B
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                    Incremental Strangler Migration
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed pt-2">
                    Decoupling functions from legacy mainframes without disrupting active citizen operations or causing tax service downtime.
                  </p>
                </div>
              </div>

              
            </div>

            {/* Phase C */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm card-hover-civic-methodology flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-emerald-100/35 via-slate-50/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-emerald-200/45 group-hover:scale-125 transition-all duration-500" />

              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="civic-icon-emblem w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-slate-200/80 text-emerald-700 flex items-center justify-center shadow-xs transition-all duration-300">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="civic-phase-badge px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-emerald-50/90 text-emerald-700 border border-emerald-200/80 shadow-xs transition-all duration-300">
                    PHASE C
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-serif font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">
                    Auditable Knowledge Handover
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 font-sans leading-relaxed pt-2">
                    Structured technical upskilling of civil service engineering teams, ensuring long-term sovereign autonomy over the deployed platform.
                  </p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* 11 & 12. DEDICATED GOVERNMENT ENQUIRY & TENDER FORM */}
      <section id="government-tender-form" className="py-20 bg-[#0B172A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-xs font-mono text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>OFFICIAL PUBLIC SECTOR PORTAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
              Procurement &amp; Tender Enquiries
            </h2>
            <p className="text-sm text-slate-300 font-sans max-w-2xl mx-auto">
              Government departments, municipal authorities, and sovereign procurement officers may submit formal Expressions of Interest (EOI), RFP documents, or technical discovery requests directly to our sovereign practice team.
            </p>
          </div>

          {submittedRef ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/50 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Official Enquiry Registered Successfully
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto font-sans">
                Your submission has been cataloged under sovereign protocol. Our senior public sector lead and compliance director have been alerted.
              </p>
              <div className="inline-block p-4 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono text-sm font-bold">
                Tender Reference ID: {submittedRef}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                An acknowledgment packet has been dispatched to {formData.email}.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="px-6 py-2.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 uppercase tracking-wider"
                >
                  Submit Another Government Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-900/90 rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Department or Organisation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ministry of Transport & Civil Registry"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Director Hamad Al-Fahim"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Official Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Head of Sovereign Systems"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Official Government Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. official.name@dept.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +971 4 800 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Jurisdiction / Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Arab Emirates, Singapore, United Kingdom"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Project Category *
                  </label>
                  <select
                    value={formData.projectCategory}
                    onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Estimated Project Budget (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $1M – $5M USD"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Tender Reference / RFP Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TND-2026-GOV-098"
                    value={formData.tenderReference}
                    onChange={(e) => setFormData({ ...formData, tenderReference: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Project Description &amp; Scope *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detail the civic requirements, desired in-country residency bounds, timeline, and current technical systems..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Simulated Tender Document Upload Field */}
                <div className="sm:col-span-2 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center">
                  <Upload className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                  <span className="text-xs text-slate-300 font-semibold block">Attach Official RFP or Scope Documentation (Simulated)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Supported formats: PDF, DOCX, ZIP (Encrypted transfer)</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                    />
                    <span>
                      I hereby certify that I am an authorized representative of the designated public authority or government department, and request formal communication regarding this sovereign inquiry under corporate confidentiality standards.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-500 font-mono">
                  All government enquiries are audited and encrypted.
                </span>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <span>Submit Sovereign Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

