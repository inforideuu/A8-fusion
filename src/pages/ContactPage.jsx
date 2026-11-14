import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Lock,
  Edit2,
  Trash2,
  Plus,
  Sparkles
} from 'lucide-react';
import {
  LiveEditorToolbar,
  CardActionOverlay,
  AddCardButton,
  SectionHeaderEditButton,
  LiveEditorModal
} from '../admin/components/LiveEditorControls';

const DEFAULT_PAGE_HEADER = {
  badge: 'Corporate Communications',
  title: 'Contact A8Fusion Corporate Offices',
  subtitle: 'Initiate dialogue regarding enterprise software contracts, sovereign digital infrastructure tenders, or strategic institutional partnerships.',
  bgImage: '/contact.png',
  primaryCtaText: 'Enterprise Project Scope',
  primaryCtaLink: '/request-project',
  secondaryCtaText: 'Government Tender Portal',
  secondaryCtaLink: '/government'
};

const DEFAULT_HUBS = [
  {
    id: 'hub-1',
    region: 'SINGAPORE (APAC HUB)',
    status: 'COORDINATION ACTIVE',
    name: 'Marina Bay Financial Centre',
    address: 'Level 24, Tower 1, 8 Marina Boulevard, Singapore 018981',
    phone: '+65 6800 9200'
  },
  {
    id: 'hub-2',
    region: 'UNITED ARAB EMIRATES (GCC HUB)',
    status: 'COORDINATION ACTIVE',
    name: 'DIFC Innovation Hub',
    address: 'Gate Avenue, Level 4, Dubai, United Arab Emirates',
    phone: '+971 4 360 8100'
  },
  {
    id: 'hub-3',
    region: 'UNITED KINGDOM (EMEA HUB)',
    status: 'COORDINATION ACTIVE',
    name: 'City of London Operations',
    address: '100 Bishopsgate, Level 18, London EC2N 4AG, United Kingdom',
    phone: '+44 20 7946 0880'
  }
];

