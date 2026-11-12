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
  Building2 
} from 'lucide-react';

export default function PartnershipPage() {
  const { submitEnquiry } = useEnquiry();
  const [submittedRef, setSubmittedRef] = useState(null);

  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    country: '',
    email: '',
    phone: '',
    partnershipCategory: 'Systems Integration & Co-Delivery',
    proposedCollaboration: '',
    consent: false
  });

  const categories = [
    'Systems Integration & Co-Delivery',
    'Sovereign Cloud & Infrastructure Provider',
    'Independent Software Vendor (ISV) Ecosystem',
    'Accredited Cybersecurity & SOC Audit Partner',
    'Academic & AI Research Consortium'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm your authorization to propose an institutional partnership.');
      return;
    }
    const ref = submitEnquiry({
      ...formData,
      type: 'Strategic Partnership',
      description: `[Category: ${formData.partnershipCategory}] ${formData.proposedCollaboration}`
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

      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  to="/"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-mono font-bold uppercase text-indigo-600 tracking-wider">
                  INSTITUTIONAL ALLIANCE APPLICATION
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Partner Organization Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Partner Organisation Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nordic Sovereign Systems AB"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Alliance Contact *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Astrid Lindqvist"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. astrid.l@nordicsovereign.se"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Country / Headquarters *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sweden, Germany, UAE, Singapore"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Partnership Category *</label>
                  <select
                    value={formData.partnershipCategory}
                    onChange={(e) => setFormData({ ...formData, partnershipCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Proposed Collaboration &amp; Regional Alignment *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Outline your organization's technical strengths, sovereign hosting certifications, or joint public-sector consortium opportunities..."
                    value={formData.proposedCollaboration}
                    onChange={(e) => setFormData({ ...formData, proposedCollaboration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs leading-relaxed"
                  />
                </div>

                {/* Simulated Partner Credential Upload */}
                <div className="sm:col-span-2 p-5 rounded-xl border border-dashed border-slate-300 bg-white text-center">
                  <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
                  <span className="text-xs font-semibold text-slate-800 block">
                    Attach Corporate Deck or Accredited Certifications (Simulated)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Supported: PDF, PPTX, ZIP (Up to 20MB)
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600"
                    />
                    <span>
                      I verify that I am authorized to submit this strategic alliance proposal on behalf of our organization.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  <span>Submit Partnership Proposal</span>
                  <ArrowRight className="w-4 h-4 text-indigo-200" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

