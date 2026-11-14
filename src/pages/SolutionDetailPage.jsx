import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SolutionTopologyVisualizer from '../components/common/SolutionTopologyVisualizer';
import { solutionsData } from '../data/solutionsData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Server, 
  Database, 
  Lock, 
  Layers, 
  Cpu, 
  Boxes, 
  Terminal, 
  FileCheck2, 
  ExternalLink,
  Sparkles,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import {
  LiveEditorToolbar,
  CardActionOverlay,
  AddCardButton,
  SectionHeaderEditButton,
  LiveEditorModal
} from '../admin/components/LiveEditorControls';

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const defaultSolution = solutionsData.find(s => s.slug === slug);

  if (!defaultSolution) {
    return <Navigate to="/solutions" replace />;
  }

  // Live Editor State
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Content States
  const [pageHeader, setPageHeader] = useState({
    badge: defaultSolution.badge,
    title: defaultSolution.title,
    subtitle: defaultSolution.tagline,
    bgImage: '/solutions.png',
    primaryCtaText: 'Request Solution Demonstration',
    primaryCtaLink: `/request-project?solution=${defaultSolution.slug}`,
    secondaryCtaText: 'All Solutions Catalog',
    secondaryCtaLink: '/solutions'
  });

  const [systemArchitecture, setSystemArchitecture] = useState({
    tag: 'System Architecture',
    title: 'Modular Platform Engineered for Zero Operational Latency',
    shortDesc: defaultSolution.shortDesc,
    specTitle: 'COMMISSIONING & DEPLOYMENT SPECIFICATION',
    specDesc: `Status: ${defaultSolution.status}. Custom configurations, schema partitions, and single-tenant sovereign VPC deployments are tailored to client regulatory requirements.`
  });

  const [useCasesHeader, setUseCasesHeader] = useState({
    title: 'Target Enterprise Scenarios'
  });
  const [useCases, setUseCases] = useState([...(defaultSolution.useCases || [])]);

  const [modulesHeader, setModulesHeader] = useState({
    tag: 'Core Building Blocks',
    title: 'Integrated Modules',
    desc: 'Each module can be independently enabled or disabled based on role authorization and institutional operational workflows.'
  });
  const [modules, setModules] = useState([...(defaultSolution.modules || [])]);

  const [cta, setCta] = useState({
    title: `Schedule a Confidential Demo of ${defaultSolution.title}`,
    desc: 'Witness our high-concurrency architecture, real-time ledgers, and role-based access controls in an interactive sandbox.',
    primaryCtaText: 'Request Platform Evaluation',
    primaryCtaLink: `/request-project?solution=${defaultSolution.slug}`,
    secondaryCtaText: 'Contact Solutions Architect',
    secondaryCtaLink: '/contact'
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  // Check URL query param for live_edit
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('live_edit') === 'true') {
      setEditMode(true);
    }
  }, [location.search]);

  // Load Content from Backend / LocalStorage
  const storageKey = `a8_live_solution_${slug}`;
  const backendSlug = `solution-${slug}`;

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/pages/get_live_content/?slug=${backendSlug}`);
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
        const local = localStorage.getItem(storageKey);
        if (local) {
          const parsed = JSON.parse(local);
          applyLoadedData(parsed);
        }
      } catch (err) {
        console.error('Error loading local data', err);
      }
    };

    loadContent();
  }, [slug]);

  const applyLoadedData = (data) => {
    if (data.pageHeader) setPageHeader(data.pageHeader);
    if (data.systemArchitecture) setSystemArchitecture(data.systemArchitecture);
    if (data.useCasesHeader) setUseCasesHeader(data.useCasesHeader);
    if (Array.isArray(data.useCases)) setUseCases(data.useCases);
    if (data.modulesHeader) setModulesHeader(data.modulesHeader);
    if (Array.isArray(data.modules)) setModules(data.modules);
    if (data.cta) setCta(data.cta);
  };

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      pageHeader,
      systemArchitecture,
      useCasesHeader,
      useCases,
      modulesHeader,
      modules,
      cta,
      updated_at: new Date().toISOString()
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: backendSlug,
          live_data: payload
        })
      });
      if (!res.ok) throw new Error('Failed to save to backend');
      setIsDirty(false);
      alert(`Platform specifications for "${defaultSolution.title}" saved and synchronized successfully!`);
    } catch (e) {
      console.warn('Backend save issue:', e);
      setIsDirty(false);
      alert('Changes saved in browser session.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this solution platform back to default specifications?')) {
      setPageHeader({
        badge: defaultSolution.badge,
        title: defaultSolution.title,
        subtitle: defaultSolution.tagline,
        bgImage: '/solutions.png',
        primaryCtaText: 'Request Solution Demonstration',
        primaryCtaLink: `/request-project?solution=${defaultSolution.slug}`,
        secondaryCtaText: 'All Solutions Catalog',
        secondaryCtaLink: '/solutions'
      });
      setSystemArchitecture({
        tag: 'System Architecture',
        title: 'Modular Platform Engineered for Zero Operational Latency',
        shortDesc: defaultSolution.shortDesc,
        specTitle: 'COMMISSIONING & DEPLOYMENT SPECIFICATION',
        specDesc: `Status: ${defaultSolution.status}. Custom configurations, schema partitions, and single-tenant sovereign VPC deployments are tailored to client regulatory requirements.`
      });
      setUseCasesHeader({
        title: 'Target Enterprise Scenarios'
      });
      setUseCases([...(defaultSolution.useCases || [])]);
      setModulesHeader({
        tag: 'Core Building Blocks',
        title: 'Integrated Modules',
        desc: 'Each module can be independently enabled or disabled based on role authorization and institutional operational workflows.'
      });
      setModules([...(defaultSolution.modules || [])]);
      setCta({
        title: `Schedule a Confidential Demo of ${defaultSolution.title}`,
        desc: 'Witness our high-concurrency architecture, real-time ledgers, and role-based access controls in an interactive sandbox.',
        primaryCtaText: 'Request Platform Evaluation',
        primaryCtaLink: `/request-project?solution=${defaultSolution.slug}`,
        secondaryCtaText: 'Contact Solutions Architect',
        secondaryCtaLink: '/contact'
      });
      localStorage.removeItem(storageKey);
      setIsDirty(true);
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Exit without saving?')) {
      return;
    }
    setEditMode(false);
    navigate(`/solutions/${slug}`, { replace: true });
  };

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
    } else if (modalType === 'architecture') {
      setSystemArchitecture({ ...modalData });
    } else if (modalType === 'usecases_header') {
      setUseCasesHeader({ ...modalData });
    } else if (modalType === 'usecase_edit') {
      const updated = [...useCases];
      updated[editingIndex] = modalData.text;
      setUseCases(updated);
    } else if (modalType === 'usecase_add') {
      if (modalData.text) setUseCases([...useCases, modalData.text]);
    } else if (modalType === 'modules_header') {
      setModulesHeader({ ...modalData });
    } else if (modalType === 'module_edit') {
      const updated = [...modules];
      updated[editingIndex] = { ...modalData };
      setModules(updated);
    } else if (modalType === 'module_add') {
      setModules([...modules, {
        name: modalData.name || 'New Modular Service',
        desc: modalData.desc || 'Operational scope and functionality.'
      }]);
    } else if (modalType === 'cta') {
      setCta({ ...modalData });
    }

    closeModal();
  };

  const isLive = editMode && !previewMode;

  // Topology data tailored to all 9 solutions
  const architectureTopologyData = {
    'enterprise-erp': {
      tier1: {
        title: 'Tier 01: Client Ingress & Experience',
        desc: 'Multi-device portal layer with real-time biometric and role authorizations.',
        tags: ['Web Application', 'Warehouse Handhelds', 'Supplier EDI Gateway', 'REST & GraphQL APIs']
      },
      tier2: {
        title: 'Tier 02: Core Orchestration & Domain Engine',
        desc: 'Sub-millisecond ledger computation, event streaming, and automated BoM reconciliations.',
        tags: ['Double-Entry Ledger Core', 'Kafka Event Bus', 'Automated BoM Engine', 'Multi-Branch Routing']
      },
      tier3: {
        title: 'Tier 03: Sovereign Persistence & Security',
        desc: 'Cryptographic state verification with zero-trust network boundaries and HSM key quorums.',
        tags: ['Distributed PostgreSQL (ACID)', 'Redis Telemetry Cache', 'Air-Gapped Sovereign VPC', 'Hardware HSM Vault']
      }
    },
    'enterprise-crm': {
      tier1: {
        title: 'Tier 01: Institutional Engagement Layer',
        desc: 'Executive deal pipeline interfaces and cross-jurisdictional relationship tracking.',
        tags: ['Institutional Deal Cockpit', 'Relationship Graph UI', 'Executive Mobile Feed', 'Secure Email Bridge']
      },
      tier2: {
        title: 'Tier 02: Contract & Governance Engine',
        desc: 'SIAC-enforceable contract lifecycle management and audit-trailed approvals.',
        tags: ['Contract Lifecycle Engine', 'Deterministic Pipeline Graph', 'Granular RBAC Enforcer', 'Multi-Jurisdiction Logic']
      },
      tier3: {
        title: 'Tier 03: Zero-Egress Confidential Storage',
        desc: 'Hardware-isolated vaults guaranteeing zero unauthorized foreign telemetry egress.',
        tags: ['Zero-Knowledge Encrypted DB', 'Air-Gapped VPC Enclave', 'Immutable Audit Trails', 'HSM Access Matrix']
      }
    },
    'enterprise-hrms': {
      tier1: {
        title: 'Tier 01: Workforce Portals & Access',
        desc: 'Decentralized employee portals, biometric hardware terminals, and manager hubs.',
        tags: ['Employee Self-Service', 'Biometric Terminal Bridges', 'Executive HR Cockpit', 'Mobile Roster Sync']
      },
      tier2: {
        title: 'Tier 02: Human Capital Orchestration',
        desc: 'Autonomous multi-country payroll calculations and multi-jurisdiction tax matrices.',
        tags: ['Multi-Country Tax Engine', 'Autonomous Payroll Bus', 'Talent Performance Matrix', 'Leave & Shift Allocator']
      },
      tier3: {
        title: 'Tier 03: Sovereign Identity & Records',
        desc: 'Encrypted personnel records complying with regional GDPR and localized data laws.',
        tags: ['Decentralized ID Vault', 'AES-256 PII Encryption', 'ISO/IEC 27001 Data Enclave', 'Cryptographic Escrow']
      }
    },
    'financial-management': {
      tier1: {
        title: 'Tier 01: Fiscal Command & Ingress',
        desc: 'CFO dashboards, automated invoicing pipelines, and bank clearing gateways.',
        tags: ['CFO Executive Command', 'Automated AP/AR Flow', 'Treasury & FX Cockpit', 'ISO 20022 Bank Gateway']
      },
      tier2: {
        title: 'Tier 02: High-Velocity Ledger Engine',
        desc: 'Sub-millisecond mathematical double-entry reconciliation with zero floating point drift.',
        tags: ['Double-Entry Math Core', 'Sub-Millisecond Settlement', 'Automated Bank Reconciler', 'Tax Compliance Bus']
      },
      tier3: {
        title: 'Tier 03: Cryptographic Fiscal Vault',
        desc: 'Tamper-evident write-once immutable ledger architecture with multi-party quorum.',
        tags: ['SHA-256 State Hashing', 'Immutable Audit Ledger', 'HSM Hardware Key Quorum', 'Disaster Mirror Nodes']
      }
    },
    'business-intelligence': {
      tier1: {
        title: 'Tier 01: Executive Visualization Tier',
        desc: 'Sub-second streaming analytics cockpits and interactive KPI canvas displays.',
        tags: ['Cabinet Command Cockpit', 'Streaming Telemetry Glass', 'Custom Executive Canvas', 'Scheduled Automated Briefs']
      },
      tier2: {
        title: 'Tier 02: High-Velocity Analytics Core',
        desc: 'Distributed ClickHouse columnar query pipeline with real-time Kafka event ingestion.',
        tags: ['ClickHouse OLAP Pipeline', 'Real-Time Kafka Ingestion', 'Predictive ML Forecasting', 'Sub-Second Aggregator']
      },
      tier3: {
        title: 'Tier 03: Sovereign Data Lakehouse',
        desc: 'Petabyte-scale in-country data lakes isolated from foreign telemetry ingress.',
        tags: ['Air-Gapped Data Lake', 'Microsecond Query Cache', 'AES-256 Storage Enclave', 'Zero-Egress Gateway']
      }
    },
    'document-management': {
      tier1: {
        title: 'Tier 01: Document Ingress & Verification',
        desc: 'Encrypted document drop zones, automated OCR semantic scanning, and legally binding signers.',
        tags: ['Encrypted Drop Ingress', 'OCR Semantic Classifier', 'Legally Binding E-Signer', 'Multi-Party Approvals']
      },
      tier2: {
        title: 'Tier 02: Semantic Knowledge Engine',
        desc: 'Deterministic vector indexing, cryptographic version trees, and automated retention matrices.',
        tags: ['Semantic RAG Search Core', 'Tamper-Evident Versioning', 'Automated Legal Retention', 'Document Workflow Router']
      },
      tier3: {
        title: 'Tier 03: Hardware-Secured Storage Vault',
        desc: 'Air-gapped WORM-compliant storage with hardware security module (HSM) key isolation.',
        tags: ['AES-256-GCM S3/Ceph Vault', 'Hardware HSM Key Vault', 'WORM Compliant Storage', 'Zero-Knowledge Auth']
      }
    },
    'enterprise-ai': {
      tier1: {
        title: 'Tier 01: Cognitive Interface & Ingress',
        desc: 'Enterprise assistant frontends, programmatic SDKs, and voice/document ingestion bridges.',
        tags: ['C-Suite Cognitive Assistant', 'Enterprise Copilot UI', 'SDK / Streaming REST Endpoints', 'Multi-Modal Ingress']
      },
      tier2: {
        title: 'Tier 02: Sovereign Inference & RAG Core',
        desc: 'Private on-premise model execution with deterministic vector retrieval and hallucination guards.',
        tags: ['Private GPU Model Runtime', 'Deterministic RAG Engine', 'Enterprise Policy Guardrails', 'Zero-Hallucination Filter']
      },
      tier3: {
        title: 'Tier 03: Sovereign Vector Storage & Security',
        desc: 'In-country hardware-isolated GPU nodes ensuring model weights never exit authorized perimeters.',
        tags: ['Milvus/Qdrant Vector DB', '100% On-Premise Weights', 'Air-Gapped Private VPC', 'Confidential GPU Enclave']
      }
    },
    'construction-intelligence': {
      tier1: {
        title: 'Tier 01: Field & Telemetry Ingress',
        desc: 'Job-site tablet applications, drone photogrammetry uploads, and IoT sensor networks.',
        tags: ['Field Tablet Inspection App', 'Drone Survey Ingress', 'BIM 3D Model Explorer', 'Contractor Portal']
      },
      tier2: {
        title: 'Tier 02: Capital Analytics & Scheduling Core',
        desc: 'Critical path Monte Carlo delay modeling and automated bill-of-quantities reconciler.',
        tags: ['Critical Path Monte Carlo', 'Automated BoQ Reconciler', 'Field IoT Sensor Bus', 'Milestone Escrow Logic']
      },
      tier3: {
        title: 'Tier 03: Sovereign Site Data Storage',
        desc: 'Immutable project milestone ledgers and geo-spatial telemetry vaults.',
        tags: ['Time-Series Sensor DB', 'Tamper-Proof Milestone Vault', 'Geo-Spatial Spatial Store', 'Air-Gapped VPC']
      }
    },
    'healthcare-technology': {
      tier1: {
        title: 'Tier 01: Clinical Ingress & Workstations',
        desc: 'Physician EHR cockpits, bedside device telemetry, and patient portal integrations.',
        tags: ['Doctor Clinical Workstation', 'Patient Health Portal', 'Bedside Device Telemetry', 'EHR Integration Bus']
      },
      tier2: {
        title: 'Tier 02: Interoperability & Medical Engine',
        desc: 'HL7/FHIR R4 enterprise message routing, ICD-11 diagnostic mapping, and PACS image pipeline.',
        tags: ['HL7 / FHIR R4 Engine', 'ICD-11 Diagnostic Mapper', 'DICOM PACS Pipeline', 'Real-Time Clinical Alerts']
      },
      tier3: {
        title: 'Tier 03: Sovereign PHI Vault & Compliance',
        desc: 'Air-gapped hospital cloud enclaves enforcing zero protected health information egress.',
        tags: ['HIPAA / State Data Enclave', 'Zero-Egress Patient DB', 'Hardware Cryptographic Vault', 'Audit Log Escrow']
      }
    }
  };

  const topology = architectureTopologyData[slug] || {
    tier1: {
      title: 'Tier 01: Ingress & Client Portals',
      desc: 'Unified enterprise access points with strict role authorization and TLS 1.3 encryption.',
      tags: ['Executive Portals', 'Mobile Applications', 'RESTful Endpoints', 'GraphQL 3.0']
    },
    tier2: {
      title: 'Tier 02: Core Orchestration Engine',
      desc: 'High-concurrency microservices bus managing transaction flow and event routing.',
      tags: ['Event-Driven Bus', 'Zero-Lock ACID Engine', 'Service Mesh Proxy', 'Kafka Telemetry']
    },
    tier3: {
      title: 'Tier 03: Sovereign Data & Security',
      desc: 'Air-gapped private cloud storage with hardware-enforced cryptographic validation.',
      tags: ['PostgreSQL Cluster', 'Redis In-Memory Cache', 'Air-Gapped VPC', 'Hardware HSM Vault']
    }
  };

  return (
    <div className={`bg-[#F8FAFC] min-h-screen ${editMode ? 'pt-14' : ''}`}>
      {/* Live Editor Floating Toolbar */}
      {editMode && (
        <LiveEditorToolbar
          pageName={`Platform Solution: ${defaultSolution.title} (/solutions/${slug})`}
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
              label="Edit Solution Hero"
            />
          </div>
        )}
        <PageHeader
          badge={pageHeader.badge}
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          bgImage={pageHeader.bgImage}
          breadcrumbs={[
            { label: 'Solutions', link: '/solutions' },
            { label: pageHeader.title }
          ]}
          primaryCtaText={pageHeader.primaryCtaText}
          primaryCtaLink={pageHeader.primaryCtaLink}
          secondaryCtaText={pageHeader.secondaryCtaText}
          secondaryCtaLink={pageHeader.secondaryCtaLink}
        />
      </div>

      {/* Overview & Architecture Blueprint */}
      <section className="py-20 bg-white border-b border-slate-200 relative group/arch">
        {isLive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
            <SectionHeaderEditButton
              onClick={() => openModal('architecture', { ...systemArchitecture })}
              label="Edit Architecture Narrative"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Architectural Narrative & Enterprise Scenarios */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  {systemArchitecture.tag}
                </span>
                <h2 className="text-3xl font-serif font-normal text-slate-900 leading-tight">
                  {systemArchitecture.title}
                </h2>
                <div className="w-16 h-1 bg-indigo-600 rounded"></div>
                
                <p className="text-sm text-slate-600 font-sans leading-relaxed pt-1">
                  {systemArchitecture.shortDesc}
                </p>
              </div>

              {/* Verified Status Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 card-hover-solution-spec">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{systemArchitecture.specTitle}</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {systemArchitecture.specDesc}
                </p>
              </div>

              {/* Enterprise Use Cases */}
              <div className="space-y-2.5 relative group/usecases">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {useCasesHeader.title}
                  </h4>
                  {isLive && (
                    <SectionHeaderEditButton
                      onClick={() => openModal('usecases_header', { ...useCasesHeader })}
                      label="Edit Scenarios Title"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  {useCases.map((uc, i) => (
                    <div key={i} className="relative group/uc flex items-start gap-2.5 text-xs text-slate-700 p-2 rounded-lg card-hover-usecase-row">
                      {isLive && (
                        <CardActionOverlay
                          title={`Scenario ${i + 1}`}
                          onEdit={() => openModal('usecase_edit', { text: uc }, i)}
                          onDelete={() => {
                            if (window.confirm(`Delete scenario "${uc}"?`)) {
                              setUseCases(useCases.filter((_, idx) => idx !== i));
                              markDirty();
                            }
                          }}
                        />
                      )}
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="pr-12">{uc}</span>
                    </div>
                  ))}
                  {isLive && (
                    <button
                      type="button"
                      onClick={() => openModal('usecase_add', { text: '' })}
                      className="w-full mt-2 py-2 px-3 rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white/70 hover:bg-white text-xs font-mono font-bold text-indigo-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Target Enterprise Scenario</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Responsive Interactive System Topology Diagram */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <SolutionTopologyVisualizer solution={defaultSolution} topology={topology} />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Integrated Modules */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 relative group/mheader">
            {isLive && (
              <div className="flex justify-center mb-2">
                <SectionHeaderEditButton
                  onClick={() => openModal('modules_header', { ...modulesHeader })}
                  label="Edit Modules Header"
                />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              {modulesHeader.tag}
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              {modulesHeader.title} ({modules.length})
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {modulesHeader.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, i) => (
              <div key={i} className="relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-solution-module group">
                {isLive && (
                  <CardActionOverlay
                    title={mod.name}
                    onEdit={() => openModal('module_edit', { ...mod }, i)}
                    onDelete={() => {
                      if (window.confirm(`Delete module "${mod.name}"?`)) {
                        setModules(modules.filter((_, idx) => idx !== i));
                        markDirty();
                      }
                    }}
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-600">MOD 0{i + 1}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">{mod.name}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{mod.desc}</p>
              </div>
            ))}

            {isLive && (
              <AddCardButton
                onClick={() => openModal('module_add', {})}
                label="Add Integrated Module"
                subtitle="Add an enterprise software platform module"
              />
            )}
          </div>
        </div>
      </section>

      {/* Request Demo & Evaluation CTA */}
      <section className="py-20 bg-[#0B172A] text-white relative group/cta">
        {isLive && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
            <SectionHeaderEditButton
              onClick={() => openModal('cta', { ...cta })}
              label="Edit Demo CTA"
            />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif font-normal text-white">
            {cta.title}
          </h2>
          <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            {cta.desc}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={cta.primaryCtaLink}
              className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>{cta.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={cta.secondaryCtaLink}
              className="px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all"
            >
              {cta.secondaryCtaText}
            </Link>
          </div>
        </div>
      </section>

      {/* Live Editor Modal Dialog */}
      <LiveEditorModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleModalSubmit}
        title={
          modalType === 'header' ? 'Edit Solution Hero Header' :
          modalType === 'architecture' ? 'Edit System Architecture' :
          modalType === 'usecases_header' ? 'Edit Scenarios Header' :
          modalType === 'usecase_edit' ? 'Edit Target Scenario' :
          modalType === 'usecase_add' ? 'Add Target Scenario' :
          modalType === 'modules_header' ? 'Edit Modules Header' :
          modalType === 'module_edit' ? `Edit Module: ${modalData.name || ''}` :
          modalType === 'module_add' ? 'Add Integrated Module' :
          modalType === 'cta' ? 'Edit Evaluation CTA' : 'Edit Section'
        }
      >
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline Subtitle</label>
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

        {modalType === 'architecture' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Architectural Overview</label>
              <textarea
                rows={4}
                value={modalData.shortDesc || ''}
                onChange={(e) => setModalData({ ...modalData, shortDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Spec Banner Title</label>
              <input
                type="text"
                value={modalData.specTitle || ''}
                onChange={(e) => setModalData({ ...modalData, specTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Spec Banner Description</label>
              <textarea
                rows={3}
                value={modalData.specDesc || ''}
                onChange={(e) => setModalData({ ...modalData, specDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'usecases_header' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Header Title</label>
            <input
              type="text"
              value={modalData.title || ''}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {(modalType === 'usecase_edit' || modalType === 'usecase_add') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enterprise Scenario</label>
            <textarea
              rows={3}
              required
              value={modalData.text || ''}
              onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
              placeholder="e.g. Automated multi-branch inventory rebalancing across 50 regional nodes"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        )}

        {modalType === 'modules_header' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tag</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {(modalType === 'module_edit' || modalType === 'module_add') && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Module Name</label>
              <input
                type="text"
                required
                value={modalData.name || ''}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                placeholder="e.g. General Ledger & Cash Engine"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Module Functionality & Scope</label>
              <textarea
                rows={4}
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Detail the transactional throughput, automated workflows, and reporting..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </>
        )}

        {modalType === 'cta' && (
          <>
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
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
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary CTA Text</label>
                <input
                  type="text"
                  value={modalData.secondaryCtaText || ''}
                  onChange={(e) => setModalData({ ...modalData, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary CTA Link</label>
                <input
                  type="text"
                  value={modalData.secondaryCtaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, secondaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </>
        )}
      </LiveEditorModal>
    </div>
  );
}