export default function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submitEnquiry } = useEnquiry();

  // Mode States
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState(DEFAULT_PAGE_HEADER);
  const [officeHubs, setOfficeHubs] = useState(DEFAULT_HUBS);

  // Form States
  const [submittedRef, setSubmittedRef] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    enquiryType: 'General Corporate Enquiry',
    subject: '',
    message: '',
    consent: false
  });
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customDomainValue, setCustomDomainValue] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const enquiryTypes = [
    'General Corporate Enquiry',
    'Enterprise Software Development',
    'AI & Machine Learning Solutions',
    'Cloud Architecture & Infrastructure Engineering',
    'Cybersecurity, SOC & Zero-Trust Governance',
    'Enterprise System Integration (ERP / CRM / ESB)',
    'Digital Transformation & Legacy Modernization',
    'Technology Strategy & Architectural Consulting',
    'Media & Press Relations',
    'Custom'
  ];

  // URL query check for live_edit
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('live_edit') === 'true') {
      setEditMode(true);
    }
  }, [location.search]);

  // Load Content from Backend / LocalStorage
  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=contact');
        if (res.ok) {
          const json = await res.json();
          if (json.live_data && Object.keys(json.live_data).length > 0) {
            applyLoadedData(json.live_data);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend unavailable, checking localStorage...', e);
      }

      try {
        const local = localStorage.getItem('a8_live_contact_content');
        if (local) {
          const parsed = JSON.parse(local);
          applyLoadedData(parsed);
        }
      } catch (err) {
        console.error('Error loading local data', err);
      }
    };

    loadContent();
  }, []);

  const applyLoadedData = (data) => {
    if (data.pageHeader) setPageHeader(data.pageHeader);
    if (Array.isArray(data.officeHubs) && data.officeHubs.length > 0) setOfficeHubs(data.officeHubs);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      officeHubs,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('a8_live_contact_content', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'contact',
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert('Contact corporate specifications saved and synchronized successfully!');
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Contact page content back to default factory settings?')) {
      setPageHeader(DEFAULT_PAGE_HEADER);
      setOfficeHubs(DEFAULT_HUBS);
      localStorage.removeItem('a8_live_contact_content');
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate('/contact', { replace: true });
  };

  // Modal Handlers
  const openModal = (type, data = {}, index = null) => {
    setModalType(type);
    setModalData(data);
    setEditingIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalData({});
    setEditingIndex(null);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    markDirty();

    if (modalType === 'header') {
      setPageHeader({ ...modalData });
    } else if (modalType === 'hub_edit') {
      const updated = [...officeHubs];
      updated[editingIndex] = { ...modalData };
      setOfficeHubs(updated);
    } else if (modalType === 'hub_add') {
      const newHub = {
        id: `hub-${Date.now()}`,
        region: modalData.region || 'INDIA (DEVELOPMENT HUB)',
        status: modalData.status || 'COORDINATION ACTIVE',
        name: modalData.name || 'Technology Center',
        address: modalData.address || 'Outer Ring Road, Bangalore 560103, Karnataka, India',
        phone: modalData.phone || '+91 80 4123 4567'
      };
      setOfficeHubs([...officeHubs, newHub]);
    }

    closeModal();
  };

  const handleDeleteHub = (idx) => {
    if (window.confirm(`Delete regional hub "${officeHubs[idx].name}"?`)) {
      const updated = officeHubs.filter((_, i) => i !== idx);
      setOfficeHubs(updated);
      markDirty();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm your consent to proceed.');
      return;
    }
    const resolvedDomain = isCustomDomain
      ? (customDomainValue.trim() || 'Custom Enquiry Domain')
      : formData.enquiryType;

    const ref = submitEnquiry({
      ...formData,
      contactPerson: formData.name,
      full_name: formData.name,
      organization: formData.company,
      type: 'General Contact',
      enquiry_type: 'general',
      enquiryDomain: resolvedDomain,
      subject: formData.subject,
      description: `[Enquiry Domain: ${resolvedDomain}] [Subject: ${formData.subject}] ${formData.message}`,
      message: `[Enquiry Domain: ${resolvedDomain}] [Subject: ${formData.subject}] ${formData.message}`
    });
    setSubmittedRef(ref);
  };

  const isLive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Contact & Global Hubs (/contact)"
          isDirty={isDirty}
          saving={saving}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onReset={handleReset}
          onSave={handleSaveAll}
          onExit={handleExit}
        />
      )}

      {/* Hero Header with in-context live editing */}
      <div className="relative group">
        {isLive && (
          <div className="absolute top-6 right-6 z-40 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-indigo-200 shadow-lg flex items-center gap-2">
            <SectionHeaderEditButton
              onClick={() => openModal('header', { ...pageHeader })}
              label="Edit Hero Header"
            />
          </div>
        )}
        <PageHeader
          badge={pageHeader.badge}
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          bgImage={pageHeader.bgImage}
          breadcrumbs={[
            { label: 'Contact Us' }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Official Contact Channels & Global Hubs */}
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                    Official Channels · {officeHubs.length} Regional Centers
                  </span>
                  <h2 className="text-3xl font-serif font-normal text-slate-900">
                    Global Hubs &amp; Operational Coordination
                  </h2>
                </div>
              </div>

              {/* Verified Locations List with in-context CRUD */}
              <div className="space-y-4">
                {officeHubs.map((hub, idx) => (
                  <div key={hub.id || idx} className="relative p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 card-hover-hub-location group">
                    {isLive && (
                      <CardActionOverlay
                        title={hub.name}
                        onEdit={() => openModal('hub_edit', { ...hub }, idx)}
                        onDelete={() => handleDeleteHub(idx)}
                      />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-600">{hub.region}</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-semibold">{hub.status}</span>
                    </div>
                    <div className="text-sm font-serif font-bold text-slate-900 transition-colors">{hub.name}</div>
                    <div className="text-xs text-slate-600 font-sans">{hub.address}</div>
                    <div className="text-xs font-mono text-slate-500 pt-1">Tel: {hub.phone}</div>
                  </div>
                ))}

                {isLive && (
                  <AddCardButton
                    onClick={() => openModal('hub_add', {})}
                    label="Add Regional Center"
                    subtitle="Add another global corporate or development hub"
                  />
                )}
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
                        onClick={() => {
                          setSubmittedRef(null);
                          setIsCustomDomain(false);
                          setCustomDomainValue('');
                        }}
                        className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
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
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Company / Institution *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nordic Apex Infrastructure"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@enterprise.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Direct Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 555 019 2834"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Country / Jurisdiction *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. United Kingdom"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Enquiry Domain *</label>
                        <select
                          value={isCustomDomain ? 'Custom' : formData.enquiryType}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Custom') {
                              setIsCustomDomain(true);
                            } else {
                              setIsCustomDomain(false);
                              setFormData({ ...formData, enquiryType: val });
                            }
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs text-slate-800 cursor-pointer font-sans"
                        >
                          {enquiryTypes.map((t) => (
                            <option key={t} value={t}>
                              {t === 'Custom' ? 'Custom Enquiry Domain (Specify)' : t}
                            </option>
                          ))}
                        </select>

                        {isCustomDomain && (
                          <div className="mt-2 space-y-1">
                            <input
                              type="text"
                              required
                              placeholder="e.g. IoT Edge Computing, Sovereign Telemetry, Quantum Resilience..."
                              value={customDomainValue}
                              onChange={(e) => setCustomDomainValue(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-indigo-500 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans shadow-2xs"
                              autoFocus
                            />
                            <span className="text-[11px] text-slate-500 font-sans block">
                              Specify your customized corporate technical requirement or domain.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Subject Header *</label>
                      <input
                        type="text"
                        required
                        placeholder="Brief overview of inquiry scope..."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Detailed Technical or Commercial Message *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Describe your architecture requirements, user scale, sovereign data mandates, or timeline expectations..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 focus:outline-hidden focus:border-indigo-600 text-xs"
                      ></textarea>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <label className="flex items-start gap-2 text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>
                          I agree to A8Fusion processing this institutional enquiry under corporate confidentiality standards.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Transmit Official Communication</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Editor Modal Dialog */}
      <LiveEditorModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleModalSubmit}
        title={
          modalType === 'header' ? 'Edit Hero Header' :
          modalType === 'hub_edit' ? `Edit Hub: ${modalData.name || ''}` :
          modalType === 'hub_add' ? 'Add Regional Center' : 'Edit Section'
        }
      >
        {/* Header Modal */}
        {modalType === 'header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge</label>
              <input
                type="text"
                value={modalData.badge || ''}
                onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input
                type="text"
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle</label>
              <textarea
                rows={3}
                value={modalData.subtitle || ''}
                onChange={(e) => setModalData({ ...modalData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Text</label>
                <input
                  type="text"
                  value={modalData.primaryCtaText || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary CTA Link</label>
                <input
                  type="text"
                  value={modalData.primaryCtaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}

        {/* Hub Add / Edit Modal */}
        {(modalType === 'hub_edit' || modalType === 'hub_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hub Name</label>
              <input
                type="text"
                required
                value={modalData.name || ''}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                placeholder="e.g. Marina Bay Financial Centre"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Region Badge</label>
                <input
                  type="text"
                  value={modalData.region || ''}
                  onChange={(e) => setModalData({ ...modalData, region: e.target.value })}
                  placeholder="e.g. SINGAPORE (APAC HUB)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                <input
                  type="text"
                  value={modalData.status || ''}
                  onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                  placeholder="e.g. COORDINATION ACTIVE"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Address</label>
              <input
                type="text"
                value={modalData.address || ''}
                onChange={(e) => setModalData({ ...modalData, address: e.target.value })}
                placeholder="Level 24, Tower 1, 8 Marina Boulevard..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Direct Phone</label>
              <input
                type="text"
                value={modalData.phone || ''}
                onChange={(e) => setModalData({ ...modalData, phone: e.target.value })}
                placeholder="e.g. +65 6800 9200"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
