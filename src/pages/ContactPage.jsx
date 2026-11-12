import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useEnquiry } from '../context/EnquiryContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Globe2,
  Building2,
  Lock
} from 'lucide-react';

export default function ContactPage() {
  const { submitEnquiry } = useEnquiry();
  const [submittedRef, setSubmittedRef] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    enquiryType: 'Enterprise Project',
    subject: '',
    message: '',
    consent: false
  });

  const enquiryTypes = [
    'Enterprise Project',
    'Government Project',
    'Software Development',
    'Technology Consulting',
    'Strategic Partnership',
    'Career',
    'General Enquiry'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm your consent to proceed.');
      return;
    }
    const ref = submitEnquiry({
      ...formData,
      contactPerson: formData.name,
      organization: formData.company,
      type: formData.enquiryType,
      description: `[Subject: ${formData.subject}] ${formData.message}`
    });
    setSubmittedRef(ref);
  };

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge="Corporate Communications"
        title="Contact A8Fusion Corporate Offices"
        subtitle="Initiate dialogue regarding enterprise software contracts, sovereign digital infrastructure tenders, or strategic institutional partnerships."
        bgImage="/contact.png"
        breadcrumbs={[
          { label: 'Contact Us' }
        ]}
        primaryCtaText="Enterprise Project Scope"
        primaryCtaLink="/request-project"
        secondaryCtaText="Government Tender Portal"
        secondaryCtaLink="/government"
      />

      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Official Contact Channels & Global Hubs */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  Official Channels
                </span>
                <h2 className="text-3xl font-serif font-normal text-slate-900">
                  Global Hubs &amp; Operational Coordination
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  All correspondence is routed through encrypted corporate channels adhering to international business confidentiality standards.
                </p>
              </div>

              {/* Verified Locations List */}
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-hub-location">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600">SINGAPORE (APAC HUB)</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">COORDINATION ACTIVE</span>
                  </div>
                  <div className="text-sm font-serif font-bold text-slate-900 transition-colors">Marina Bay Financial Centre</div>
                  <div className="text-xs text-slate-600 font-sans">Level 24, Tower 1, 8 Marina Boulevard, Singapore 018981</div>
                  <div className="text-xs font-mono text-slate-500 pt-1">Tel: +65 6800 9200</div>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-hub-location">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600">UNITED ARAB EMIRATES (GCC HUB)</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">COORDINATION ACTIVE</span>
                  </div>
                  <div className="text-sm font-serif font-bold text-slate-900 transition-colors">DIFC Innovation Hub</div>
                  <div className="text-xs text-slate-600 font-sans">Gate Avenue, Level 4, Dubai, United Arab Emirates</div>
                  <div className="text-xs font-mono text-slate-500 pt-1">Tel: +971 4 360 8100</div>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-hub-location">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600">UNITED KINGDOM (EMEA HUB)</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">COORDINATION ACTIVE</span>
                  </div>
                  <div className="text-sm font-serif font-bold text-slate-900 transition-colors">City of London Operations</div>
                  <div className="text-xs text-slate-600 font-sans">100 Bishopsgate, Level 18, London EC2N 4AG, United Kingdom</div>
                  <div className="text-xs font-mono text-slate-500 pt-1">Tel: +44 20 7946 0880</div>
                </div>
              </div>

              {/* Direct Practice Email Inboxes */}
              <div className="p-5 rounded-xl bg-[#0B172A] text-white border border-slate-800 space-y-3 card-hover-dedicated-inbox">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Dedicated Inboxes
                </span>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Executive Secretariat:</span>
                    <a href="mailto:corporate@a8fusion.com" className="text-white hover:text-indigo-300 underline">corporate@a8fusion.com</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sovereign &amp; Government:</span>
                    <a href="mailto:sovereign@a8fusion.com" className="text-white hover:text-indigo-300 underline">sovereign@a8fusion.com</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Strategic Alliances:</span>
                    <a href="mailto:partners@a8fusion.com" className="text-white hover:text-indigo-300 underline">partners@a8fusion.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: General Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm card-hover-contact-form">
                <div className="mb-6 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                    Direct Corporate Enquiry
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    Send an Official Message
                  </h3>
                  <p className="text-xs text-slate-600 font-sans">
                    Submissions are reviewed by our senior technical and commercial coordinators within 1 business day.
                  </p>
                </div>

                {submittedRef ? (
                  <div className="p-8 rounded-xl bg-white border border-emerald-500/50 text-center space-y-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-serif font-bold text-slate-900 text-xl">
                      Enquiry Successfully Received
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto font-sans leading-relaxed">
                      Thank you for contacting A8Fusion. Your enquiry has been registered in our corporate database with an official audit tracking code.
                    </p>
                    <div className="inline-block p-4 rounded-xl bg-slate-950 text-indigo-400 font-mono text-sm font-bold">
                      Enquiry Reference ID: {submittedRef}
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setSubmittedRef(null)}
                        className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Elena Rostova"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Company / Institution *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Apex Meridian Holdings"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Business Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. e.rostova@meridian.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +44 20 7000 0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Country / Jurisdiction *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. United Kingdom, Singapore, UAE"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Enquiry Category *</label>
                        <select
                          value={formData.enquiryType}
                          onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                        >
                          {enquiryTypes.map((t, idx) => (
                            <option key={idx} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">Subject *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Enterprise ERP Architecture Discovery for Multi-Branch Logistics"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">Message &amp; Project Context *</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Provide details regarding the scope, operational challenges, timelines, or technology requirements..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-600 text-xs leading-relaxed"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            required
                            checked={formData.consent}
                            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                            className="mt-0.5 rounded border-slate-300 text-indigo-600"
                          />
                          <span>
                            I consent to A8Fusion storing my provided details to respond to this commercial inquiry under corporate non-disclosure terms.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-lg bg-[#0B172A] hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                      >
                        <span>Dispatch Official Enquiry</span>
                        <ArrowRight className="w-4 h-4 text-indigo-300" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

