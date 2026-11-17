import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { useEnquiry } from '../../context/EnquiryContext';
import {
  ShieldCheck,
  Handshake,
  CheckCircle2,
  ArrowRight,
  Upload,
  Globe2,
  Building2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export default function PartnershipPage() {
  const { submitEnquiry } = useEnquiry();
  const [submittedRef, setSubmittedRef] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryValue, setCustomCategoryValue] = useState('');

  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    country: '',
    email: '',
    phone: '',
    partnershipCategory: 'Systems Integration & Global Co-Delivery',
    proposedCollaboration: '',
    consent: false
  });

  const categories = [
    'Systems Integration & Global Co-Delivery',
    'Sovereign Cloud & Infrastructure Provider (AWS / Azure / Sovereign DC)',
    'Independent Software Vendor (ISV) & Solution Partner',
    'Accredited Cybersecurity, SOC & Zero-Trust Partner',
    'Enterprise ERP & Financial Systems Implementation Alliance',
    'Academic, Applied AI & Research Consortium',
    'Custom'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm your authorization to propose an institutional partnership.');
      return;
    }
    const resolvedCategory = isCustomCategory
      ? (customCategoryValue.trim() || 'Custom Partnership Category')
      : formData.partnershipCategory;

    const ref = submitEnquiry({
      ...formData,
      partnershipCategory: resolvedCategory,
      type: 'Strategic Partnership',
      enquiry_type: 'partnership',
      description: `[Category: ${resolvedCategory}] ${formData.proposedCollaboration}`,
      message: `[Category: ${resolvedCategory}] ${formData.proposedCollaboration}`
    });
    setSubmittedRef(ref);
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Strategic Ecosystem"
        title="Strategic Partnerships &amp; System Integration Alliances"
        subtitle="A8Fusion collaborates with accredited regional systems integrators, sovereign data center operators, and specialized technology partners to deliver large-scale digital transformations."
        bgImage="/global.png"
        breadcrumbs={[
          { label: 'Global Business', link: '/global-business' },
          { label: 'Strategic Partnerships' }
        ]}
        primaryCtaText="Enterprise Project Scope"
        primaryCtaLink="/request-project"
        secondaryCtaText="Global Operations"
        secondaryCtaLink="/global-business"
      />

      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#F5F7FF] via-[#EEF2FF]/60 to-[#F8FAFC] border-b border-slate-200">
        {/* Soft Ambient Background Blur Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200/35 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Dot Matrix Grids */}
        <div className="absolute top-12 right-12 hidden lg:block pointer-events-none opacity-40">
          <svg className="w-24 h-24 text-indigo-300" fill="currentColor" viewBox="0 0 100 100">
            {[...Array(6)].map((_, r) =>
              [...Array(6)].map((_, c) => (
                <circle key={`tr-${r}-${c}`} cx={10 + c * 16} cy={10 + r * 16} r="2.5" />
              ))
            )}
          </svg>
        </div>
        <div className="absolute bottom-12 left-12 hidden lg:block pointer-events-none opacity-40">
          <svg className="w-24 h-24 text-indigo-300" fill="currentColor" viewBox="0 0 100 100">
            {[...Array(6)].map((_, r) =>
              [...Array(6)].map((_, c) => (
                <circle key={`bl-${r}-${c}`} cx={10 + c * 16} cy={10 + r * 16} r="2.5" />
              ))
            )}
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {submittedRef ? (
            <div className="p-10 rounded-2xl bg-slate-900 border border-emerald-500/50 text-white text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                Partnership Proposal Registered
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
                Your partnership inquiry has been routed to our Global Alliances Director. We evaluate co-delivery synergies and technical capabilities under strict mutual NDA frameworks.
              </p>
              <div className="inline-block p-4 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-mono text-sm font-bold">
                Alliance Reference Code: {submittedRef}
              </div>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setIsCustomCategory(false);
                    setCustomCategoryValue('');
                  }}
                  className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Submit Another Proposal
                </button>
                <Link
                  to="/"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative bg-white rounded-[28px] p-8 sm:p-12 border border-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12),0_10px_30px_-5px_rgba(0,0,0,0.04)] overflow-hidden space-y-6"
            >
              {/* Top-Left Curved Gradient Arc */}
              <svg className="absolute -top-[1px] -left-[1px] w-28 h-28 pointer-events-none z-10" viewBox="0 0 112 112" fill="none">
                <path
                  d="M 112 3 H 32 C 16 3 3 16 3 32 V 112"
                  stroke="url(#partnerCornerGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="partnerCornerGradient" x1="0" y1="112" x2="112" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Form Header with Registration Pill */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E8FF] border border-[#E9D5FF]/70 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                  <span className="text-[11px] font-bold tracking-wider text-[#7C3AED] uppercase font-sans">
                    PARTNER REGISTRATION
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-3">
                  Partner Organization Details
                </h3>
                <div className="w-full h-px bg-slate-200/80 mt-5" />
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
                {/* Field 1: Partner Organization Name */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Partner Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tech Innovators Organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
                  />
                </div>

                {/* Field 2: Primary Biller or Contact */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Primary Biller or Contact *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John D. Smith"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
                  />
                </div>

                {/* Field 3: Contact Person Email */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Contact Person Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. contact@yourcompany.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
                  />
                </div>

                {/* Field 4: Country / Headquarter */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Country / Headquarter *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United States, or USA, etc. region"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-[13px] placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
                  />
                </div>

                {/* Field 5: Partnership Category */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Partnership Category *
                  </label>
                  <div className="relative">
                    <select
                      value={isCustomCategory ? 'Custom' : formData.partnershipCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Custom') {
                          setIsCustomCategory(true);
                        } else {
                          setIsCustomCategory(false);
                          setFormData({ ...formData, partnershipCategory: val });
                        }
                      }}
                      className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-[13px] font-sans focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer shadow-xs"
                    >
                      <option value="" disabled>Select Partnership and Business Category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c === 'Custom' ? 'Custom Partnership Category (Specify)' : c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-800 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {isCustomCategory && (
                    <div className="mt-2.5 space-y-1">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Regional Telemetry Reseller, Hardware OEM Alliance, Specialist Co-Delivery..."
                        value={customCategoryValue}
                        onChange={(e) => setCustomCategoryValue(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-500 text-slate-800 text-xs sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-sans shadow-xs"
                        autoFocus
                      />
                      <span className="text-[11px] text-slate-500 font-sans block pl-1">
                        Specify your exact institutional alliance model or cooperative scope.
                      </span>
                    </div>
                  )}
                </div>

                {/* Field 6: Proposal / Collaboration & Business Agreement */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Proposal / Collaboration &amp; Business Agreement *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Give us your proposal or Partnership and Business Agreement details here in brief to help us understand your requirements."
                    value={formData.proposedCollaboration}
                    onChange={(e) => setFormData({ ...formData, proposedCollaboration: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-[13px] leading-relaxed placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs resize-y"
                  />
                </div>

                {/* Field 7: Attach Corporation Profile and Partnership Case Studies */}
                <div className="sm:col-span-2 p-5 sm:p-6 rounded-2xl border border-dashed border-indigo-200/90 bg-indigo-50/20 hover:bg-indigo-50/40 transition-colors text-center relative group cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.pptx,.zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData((prev) => ({
                            ...prev,
                            attachedFileName: file.name,
                            attachedFileSize: `${Math.round(file.size / 1024)} KB`,
                            attachedFileData: event.target.result,
                            attachedFileType: file.type || 'application/pdf',
                            document_attachments: [{
                              name: file.name,
                              size: `${Math.round(file.size / 1024)} KB`,
                              type: file.type || 'application/pdf',
                              data: event.target.result,
                              uploaded_at: new Date().toISOString()
                            }]
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-indigo-600 mx-auto" />
                  {formData.attachedFileName ? (
                    <div className="space-y-1 mt-2">
                      <span className="text-xs text-emerald-600 font-bold block">
                        Attached: {formData.attachedFileName} ({formData.attachedFileSize})
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Click to replace file</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-800 block mt-2">
                        Attach Corporation Profile and Partnership Case Studies
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal block mt-0.5">
                        Supported file types: PDF, DOC, DOCX | Max size: 10MB
                      </span>
                    </>
                  )}
                </div>

                {/* Field 8: Terms & Conditions Checkbox */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-[13px] text-slate-700 select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                    />
                    <span className="font-medium text-slate-700">
                      I confirm that the information provided is accurate and agree to the terms and conditions.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Action (Aligned Right) */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                >
                  <span>SUBMIT PARTNERSHIP PROPOSAL</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

