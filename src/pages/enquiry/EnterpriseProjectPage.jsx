import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { useEnquiry } from '../../context/EnquiryContext';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Lock,
  Building2,
  Calendar,
  Coins,
  Clock,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Layers,
  Scale
} from 'lucide-react';

export default function EnterpriseProjectPage() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const preselectedSolution = searchParams.get('solution') || '';
  const preselectedIndustry = searchParams.get('industry') || '';

  const { submitEnquiry } = useEnquiry();
  const [submittedRef, setSubmittedRef] = useState(null);

  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    country: '',
    industry: preselectedIndustry || 'Banking & Financial Services',
    projectCategory: preselectedService || preselectedSolution || 'Enterprise Software Development',
    description: '',
    timeline: '3 – 6 Months',
    budgetRange: '$500K – $1M USD',
    consent: false
  });

  const industries = [
    'Banking & Financial Services',
    'Healthcare & Life Sciences',
    'Manufacturing & Industry 4.0',
    'Logistics & Transportation',
    'Government & Public Sector',
    'Construction & Capital Infrastructure',
    'Education & Universities',
    'Real Estate & Asset Portfolios',
    'Energy & Public Utilities',
    'Conglomerate / Other'
  ];

  const categories = [
    'Enterprise Software Development',
    'AI & Machine Learning (Private LLM)',
    'Cloud & Infrastructure Architecture',
    'Cybersecurity & Zero-Trust Defense',
    'System Integration & ESB Orchestration',
    'Digital Transformation Modernization',
    'Enterprise ERP Platform Implementation',
    'Enterprise CRM Platform Implementation',
    'Financial Management Suite',
    'Document Vault (DMS)',
    'Construction Intelligence Suite'
  ];

  const timelines = [
    'Rapid Pilot (< 3 Months)',
    '3 – 6 Months',
    '6 – 12 Months',
    'Multi-Year Phased Transformation'
  ];

  const budgetRanges = [
    'Below $250K USD',
    '$250K – $500K USD',
    '$500K – $1M USD',
    '$1M – $3M USD',
    '$3M – $10M+ USD',
    'Undetermined / Tender Formulation'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm the non-disclosure and project authorization statement.');
      return;
    }
    const ref = submitEnquiry({
      ...formData,
      type: 'Enterprise Project'
    });
    setSubmittedRef(ref);
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Enterprise Engagement Portal"
        title="Enterprise Project Scope &amp; Architecture Discovery"
        subtitle="Submit your organization's technical requirements, legacy infrastructure details, and operational milestones to initiate a formal technical discovery with our Principal Systems Architects."
        bgImage="/contact.png"
        breadcrumbs={[
          { label: 'Enquiry Portals' },
          { label: 'Enterprise Project' }
        ]}
        primaryCtaText="Government Tender Portal"
        primaryCtaLink="/government"
        secondaryCtaText="All Solutions Overview"
        secondaryCtaLink="/solutions"
      />

      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* ================================================================= */}
            {/* LEFT COLUMN: Executive Briefing, Discovery Timeline & Assurance   */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              {/* Strategic Engagement Introduction */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 block">
                  ARCHITECTURE GOVERNANCE
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                  Direct Technical Review with Principal Systems Architects
                </h2>
                <div className="w-16 h-1 bg-indigo-600 rounded"></div>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Every technical proposal submitted through this portal bypasses generic sales intermediaries. Your architectural requirements are routed directly to our Principal Systems Architects and Sovereign Compliance Leads for rigorous feasibility modeling.
                </p>
              </div>

              {/* 4-Step Architecture Discovery Process */}
              <div className="space-y-4 pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Discovery &amp; Evaluation Lifecycle
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 card-hover-discovery-step">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                      01
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-slate-900 uppercase tracking-wide">
                        Automated Triage &amp; Conflict Audit
                      </h4>
                      <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                        Under 24 hours. Formal mutual NDA execution and technical stack classification.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 card-hover-discovery-step">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                      02
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-slate-900 uppercase tracking-wide">
                        Architecture Discovery Session (45 Min)
                      </h4>
                      <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                        A dedicated video technical briefing with an assigned Principal Architect to evaluate latency targets, API contracts, and concurrency.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 card-hover-discovery-step">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                      03
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-slate-900 uppercase tracking-wide">
                        Formal High-Level Design (HLD) Dossier
                      </h4>
                      <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                        Complete architectural blueprint proposal with Architecture Decision Records (ADRs), risk matrices, and milestone-gated pricing.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 card-hover-discovery-step">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                      04
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-slate-900 uppercase tracking-wide">
                        Guaranteed IP &amp; Source Code Ownership
                      </h4>
                      <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                        Complete intellectual property assignment, unencumbered source code repository handover, and transparent Tier-1 SLAs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Institutional Assurance & Compliance Box */}
              <div className="p-5 rounded-2xl bg-[#0B1424] text-white border border-slate-800 space-y-4 shadow-xl card-hover-security-covenant">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-serif font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Institutional Security Covenants</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                    STRICT PRIVACY
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 font-sans leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Mutual Non-Disclosure:</strong> Submissions are strictly bounded by corporate NDA and proprietary data isolation covenants.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Scale className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span><strong>International Arbitration:</strong> Master agreements structured under SIAC (Singapore) and LCIA (London) legal frameworks.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Direct Sovereign Portals:</strong> For public sector tenders or municipal projects, utilize our specialized Tender Desk.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <Link
                    to="/government/enquiry"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Switch to Government Tender Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Verified Physical Corridors Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-600 flex items-center justify-between card-hover-corridor-notice">
                <div>
                  <div className="font-bold text-slate-900 font-serif">Verified Regional Delivery Hubs:</div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">Singapore · United Arab Emirates · United Kingdom</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              </div>
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: The Confidential Technical Submission Form          */}
            {/* ================================================================= */}
            <div className="lg:col-span-7">
              {submittedRef ? (
                <div className="p-10 lg:p-12 rounded-2xl bg-[#090F1E] border border-emerald-500/40 text-white text-center space-y-6 shadow-2xl">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      SUBMISSION RECEIVED &amp; LOGGED
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      Enterprise Project Registered
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
                    Your architecture scope submission has been dispatched directly to our Principal Systems Architecture Board. A technical director will reach out within 24 hours under formal corporate non-disclosure terms.
                  </p>
                  
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Official Tracking Identifier
                    </div>
                    <div className="text-indigo-400 font-mono text-base font-bold">
                      {submittedRef}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center gap-3.5">
                    <Link
                      to="/"
                      className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/60 space-y-8"
                >
                  {/* Form Header Strip */}
                  <div className="border-b border-slate-200 pb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase text-indigo-600 tracking-wider">
                        CONFIDENTIAL TECHNICAL SUBMISSION
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                        1. Institutional &amp; Stakeholder Information
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      TLS 1.3 ENCRYPTED
                    </span>
                  </div>

                  {/* Section 1 Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1.5">
                        Organisation / Enterprise Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Pacific Marine Logistics Group"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Contact Person Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. David K. Tan"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Corporate Designation *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Group Chief Information Officer"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Official Business Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. d.tan@apexpacific.sg"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Phone Number (With Country Code) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +65 6789 4500"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1.5">Country of Corporate Operations *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Singapore, UAE, United Kingdom"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      />
                    </div>
                  </div>

                  {/* Section 2 Header */}
                  <div className="border-b border-slate-200 pb-4 pt-4">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                      2. Project Architecture &amp; Scope Requirements
                    </h3>
                  </div>

                  {/* Section 2 Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Primary Industry Sector *</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      >
                        {industries.map((ind, i) => (
                          <option key={i} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Project Capability Domain *</label>
                      <select
                        value={formData.projectCategory}
                        onChange={(e) => setFormData({ ...formData, projectCategory: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      >
                        {categories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Target Implementation Timeline</label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      >
                        {timelines.map((tl, i) => (
                          <option key={i} value={tl}>{tl}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Estimated Budget Allocation (USD)</label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs transition-colors"
                      >
                        {budgetRanges.map((br, i) => (
                          <option key={i} value={br}>{br}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1.5">
                        Project Description &amp; Technical Objectives *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Detail the technical objectives, legacy databases (Oracle, SAP, IBM DB2) to integrate, expected concurrency (TPS), cloud/on-premise residency requirements, and security gating..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-indigo-600 text-xs leading-relaxed transition-colors"
                      />
                    </div>

                    {/* Simulated Document Upload */}
                    <div className="sm:col-span-2 p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-50 text-center transition-colors">
                      <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
                      <span className="text-xs font-semibold text-slate-800 block">
                        Attach Architecture Diagram, FRS or RFP Dossier (Simulated)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        Supported file formats: PDF, DOCX, ZIP, PPTX (Up to 50MB)
                      </span>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="leading-relaxed">
                          I confirm that I am authorized to submit this corporate technical brief. I acknowledge that all communications are protected under bilateral non-disclosure agreements and institutional privacy governance.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Submission Footer */}
                  <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zero outbound leakage · AES-256 Storage</span>
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Submit Architecture Scope</span>
                      <ArrowRight className="w-4 h-4 text-indigo-200" />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
