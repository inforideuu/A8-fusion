import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Server, 
  Lock, 
  Workflow, 
  Layers, 
  Factory, 
  Building2, 
  CheckCircle2, 
  TrendingUp, 
  Database, 
  Boxes, 
  Terminal, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  BarChart3,
  Users2,
  FileText,
  Network,
  Handshake,
  Activity,
  Code2,
  RefreshCw,
  Landmark,
  UserCheck,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { solutionsData } from '../data/solutionsData';
import { industriesData } from '../data/industriesData';
import { insightsData } from '../data/insightsData';
import GlobalGlobe3D from '../components/common/GlobalGlobe3D';
import {
  LiveEditorToolbar,
  CardActionOverlay,
  AddCardButton,
  SectionHeaderEditButton,
  LiveEditorModal
} from '../admin/components/LiveEditorControls';
import { useAdminAuth } from '../admin/context/AdminAuthContext';

// Default Institutional Content Sets
const DEFAULT_HERO_SCENES = [
  {
    id: 'scene-1',
    step: '01',
    startTime: 0,
    endTime: 5,
    tag: 'GLOBAL HUBS // ASIA · MIDDLE EAST · EUROPE',
    title: 'Engineering Intelligence.',
    titleHighlight: 'Transforming Enterprises.',
    description: 'We architect and operate high-concurrency enterprise platforms, advanced digital infrastructure, and sovereign software solutions across Singapore, the UAE, and the UK.',
    metricLabel: 'Delivery Corridors',
    metricValue: 'Singapore · UAE · UK',
    primaryCta: { text: 'Explore Our Solutions', link: '/solutions' },
    secondaryCta: { text: 'Discuss Your Project', link: '/request-project' }
  },
  {
    id: 'scene-2',
    step: '02',
    startTime: 5,
    endTime: 10,
    tag: 'SUPPLY CHAIN & INDUSTRY 4.0 // REAL-TIME PRECISION',
    title: 'Architected for Scale.',
    titleHighlight: 'Engineered for Resilience.',
    description: 'Synchronizing multi-country maritime freight corridors, shop-floor robotics, and large-scale capital infrastructure with sub-millisecond precision.',
    metricLabel: 'System Latency',
    metricValue: '< 1.2ms Telemetry Core',
    primaryCta: { text: 'View Industry Solutions', link: '/industries' },
    secondaryCta: { text: 'Our Engineering Approach', link: '/company/our-approach' }
  },
  {
    id: 'scene-3',
    step: '03',
    startTime: 10,
    endTime: 15,
    tag: 'SOVEREIGN DATA RESIDENCY // ZERO FOREIGN INGRESS',
    title: 'Total Data Sovereignty.',
    titleHighlight: 'Air-Gapped Infrastructure.',
    description: 'Constructing in-country private cloud enclaves, hardware-isolated encryption vaults, and sovereign institutional portals complying with domestic data laws.',
    metricLabel: 'Data Residency',
    metricValue: '100% In-Country Enclaves',
    primaryCta: { text: 'Sovereign Enquiries', link: '/government' },
    secondaryCta: { text: 'Zero-Trust Cybersecurity', link: '/services/cybersecurity' }
  },
  {
    id: 'scene-4',
    step: '04',
    startTime: 15,
    endTime: 20,
    tag: 'PRIVATE ENTERPRISE AI & SRE // 24/7 AVAILABILITY',
    title: 'Private Enterprise AI.',
    titleHighlight: 'Unbreakable Reliability.',
    description: 'Customized on-premise model execution, deterministic RAG retrieval engines, and 24/7 follow-the-sun Site Reliability Engineering guaranteeing absolute uptime.',
    metricLabel: 'High Availability SLA',
    metricValue: '99.999% SLA Uptime',
    primaryCta: { text: 'Discuss Your Project', link: '/request-project' },
    secondaryCta: { text: 'Read Whitepapers', link: '/insights' }
  }
];

const DEFAULT_CORE_TECHNOLOGIES = [
  {
    id: 'enterprise-technology',
    title: 'Enterprise Technology',
    desc: 'Fault-tolerant distributed architectures, multi-tenant transaction cores, and resilient microservices designed for zero-downtime operations.',
    link: '/services/enterprise-software-development',
    tag: 'Core Platform'
  },
  {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    desc: 'Private sovereign LLMs, deterministic Retrieval-Augmented Generation (RAG), and cognitive process automation isolated in customer VPCs.',
    link: '/services/artificial-intelligence',
    tag: 'Sovereign AI'
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud & Infrastructure',
    desc: 'Declarative multi-cloud architectures, Kubernetes orchestration, FinOps cost optimization, and automated geo-redundant disaster recovery.',
    link: '/services/cloud-infrastructure',
    tag: 'Multi-Cloud'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    desc: 'Zero-trust network segmentation, continuous vulnerability scanning, cryptographic key governance, and ISO 27001 readiness.',
    link: '/services/cybersecurity',
    tag: 'Zero-Trust'
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    desc: 'Re-engineering paper-heavy legacy bureaucracy into high-throughput digital workflows, paperless operations, and citizen service backbones.',
    link: '/services/digital-transformation',
    tag: 'Process Mining'
  },
  {
    id: 'system-integration',
    title: 'System Integration',
    desc: 'Enterprise Service Bus (ESB) middleware, Kafka event streaming, and non-intrusive CDC adapters bridging legacy mainframes with modern clouds.',
    link: '/services/system-integration',
    tag: 'Middleware'
  }
];

const DEFAULT_SOLUTIONS = [
  { id: 'enterprise-erp', title: 'Enterprise ERP', slug: 'enterprise-erp', badge: 'Resource Engine', desc: 'Unified financial ledger, international procurement, multi-warehouse inventory, and multi-branch operations.' },
  { id: 'enterprise-crm', title: 'Enterprise CRM', slug: 'enterprise-crm', badge: 'Client Lifecycle', desc: 'High-touch institutional relationship intelligence, enterprise deal governance, and contract lifecycle management.' },
  { id: 'enterprise-hrms', title: 'HRMS', slug: 'enterprise-hrms', badge: 'Human Capital', desc: 'Global workforce management, multi-country payroll compliance, biometric attendance, and talent analytics.' },
  { id: 'financial-management', title: 'Financial Management', slug: 'financial-management', badge: 'Fiscal Core', desc: 'Sovereign accounting, multi-currency general ledgers, accounts payable automation, and cryptographic audit trails.' },
  { id: 'business-intelligence', title: 'Business Intelligence', slug: 'business-intelligence', badge: 'Decision Intelligence', desc: 'C-suite executive command cockpits, sub-second streaming analytics, predictive forecasts, and data lake adapters.' },
  { id: 'document-management', title: 'Document Management', slug: 'document-management', badge: 'Cryptographic Vault', desc: 'Encrypted document vaults, cryptographic version control, full-text semantic indexing, and legally binding approvals.' },
  { id: 'enterprise-ai', title: 'Enterprise AI Platforms', slug: 'enterprise-ai', badge: 'Cognitive Infrastructure', desc: 'On-premise sovereign LLMs, deterministic RAG document search, private cognitive assistants, and hallucination guards.' },
  { id: 'construction-intelligence', title: 'Construction Intelligence', slug: 'construction-intelligence', badge: 'Capital Infrastructure', desc: 'BoQ reconciliation, field telemetry, sub-contractor credential verification, and critical path delay forecasting.' }
];

const DEFAULT_WHY_POINTS = [
  {
    num: '01',
    title: 'Scalable Engineering',
    tag: '100M+ Concurrency',
    desc: 'Constructed from first-principles computer science to process hundreds of millions of transactions without memory degradation, bottle-necks, or cascading failovers.'
  },
  {
    num: '02',
    title: 'Security-Focused Development',
    tag: 'Zero-Trust Perimeters',
    desc: 'Strict zero-trust network segmentation, least-privilege IAM, encrypted data at rest and in transit, and continuous automated static/dynamic code security audits.'
  },
  {
    num: '03',
    title: 'Enterprise Architecture',
    tag: 'Codified ADR Blueprints',
    desc: 'Every technical decision is formally codified in Architecture Decision Records (ADRs), guaranteeing complete intellectual property clarity, modularity, and auditability.'
  },
  {
    num: '04',
    title: 'Industry-Specific Solutions',
    tag: 'Vertical Compliance',
    desc: 'Vertical software built specifically around the regulatory realities and operational tempos of healthcare, banking, manufacturing, and municipal administration.'
  },
  {
    num: '05',
    title: 'Long-Term Technology Partnerships',
    tag: 'Generational SRE Stability',
    desc: 'We do not build throwaway prototypes; we forge institutional partnerships dedicated to multi-year platform stability, generational resilience, and SRE governance.'
  },
  {
    num: '06',
    title: 'International Delivery Approach',
    tag: 'Singapore · UAE · UK Corridors',
    desc: 'Coordinated engineering hubs across Singapore, the UAE, and the UK adhering to rigorous milestone documentation, transparent code reviews, and strict SLAs.'
  }
];

const DEFAULT_FOUNDATION_CARDS = [
  {
    id: 'fnd-1',
    iconName: 'Server',
    title: 'Enterprise Engineering Capabilities',
    desc: 'We construct high-concurrency software architectures capable of scaling across regional subsidiaries without performance degradation, latency spikes, or data corruption.',
    color: 'indigo'
  },
  {
    id: 'fnd-2',
    iconName: 'Workflow',
    title: 'Digital Transformation Expertise',
    desc: 'Modernizing legacy monoliths into event-driven microservices through non-invasive strangler patterns, automated workflows, and paperless operational frameworks.',
    color: 'blue'
  },
  {
    id: 'fnd-3',
    iconName: 'ShieldCheck',
    title: 'Government & Institutional Technology',
    desc: 'Dedicated sovereign compliance practices delivering citizen registry portals, e-tax cores, and municipal infrastructure aligned with domestic data residency mandates.',
    color: 'purple'
  },
  {
    id: 'fnd-4',
    iconName: 'Globe2',
    title: 'International Delivery Capabilities',
    desc: 'Standardized engineering governance spanning Singapore, the UAE, and the UK, adhering strictly to international quality frameworks and transparent SLA accountability.',
    color: 'emerald'
  }
];

const DEFAULT_FACILITY_CARDS = [
  {
    id: 'fac-1',
    badge: 'Tier-IV Sovereign In-Country Node',
    badgeColor: 'cyan',
    title: 'Air-Gapped Sovereign Cloud',
    desc: 'Physical and logical data isolation meeting strict national sovereignty mandates and eliminating multitenant foreign ingress.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fac-2',
    badge: 'Singapore · UAE · London Hubs',
    badgeColor: 'indigo',
    title: 'Global Delivery Architecture',
    desc: 'Coordinated enterprise engineering adhering strictly to SIAC and LCIA international arbitration and ISO/IEC governance frameworks.',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fac-3',
    badge: '24/7 Follow-The-Sun SRE',
    badgeColor: 'emerald',
    title: 'Continuous Operational Observability',
    desc: 'Sub-millisecond telemetry monitoring, zero-downtime canary rollouts, and active latency defense across all live platforms.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  }
];

const DEFAULT_INDUSTRIES = industriesData.map(ind => ({
  id: ind.id,
  slug: ind.slug,
  title: ind.title,
  image: ind.image,
  overview: ind.overview,
  link: ind.id === 'government' ? '/government' : `/industries/${ind.slug}`
}));

const DEFAULT_LIFECYCLE_STAGES = [
  {
    step: 1,
    name: 'Understand',
    phase: 'Stage 01: Requirement Discovery',
    summary: 'Stakeholder domain elicitation, bounded-context taxonomy mapping, volume throughput modeling, and sovereign regulatory compliance audits.',
    deliverables: ['Functional Requirement Specification (FRS)', 'Domain Entity Bounded-Context Map', 'Regulatory Residency Assessment']
  },
  {
    step: 2,
    name: 'Architect',
    phase: 'Stage 02: Systems Architecture',
    summary: 'Formulating formal Architecture Decision Records (ADRs), distributed message bus topologies, schema contracts, and zero-trust security perimeters.',
    deliverables: ['Formal Architecture Decision Records (ADRs)', 'OpenAPI 3.1 & Schema Contracts', 'High-Availability Failover Topology']
  },
  {
    step: 3,
    name: 'Engineer',
    phase: 'Stage 03: Agile Engineering',
    summary: 'Test-driven software engineering organized into bi-weekly sprints with static security code analysis, peer reviews, and automated CI pipelines.',
    deliverables: ['Production Codebase with 85%+ Test Coverage', 'Automated SAST/DAST Vulnerability Scans', 'Component UI Storybooks']
  },
  {
    step: 4,
    name: 'Integrate',
    phase: 'Stage 04: Systems Integration',
    summary: 'Connecting high-throughput message brokers (Kafka/RabbitMQ), legacy mainframe connectors, and non-intrusive Change Data Capture (CDC) pipelines.',
    deliverables: ['Enterprise Service Bus Connectors', 'Real-Time Transaction Reconciliation Engine', 'End-to-End Latency Benchmarks']
  },
  {
    step: 5,
    name: 'Deploy',
    phase: 'Stage 05: Canary Deployment',
    summary: 'Zero-downtime blue-green canary deployments into isolated sovereign cloud enclaves or on-premise VPCs with automated rollback safeguards.',
    deliverables: ['Kubernetes Infrastructure-as-Code (IaC)', 'Distributed Tracing & Observability Dashboards', 'Operational Hypercare Runbooks']
  },
  {
    step: 6,
    name: 'Support',
    phase: 'Stage 06: SRE Governance',
    summary: 'Continuous 24/7/365 Site Reliability Engineering (SRE), pro-active security patch cycles, FinOps cloud cost governance, and strict Tier-1 SLAs.',
    deliverables: ['Sub-15 Minute Critical SLA Guarantee', 'Monthly Security & Capacity Reviews', 'Semi-Annual Disaster Recovery Drills']
  }
];

const DEFAULT_GLOBAL_PILLARS = [
  {
    id: 'pillar-1',
    num: '1. International Collaboration',
    iconName: 'ShieldCheck',
    color: 'indigo',
    desc: 'We navigate the legal and compliance nuances of cross-border operations. Contracts are structured under international arbitration standards (SIAC / LCIA) with strict alignment to European GDPR, ASEAN data privacy statutes, and Gulf cloud residency laws.',
    badge: 'SIAC & LCIA Arbitration Enforceable'
  },
  {
    id: 'pillar-2',
    num: '2. Engineering Delivery',
    iconName: 'Code2',
    color: 'blue',
    desc: 'Distributed engineering squads operating on a coordinated follow-the-sun model. Every release cycle is governed by automated regression tests, static security gating, transparent milestone sprint demos, and complete IP handover.',
    badge: '24/7 Follow-The-Sun SRE Deployment'
  },
  {
    id: 'pillar-3',
    num: '3. Technology Partnerships',
    iconName: 'Handshake',
    color: 'purple',
    desc: 'We collaborate with sovereign cloud providers, accredited regional systems integrators, and independent testing labs, forming joint delivery consortiums for major multinational and government tenders.',
    badge: 'Tier-IV Hyperscale Consortiums'
  }
];

const DEFAULT_INSIGHTS = [
  {
    id: 'ins-1',
    slug: 'architecting-sovereign-cloud-infrastructure',
    title: 'Architecting Sovereign Cloud Infrastructure for High-Security Environments',
    category: 'Enterprise Technology',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    excerpt: 'A comprehensive engineering framework for achieving complete data residency, air-gapped cryptographic vaults, and immutable auditability under domestic compliance regimes.',
    author: {
      name: 'Dr. Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'ins-2',
    slug: 'migrating-monolithic-core-banking-systems',
    title: 'Migrating Monolithic Core Banking: Non-Invasive Strangler Patterns',
    category: 'Enterprise Technology',
    readTime: '12 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Tactical methodologies for incrementally decommissioning legacy mainframe backbones without disrupting active customer transaction flows or ledger reconciliations.',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'ins-3',
    slug: 'private-on-premise-llm-deployment',
    title: 'Private On-Premise LLM Deployment: RAG Architectures & Security',
    category: 'Artificial Intelligence',
    readTime: '10 min read',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Preventing proprietary intellectual property leakage through containerized on-premise model execution, deterministic vector retrieval, and output guardrails.',
    author: {
      name: 'Tariq Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
  }
];

const DEFAULT_SECTION_HEADINGS = {
  companyIntro: {
    tag: 'Corporate Foundations',
    title: 'Technology Built for Complex Business Challenges.',
    desc: 'A8Fusion operates as an independent international technology corporation engineered specifically for mission-critical enterprise platforms and sovereign government initiatives. We bridge complex organizational workflows, strict regulatory compliance, and multi-region business operations into unified, dependable digital systems.',
    ctaText: 'Discover A8Fusion',
    ctaLink: '/company/about'
  },
  facilities: {
    tag: 'Operational Realities // Verified Facilities',
    title: 'Mission-Critical Infrastructure Across Strategic Corridors'
  },
  tech: {
    tag: 'Engineering Disciplines',
    title: 'Core Technology Capabilities',
    desc: 'Seven rigorous engineering disciplines delivered with architectural transparency, zero-trust security, and international business readiness.'
  },
  solutions: {
    tag: 'Proprietary Platforms',
    title: 'Enterprise Software Platforms',
    desc: 'Modular, high-performance platforms designed for multi-branch operations, complex procurement, and sovereign regulatory compliance.'
  },
  industries: {
    tag: 'Sector Specialization',
    title: 'Industries We Serve',
    desc: 'Domain-specific architectures addressing strict statutory requirements, legacy integration hurdles, and operational throughput.'
  },
  why: {
    tag: 'Engineering Governance & Standards',
    title: 'Why A8Fusion',
    desc: 'We stand apart through verifiable engineering standards, transparent architectural documentation, and disciplined execution across all international engagements.'
  },
  approach: {
    tag: 'Disciplined Lifecycle',
    title: 'Our Engineering Approach',
    desc: 'From requirement extraction to 24/7 Site Reliability Engineering, every project is governed by strict milestone gates.',
    bottomLinkText: 'Read Complete 8-Stage Governance Framework',
    bottomLinkUrl: '/company/our-approach'
  },
  global: {
    tag: 'International Delivery Mesh · Sovereign Corridors',
    title: 'Global Technology Infrastructure & Strategic Operations',
    desc: 'Coordinated international software engineering, cross-border regulatory compliance, and sovereign technology governance across Singapore, the UAE, and the United Kingdom.'
  },
  insights: {
    tag: 'Knowledge & Executive Analysis',
    title: 'Latest Enterprise Insights',
    desc: 'Executive analysis, sovereign technology frameworks, and architecture whitepapers authored by our principal engineers.',
    ctaText: 'Explore All Insights',
    ctaLink: '/insights'
  },
  cta: {
    tag: 'START AN INSTITUTIONAL ENGAGEMENT',
    title: "Let's Engineer What's Next.",
    desc: 'Whether your organization requires a resilient multi-tenant ERP core, sovereign on-premise AI assistants, or cross-border systems integration, our principal systems architects are prepared to evaluate your technical requirements.',
    primaryText: 'Discuss an Enterprise Project',
    primaryLink: '/request-project',
    secondaryText: 'Start a Conversation',
    secondaryLink: '/contact'
  }
};

const foundationColorStyles = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' }
};

const pillarColorStyles = {
  indigo: { border: 'border-indigo-800/60', bg: 'bg-indigo-950/80', text: 'text-indigo-400' },
  blue: { border: 'border-blue-800/60', bg: 'bg-blue-950/80', text: 'text-blue-400' },
  purple: { border: 'border-purple-800/60', bg: 'bg-purple-950/80', text: 'text-purple-400' },
  emerald: { border: 'border-emerald-800/60', bg: 'bg-emerald-950/80', text: 'text-emerald-400' },
  cyan: { border: 'border-cyan-800/60', bg: 'bg-cyan-950/80', text: 'text-cyan-400' },
  amber: { border: 'border-amber-800/60', bg: 'bg-amber-950/80', text: 'text-amber-400' }
};

const facilityBadgeStyles = {
  cyan: 'text-cyan-300',
  indigo: 'text-indigo-300',
  emerald: 'text-emerald-300',
  purple: 'text-purple-300',
  blue: 'text-blue-300'
};

const iconMap = {
  Server, Cpu, Database, Lock, Workflow, Boxes, Layers, Building2, Globe2, ShieldCheck, BarChart3, Users2, FileText, Code2, Network, Landmark, UserCheck, Handshake, Activity, Terminal
};

export default function HomePage() {
  const [activeLifecycleStep, setActiveLifecycleStep] = useState(1);
  const videoRef = useRef(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isLiveEditParam = searchParams.get('live_edit') === 'true';

  // Live Editor State
  const [editMode, setEditMode] = useState(isLiveEditParam);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dynamic Content State - All 10 Sections
  const [heroScenes, setHeroScenes] = useState(DEFAULT_HERO_SCENES);
  const [foundationCards, setFoundationCards] = useState(DEFAULT_FOUNDATION_CARDS);
  const [facilityCards, setFacilityCards] = useState(DEFAULT_FACILITY_CARDS);
  const [coreTechnologies, setCoreTechnologies] = useState(DEFAULT_CORE_TECHNOLOGIES);
  const [enterpriseSolutionsList, setEnterpriseSolutionsList] = useState(DEFAULT_SOLUTIONS);
  const [industriesList, setIndustriesList] = useState(DEFAULT_INDUSTRIES);
  const [whyA8FusionPoints, setWhyA8FusionPoints] = useState(DEFAULT_WHY_POINTS);
  const [lifecycleStagesList, setLifecycleStagesList] = useState(DEFAULT_LIFECYCLE_STAGES);
  const [globalPillars, setGlobalPillars] = useState(DEFAULT_GLOBAL_PILLARS);
  const [insightsList, setInsightsList] = useState(DEFAULT_INSIGHTS);
  const [sectionHeadings, setSectionHeadings] = useState(DEFAULT_SECTION_HEADINGS);

  // Modal State for CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch Live Content from Backend or Cache
  useEffect(() => {
    async function loadData() {
      try {
        const cached = localStorage.getItem('a8_live_home_content');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.heroScenes) setHeroScenes(parsed.heroScenes);
          if (parsed.foundationCards) setFoundationCards(parsed.foundationCards);
          if (parsed.facilityCards) setFacilityCards(parsed.facilityCards);
          if (parsed.coreTechnologies) setCoreTechnologies(parsed.coreTechnologies);
          if (parsed.enterpriseSolutionsList) setEnterpriseSolutionsList(parsed.enterpriseSolutionsList);
          if (parsed.industriesList && parsed.industriesList.length >= DEFAULT_INDUSTRIES.length) {
            setIndustriesList(parsed.industriesList);
          } else {
            setIndustriesList(DEFAULT_INDUSTRIES);
          }
          if (parsed.whyA8FusionPoints) setWhyA8FusionPoints(parsed.whyA8FusionPoints);
          if (parsed.lifecycleStagesList) setLifecycleStagesList(parsed.lifecycleStagesList);
          if (parsed.globalPillars) setGlobalPillars(parsed.globalPillars);
          if (parsed.insightsList) {
            setInsightsList(parsed.insightsList.map(item => {
              if (item.slug === 'private-on-premise-llm-deployment') {
                return { ...item, coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80' };
              }
              return item;
            }));
          }
          if (parsed.sectionHeadings) setSectionHeadings(prev => ({ ...prev, ...parsed.sectionHeadings }));
        }

        const res = await fetch('http://127.0.0.1:8000/api/pages/get_live_content/?slug=home');
        if (res.ok) {
          const json = await res.json();
          if (json && json.live_data && Object.keys(json.live_data).length > 0) {
            const ld = json.live_data;
            if (ld.heroScenes) setHeroScenes(ld.heroScenes);
            if (ld.foundationCards) setFoundationCards(ld.foundationCards);
            if (ld.facilityCards) setFacilityCards(ld.facilityCards);
            if (ld.coreTechnologies) setCoreTechnologies(ld.coreTechnologies);
            if (ld.enterpriseSolutionsList) setEnterpriseSolutionsList(ld.enterpriseSolutionsList);
            if (ld.industriesList && ld.industriesList.length >= DEFAULT_INDUSTRIES.length) {
              setIndustriesList(ld.industriesList);
            } else if (!ld.industriesList) {
              setIndustriesList(DEFAULT_INDUSTRIES);
            }
            if (ld.whyA8FusionPoints) setWhyA8FusionPoints(ld.whyA8FusionPoints);
            if (ld.lifecycleStagesList) setLifecycleStagesList(ld.lifecycleStagesList);
            if (ld.globalPillars) setGlobalPillars(ld.globalPillars);
            if (ld.insightsList) {
              setInsightsList(ld.insightsList.map(item => {
                if (item.slug === 'private-on-premise-llm-deployment') {
                  return { ...item, coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80' };
                }
                return item;
              }));
            }
            if (ld.sectionHeadings) setSectionHeadings(prev => ({ ...prev, ...ld.sectionHeadings }));
            localStorage.setItem('a8_live_home_content', JSON.stringify(ld));
          }
        }
      } catch (err) {
        console.warn('Backend live data not reachable, using local state', err);
      }
    }
    loadData();
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || (editMode && !previewMode)) return;
    const time = videoRef.current.currentTime;
    const sceneIndex = heroScenes.findIndex((s) => time >= s.startTime && time < s.endTime);
    if (sceneIndex !== -1 && sceneIndex !== activeSceneIndex) {
      setActiveSceneIndex(sceneIndex);
    }
  };

  const currentScene = heroScenes[activeSceneIndex] || heroScenes[0] || DEFAULT_HERO_SCENES[0];

  // =========================================================================
  // LIVE EDITOR CRUD HANDLERS
  // =========================================================================

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      heroScenes,
      foundationCards,
      facilityCards,
      coreTechnologies,
      enterpriseSolutionsList,
      industriesList,
      whyA8FusionPoints,
      lifecycleStagesList,
      globalPillars,
      insightsList,
      sectionHeadings
    };

    try {
      localStorage.setItem('a8_live_home_content', JSON.stringify(payload));
      const res = await fetch('http://127.0.0.1:8000/api/pages/save_live_content/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('a8_admin_token') ? { 'Authorization': `Token ${localStorage.getItem('a8_admin_token')}` } : {})
        },
        body: JSON.stringify({ slug: 'home', live_data: payload })
      });

      if (res.ok) {
        setIsDirty(false);
        alert('Home Page live visual changes permanently saved and published!');
      } else {
        alert('Changes saved locally.');
      }
    } catch (err) {
      console.error(err);
      alert('Saved to local storage.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Restore Home Page content back to factory institutional defaults?')) return;
    setHeroScenes(DEFAULT_HERO_SCENES);
    setFoundationCards(DEFAULT_FOUNDATION_CARDS);
    setFacilityCards(DEFAULT_FACILITY_CARDS);
    setCoreTechnologies(DEFAULT_CORE_TECHNOLOGIES);
    setEnterpriseSolutionsList(DEFAULT_SOLUTIONS);
    setIndustriesList(DEFAULT_INDUSTRIES);
    setWhyA8FusionPoints(DEFAULT_WHY_POINTS);
    setLifecycleStagesList(DEFAULT_LIFECYCLE_STAGES);
    setGlobalPillars(DEFAULT_GLOBAL_PILLARS);
    setInsightsList(DEFAULT_INSIGHTS);
    setSectionHeadings(DEFAULT_SECTION_HEADINGS);
    localStorage.removeItem('a8_live_home_content');
    setIsDirty(true);
  };

  const handleExitEditor = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Discard and return to Admin Dashboard?')) return;
    }
    navigate('/admin');
  };

  // --- Core Technology CRUD ---
  const openEditTech = (tech, idx) => {
    setModalType('tech');
    setModalTitle(`Edit Capability: ${tech.title}`);
    setModalData({ ...tech });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddTech = () => {
    setModalType('tech');
    setModalTitle('Add New Core Technology Capability');
    setModalData({
      id: `tech-${Date.now()}`,
      title: '',
      desc: '',
      link: '/services',
      tag: 'Specialized Discipline'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteTech = (id, title) => {
    if (!window.confirm(`Delete capability card "${title}"?`)) return;
    setCoreTechnologies(prev => prev.filter(t => t.id !== id));
    setIsDirty(true);
  };

  // --- Enterprise Solutions CRUD ---
  const openEditSolution = (sol, idx) => {
    setModalType('solution');
    setModalTitle(`Edit Platform: ${sol.title}`);
    setModalData({ ...sol });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddSolution = () => {
    setModalType('solution');
    setModalTitle('Add New Enterprise Software Platform');
    setModalData({
      id: `solution-${Date.now()}`,
      title: '',
      slug: 'enterprise-platform',
      badge: 'Core System',
      desc: ''
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteSolution = (id, title) => {
    if (!window.confirm(`Delete platform card "${title}"?`)) return;
    setEnterpriseSolutionsList(prev => prev.filter(s => s.id !== id));
    setIsDirty(true);
  };

  // --- Why A8Fusion CRUD ---
  const openEditWhy = (why, idx) => {
    setModalType('why');
    setModalTitle(`Edit Value Point: ${why.title}`);
    setModalData({ ...why });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddWhy = () => {
    setModalType('why');
    setModalTitle('Add New Value Proposition');
    const nextNum = String(whyA8FusionPoints.length + 1).padStart(2, '0');
    setModalData({
      num: nextNum,
      title: '',
      tag: 'Institutional Governance',
      desc: ''
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteWhy = (idx, title) => {
    if (!window.confirm(`Delete value proposition "${title || idx + 1}"?`)) return;
    setWhyA8FusionPoints(prev => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  // --- Hero Scene CRUD ---
  const openEditScene = (idx) => {
    const sc = heroScenes[idx] || heroScenes[0];
    setModalType('scene');
    setModalTitle(`Edit Hero Narrative Chapter 0${idx + 1}`);
    setModalData({
      ...sc,
      primaryText: sc.primaryCta?.text || '',
      primaryLink: sc.primaryCta?.link || '',
      secondaryText: sc.secondaryCta?.text || '',
      secondaryLink: sc.secondaryCta?.link || '',
    });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddScene = () => {
    setModalType('scene');
    setModalTitle('Add New Hero Narrative Scene');
    const stepNum = String(heroScenes.length + 1).padStart(2, '0');
    setModalData({
      id: `scene-${Date.now()}`,
      step: stepNum,
      startTime: heroScenes.length * 5,
      endTime: (heroScenes.length + 1) * 5,
      tag: 'STRATEGIC DELIVERY // GLOBAL',
      title: 'Architected for Scale.',
      titleHighlight: 'Built to Last.',
      description: 'Enter mission-critical narrative copy...',
      metricLabel: 'Performance SLA',
      metricValue: '99.999% SLA',
      primaryText: 'Explore Solutions',
      primaryLink: '/solutions',
      secondaryText: 'Contact Engineers',
      secondaryLink: '/contact'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteScene = (idx) => {
    if (heroScenes.length <= 1) {
      alert('Must retain at least one hero narrative chapter.');
      return;
    }
    if (!window.confirm(`Delete Hero Chapter 0${idx + 1}?`)) return;
    setHeroScenes(prev => prev.filter((_, i) => i !== idx));
    setActiveSceneIndex(0);
    setIsDirty(true);
  };

  // --- Company Intro & Foundation CRUD ---
  const openEditCompanyIntro = () => {
    setModalType('companyIntro');
    setModalTitle('Edit Company Introduction Section');
    setModalData({ ...sectionHeadings.companyIntro });
    setModalOpen(true);
  };

  const openEditFacilitiesHeader = () => {
    setModalType('facilitiesHeader');
    setModalTitle('Edit Operational Facilities Header');
    setModalData({ ...sectionHeadings.facilities });
    setModalOpen(true);
  };

  const openEditFoundation = (card, idx) => {
    setModalType('foundation');
    setModalTitle(`Edit Foundation Card: ${card.title}`);
    setModalData({ ...card });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddFoundation = () => {
    setModalType('foundation');
    setModalTitle('Add New Foundation Pillar');
    setModalData({
      id: `fnd-${Date.now()}`,
      title: '',
      desc: '',
      iconName: 'Server',
      color: 'indigo'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteFoundation = (id, title) => {
    if (!window.confirm(`Delete foundation card "${title}"?`)) return;
    setFoundationCards(prev => prev.filter(c => c.id !== id));
    setIsDirty(true);
  };

  const openEditFacility = (card, idx) => {
    setModalType('facility');
    setModalTitle(`Edit Facility: ${card.title}`);
    setModalData({ ...card });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddFacility = () => {
    setModalType('facility');
    setModalTitle('Add Photographic Facility Node');
    setModalData({
      id: `fac-${Date.now()}`,
      title: '',
      badge: 'Operational Facility Node',
      badgeColor: 'cyan',
      desc: '',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteFacility = (id, title) => {
    if (!window.confirm(`Delete facility node "${title}"?`)) return;
    setFacilityCards(prev => prev.filter(c => c.id !== id));
    setIsDirty(true);
  };

  // --- Industries We Serve CRUD ---
  const openEditIndustry = (ind, idx) => {
    setModalType('industry');
    setModalTitle(`Edit Sector Architecture: ${ind.title}`);
    setModalData({ ...ind });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddIndustry = () => {
    setModalType('industry');
    setModalTitle('Add New Sector Architecture');
    setModalData({
      id: `ind-${Date.now()}`,
      slug: 'enterprise-sector',
      title: '',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      overview: '',
      link: '/industries'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteIndustry = (id, title) => {
    if (!window.confirm(`Delete sector architecture "${title}"?`)) return;
    setIndustriesList(prev => prev.filter(i => i.id !== id));
    setIsDirty(true);
  };

  // --- Our Engineering Approach CRUD ---
  const openEditApproachHeader = () => {
    setModalType('approachHeader');
    setModalTitle('Edit Engineering Approach Section');
    setModalData({ ...sectionHeadings.approach });
    setModalOpen(true);
  };

  const openEditStage = (stg, idx) => {
    setModalType('stage');
    setModalTitle(`Edit Stage 0${stg.step}: ${stg.name}`);
    setModalData({
      ...stg,
      deliverablesText: Array.isArray(stg.deliverables) ? stg.deliverables.join('\n') : (stg.deliverables || '')
    });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddStage = () => {
    setModalType('stage');
    setModalTitle('Add New Lifecycle Stage');
    const nextStep = lifecycleStagesList.length + 1;
    setModalData({
      step: nextStep,
      name: `Phase ${nextStep}`,
      phase: `Stage 0${nextStep}: Lifecycle Gate`,
      summary: 'Domain governance and audit controls...',
      deliverablesText: 'Functional Specification Deliverable\nSecurity Audit Sign-Off'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteStage = (step, name) => {
    if (lifecycleStagesList.length <= 1) {
      alert('Must retain at least one lifecycle stage.');
      return;
    }
    if (!window.confirm(`Delete lifecycle stage 0${step}: "${name}"?`)) return;
    setLifecycleStagesList(prev => prev.filter(s => s.step !== step));
    setActiveLifecycleStep(1);
    setIsDirty(true);
  };

  // --- Global Technology Infrastructure CRUD ---
  const openEditGlobalPillar = (pillar, idx) => {
    setModalType('globalPillar');
    setModalTitle(`Edit Strategic Pillar: ${pillar.num}`);
    setModalData({ ...pillar });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddGlobalPillar = () => {
    setModalType('globalPillar');
    setModalTitle('Add Strategic Operational Pillar');
    const num = `${globalPillars.length + 1}. Operational Capability`;
    setModalData({
      id: `pillar-${Date.now()}`,
      num,
      iconName: 'ShieldCheck',
      color: 'indigo',
      desc: '',
      badge: 'Tier-IV Consortium Guarantee'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteGlobalPillar = (id, num) => {
    if (!window.confirm(`Delete strategic pillar "${num}"?`)) return;
    setGlobalPillars(prev => prev.filter(p => p.id !== id));
    setIsDirty(true);
  };

  // --- Latest Enterprise Insights CRUD ---
  const openEditInsightsHeader = () => {
    setModalType('insightsHeader');
    setModalTitle('Edit Insights Section Header');
    setModalData({ ...sectionHeadings.insights });
    setModalOpen(true);
  };

  const openEditInsight = (art, idx) => {
    setModalType('insight');
    setModalTitle(`Edit Insight Article: ${art.title}`);
    setModalData({
      ...art,
      authorName: art.author?.name || 'A8Fusion Principal Architect',
      authorAvatar: art.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    });
    setEditingIndex(idx);
    setModalOpen(true);
  };

  const openAddInsight = () => {
    setModalType('insight');
    setModalTitle('Add Executive Insight Article');
    setModalData({
      id: `ins-${Date.now()}`,
      slug: `insight-${Date.now()}`,
      title: '',
      category: 'Executive Briefing',
      readTime: '6 min read',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      excerpt: '',
      authorName: 'Principal Systems Architect',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleDeleteInsight = (id, title) => {
    if (!window.confirm(`Delete insight article "${title}"?`)) return;
    setInsightsList(prev => prev.filter(a => a.id !== id));
    setIsDirty(true);
  };

  // --- Section Headings CRUD ---
  const openEditHeading = (sectionKey, displayTitle) => {
    setModalType('heading');
    setModalTitle(`Edit Section Header: ${displayTitle}`);
    setModalData({
      sectionKey,
      tag: sectionHeadings[sectionKey]?.tag || '',
      title: sectionHeadings[sectionKey]?.title || '',
      desc: sectionHeadings[sectionKey]?.desc || ''
    });
    setModalOpen(true);
  };

  // --- Final CTA CRUD ---
  const openEditCta = () => {
    setModalType('cta');
    setModalTitle('Edit Pre-Footer Call to Action Banner');
    setModalData({ ...sectionHeadings.cta });
    setModalOpen(true);
  };

  // Modal Submit Handlers
  const handleModalSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'tech') {
      if (editingIndex !== null) {
        setCoreTechnologies(prev => prev.map((t, i) => i === editingIndex ? modalData : t));
      } else {
        setCoreTechnologies(prev => [...prev, modalData]);
      }
    } else if (modalType === 'solution') {
      if (editingIndex !== null) {
        setEnterpriseSolutionsList(prev => prev.map((s, i) => i === editingIndex ? modalData : s));
      } else {
        setEnterpriseSolutionsList(prev => [...prev, modalData]);
      }
    } else if (modalType === 'why') {
      if (editingIndex !== null) {
        setWhyA8FusionPoints(prev => prev.map((w, i) => i === editingIndex ? modalData : w));
      } else {
        setWhyA8FusionPoints(prev => [...prev, modalData]);
      }
    } else if (modalType === 'scene') {
      const formattedScene = {
        id: modalData.id || `scene-${Date.now()}`,
        step: modalData.step,
        startTime: modalData.startTime || 0,
        endTime: modalData.endTime || 5,
        tag: modalData.tag,
        title: modalData.title,
        titleHighlight: modalData.titleHighlight,
        description: modalData.description,
        metricLabel: modalData.metricLabel,
        metricValue: modalData.metricValue,
        primaryCta: { text: modalData.primaryText, link: modalData.primaryLink },
        secondaryCta: { text: modalData.secondaryText, link: modalData.secondaryLink }
      };

      if (editingIndex !== null) {
        setHeroScenes(prev => prev.map((sc, i) => i === editingIndex ? formattedScene : sc));
      } else {
        setHeroScenes(prev => [...prev, formattedScene]);
      }
    } else if (modalType === 'heading') {
      const { sectionKey, tag, title, desc } = modalData;
      setSectionHeadings(prev => ({
        ...prev,
        [sectionKey]: { ...(prev[sectionKey] || {}), tag, title, desc }
      }));
    } else if (modalType === 'cta') {
      setSectionHeadings(prev => ({
        ...prev,
        cta: modalData
      }));
    } else if (modalType === 'companyIntro') {
      setSectionHeadings(prev => ({
        ...prev,
        companyIntro: modalData
      }));
    } else if (modalType === 'facilitiesHeader') {
      setSectionHeadings(prev => ({
        ...prev,
        facilities: modalData
      }));
    } else if (modalType === 'approachHeader') {
      setSectionHeadings(prev => ({
        ...prev,
        approach: modalData
      }));
    } else if (modalType === 'insightsHeader') {
      setSectionHeadings(prev => ({
        ...prev,
        insights: modalData
      }));
    } else if (modalType === 'foundation') {
      if (editingIndex !== null) {
        setFoundationCards(prev => prev.map((c, i) => i === editingIndex ? modalData : c));
      } else {
        setFoundationCards(prev => [...prev, modalData]);
      }
    } else if (modalType === 'facility') {
      if (editingIndex !== null) {
        setFacilityCards(prev => prev.map((c, i) => i === editingIndex ? modalData : c));
      } else {
        setFacilityCards(prev => [...prev, modalData]);
      }
    } else if (modalType === 'industry') {
      if (editingIndex !== null) {
        setIndustriesList(prev => prev.map((ind, i) => i === editingIndex ? modalData : ind));
      } else {
        setIndustriesList(prev => [...prev, modalData]);
      }
    } else if (modalType === 'stage') {
      const deliverables = (modalData.deliverablesText || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const formattedStage = {
        step: Number(modalData.step) || (editingIndex !== null ? lifecycleStagesList[editingIndex].step : lifecycleStagesList.length + 1),
        name: modalData.name,
        phase: modalData.phase,
        summary: modalData.summary,
        deliverables: deliverables.length > 0 ? deliverables : ['Sovereign Milestone Verification']
      };
      if (editingIndex !== null) {
        setLifecycleStagesList(prev => prev.map((s, i) => i === editingIndex ? formattedStage : s));
      } else {
        setLifecycleStagesList(prev => [...prev, formattedStage]);
      }
    } else if (modalType === 'globalPillar') {
      if (editingIndex !== null) {
        setGlobalPillars(prev => prev.map((p, i) => i === editingIndex ? modalData : p));
      } else {
        setGlobalPillars(prev => [...prev, modalData]);
      }
    } else if (modalType === 'insight') {
      const formattedArt = {
        id: modalData.id || `ins-${Date.now()}`,
        slug: modalData.slug || `insight-${Date.now()}`,
        title: modalData.title,
        category: modalData.category || 'Executive Analysis',
        readTime: modalData.readTime || '5 min read',
        coverImage: modalData.coverImage,
        excerpt: modalData.excerpt,
        author: {
          name: modalData.authorName || 'Principal Systems Architect',
          avatar: modalData.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        }
      };
      if (editingIndex !== null) {
        setInsightsList(prev => prev.map((a, i) => i === editingIndex ? formattedArt : a));
      } else {
        setInsightsList(prev => [...prev, formattedArt]);
      }
    }

    setIsDirty(true);
    setModalOpen(false);
  };

  const isLiveActive = editMode && !previewMode;

  return (
    <div className={`bg-[#F8FAFC] text-slate-900 ${editMode ? 'pt-10' : ''}`}>
      {/* FLOATING TOPBAR FOR LIVE IN-CONTEXT VISUAL EDITOR */}
      {editMode && (
        <LiveEditorToolbar
          pageName="Home Page (/)"
          isDirty={isDirty}
          saving={saving}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onReset={handleResetDefaults}
          onSave={handleSaveAll}
          onExit={handleExitEditor}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: CINEMATIC VIDEO HERO SECTION (Dynamic Scene Synchronization)    */}
      {/* ========================================================================= */}
      <section className="relative min-h-[80vh] lg:min-h-[88vh] flex items-center bg-[#070D18] text-white overflow-hidden border-b border-slate-800 py-16 sm:py-20 lg:py-24">
        {/* Full-Bleed Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src="/hero_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "none", transform: "translateZ(0)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/75 via-[#070D18]/35 via-45% to-transparent to-60%" />
        </div>

        {/* Center: Dynamic Changing Content Directly Over Video */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Live Editor Scene Controller Pill Bar */}
          {isLiveActive && (
            <div className="mb-6 p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cyan-300 uppercase font-bold tracking-wider">
                  Hero Scene:
                </span>
                <div className="flex items-center gap-1">
                  {heroScenes.map((s, idx) => (
                    <button
                      key={s.id || idx}
                      type="button"
                      onClick={() => setActiveSceneIndex(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        activeSceneIndex === idx
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Scene 0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditScene(activeSceneIndex)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Scene 0{activeSceneIndex + 1}</span>
                </button>
                <button
                  type="button"
                  onClick={openAddScene}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono cursor-pointer"
                  title="Add new scene chapter"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Scene</span>
                </button>
                {heroScenes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteScene(activeSceneIndex)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 border border-slate-700 cursor-pointer"
                    title="Delete current scene"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-w-3xl space-y-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
            {/* Animated Scene Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-100 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-cyan-300 font-mono tracking-widest uppercase font-bold text-[11px]">
                {currentScene.tag}
              </span>
            </div>

            {/* Exact Spec Headline with Times New Roman & Dynamic Transition */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-white tracking-tight leading-[1.12] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {currentScene.title} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-100 to-white drop-shadow">
                {currentScene.titleHighlight}
              </span>
            </h1>

            {/* Dynamic Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-sans max-w-2xl font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {currentScene.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={currentScene.primaryCta?.link || '/solutions'}
                className="px-7 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/40 active:scale-95 flex items-center gap-2 group"
              >
                <span>{currentScene.primaryCta?.text || 'Explore Our Solutions'}</span>
                <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to={currentScene.secondaryCta?.link || '/request-project'}
                className="px-7 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-600 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow"
              >
                <span>{currentScene.secondaryCta?.text || 'Discuss Your Project'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </Link>
            </div>

            {/* Telemetry Metric Strip */}
            <div className="pt-5 border-t border-white/15 flex flex-wrap items-center gap-6 text-left">
              <div>
                <div className="text-[10px] text-cyan-300 uppercase tracking-widest font-mono font-semibold">
                  {currentScene.metricLabel}
                </div>
                <div className="text-sm font-semibold text-white font-mono mt-0.5 drop-shadow">
                  {currentScene.metricValue}
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div>
                <div className="text-[10px] text-slate-300 uppercase tracking-widest font-mono">
                  Delivery Governance
                </div>
                <div className="text-sm font-semibold text-white font-mono mt-0.5 drop-shadow">
                  SIAC / LCIA Enforceable MSAs
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20"></div>
              <div>
                <div className="text-[10px] text-slate-300 uppercase tracking-widest font-mono">
                  Security Standard
                </div>
                <div className="text-sm font-semibold text-white font-mono mt-0.5 drop-shadow">
                  ISO/IEC 27001 Aligned
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: COMPANY INTRODUCTION (CRUD-Enabled)                             */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4 relative">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  {sectionHeadings.companyIntro?.tag || 'Corporate Foundations'}
                </span>
                {isLiveActive && (
                  <SectionHeaderEditButton onClick={openEditCompanyIntro} label="Edit Intro" />
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
                {sectionHeadings.companyIntro?.title || 'Technology Built for Complex Business Challenges.'}
              </h2>
              <div className="w-16 h-1 bg-indigo-600 rounded"></div>
              <p className="text-sm text-slate-600 font-sans leading-relaxed pt-2 text-justify">
                {sectionHeadings.companyIntro?.desc || 'A8Fusion operates as an independent international technology corporation engineered specifically for mission-critical enterprise platforms and sovereign government initiatives. We bridge complex organizational workflows, strict regulatory compliance, and multi-region business operations into unified, dependable digital systems.'}
              </p>
              <div className="pt-2">
                <Link
                  to={sectionHeadings.companyIntro?.ctaLink || '/company/about'}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 group"
                >
                  <span>{sectionHeadings.companyIntro?.ctaText || 'Discover A8Fusion'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {foundationCards.map((card, idx) => {
                const IconComponent = iconMap[card.iconName] || Server;
                const col = foundationColorStyles[card.color] || foundationColorStyles.indigo;
                return (
                  <div key={card.id || idx} className="p-6 rounded-xl bg-slate-50 border border-slate-200 card-hover-foundation relative">
                    {isLiveActive && (
                      <CardActionOverlay
                        title="Foundation Card"
                        onEdit={() => openEditFoundation(card, idx)}
                        onDelete={() => handleDeleteFoundation(card.id, card.title)}
                      />
                    )}
                    <div className={`w-9 h-9 rounded-lg ${col.bg} ${col.text} flex items-center justify-center mb-4 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 font-serif">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {card.desc}
                    </p>
                  </div>
                );
              })}

              {isLiveActive && (
                <AddCardButton
                  onClick={openAddFoundation}
                  label="Add Foundation Pillar"
                  subtitle="Add another foundational capability card"
                />
              )}
            </div>
          </div>

          {/* Institutional Operational Photographic Showcase (CRUD-Enabled) */}
          <div className="mt-14 pt-12 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">
                  {sectionHeadings.facilities?.tag || 'Operational Realities // Verified Facilities'}
                </span>
                {isLiveActive && (
                  <SectionHeaderEditButton onClick={openEditFacilitiesHeader} label="Edit Header" />
                )}
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">
                {sectionHeadings.facilities?.title || 'Mission-Critical Infrastructure Across Strategic Corridors'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {facilityCards.map((card, idx) => {
                const badgeColorClass = facilityBadgeStyles[card.badgeColor] || 'text-cyan-300';
                return (
                  <div key={card.id || idx} className="group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 card-hover-facility transition-all relative">
                    {isLiveActive && (
                      <CardActionOverlay
                        title="Facility Node"
                        onEdit={() => openEditFacility(card, idx)}
                        onDelete={() => handleDeleteFacility(card.id, card.title)}
                      />
                    )}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={card.image}
                        alt={`A8Fusion ${card.title} Operational Node`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <span className={`absolute bottom-3 left-4 text-[10px] font-mono ${badgeColorClass} font-semibold uppercase tracking-wider`}>
                        {card.badge}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-900 font-serif">{card.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}

              {isLiveActive && (
                <AddCardButton
                  onClick={openAddFacility}
                  label="Add Facility Node"
                  subtitle="Add operational facility photographic card"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CORE TECHNOLOGY CAPABILITIES (CRUD-Enabled)                     */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {sectionHeadings.tech.tag}
              </span>
              {isLiveActive && (
                <SectionHeaderEditButton onClick={() => openEditHeading('tech', 'Core Technology Capabilities')} />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {sectionHeadings.tech.title}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {sectionHeadings.tech.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreTechnologies.map((cap, idx) => {
              const IconComp = iconMap[cap.iconName] || cap.icon || Server;
              return (
                <div
                  key={cap.id || idx}
                  className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 card-hover-tech flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Visual Editor Hover Actions */}
                  {isLiveActive && (
                    <CardActionOverlay
                      title="Capability Card"
                      onEdit={() => openEditTech(cap, idx)}
                      onDelete={() => handleDeleteTech(cap.id, cap.title)}
                    />
                  )}

                  {/* Ambient corner glow */}
                  <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-indigo-100/40 via-indigo-50/20 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-indigo-200/50 group-hover:scale-125 transition-all duration-500" />

                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-white border border-indigo-100/80 text-indigo-700 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-indigo-50/90 text-indigo-700 border border-indigo-200/70 shadow-xs group-hover:border-indigo-300 transition-colors">
                        {cap.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {cap.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans pt-2">
                        {cap.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 relative z-10 flex items-center justify-between">
                    <Link
                      to={cap.link || '/services'}
                      className="text-xs font-bold uppercase tracking-wider text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1.5"
                    >
                      <span>Explore Capability</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 font-semibold tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      ACTIVE
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Live Editor + Add Button */}
            {isLiveActive && (
              <AddCardButton
                label="Add Capability Card"
                subtitle="Insert new engineering discipline into this section"
                onClick={openAddTech}
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: ENTERPRISE SOLUTIONS (CRUD-Enabled)                             */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  {sectionHeadings.solutions.tag}
                </span>
                {isLiveActive && (
                  <SectionHeaderEditButton onClick={() => openEditHeading('solutions', 'Enterprise Platforms')} />
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
                {sectionHeadings.solutions.title}
              </h2>
              <p className="text-sm text-slate-600 font-sans">
                {sectionHeadings.solutions.desc}
              </p>
            </div>

            <Link
              to="/solutions"
              className="px-5 py-2.5 rounded-lg border border-slate-300 hover:border-indigo-600 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-indigo-600 transition-colors self-start md:self-end flex items-center gap-2"
            >
              <span>Explore All Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseSolutionsList.map((sol, idx) => {
              const IconComp = iconMap[sol.iconName] || sol.icon || Layers;
              return (
                <div
                  key={sol.id || idx}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 card-hover-platform flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Visual Editor Hover Actions */}
                  {isLiveActive && (
                    <CardActionOverlay
                      title="Platform Card"
                      onEdit={() => openEditSolution(sol, idx)}
                      onDelete={() => handleDeleteSolution(sol.id, sol.title)}
                    />
                  )}

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-slate-200/80 text-indigo-700 flex items-center justify-center shadow-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 group-hover:scale-105 transition-all duration-300">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/90 border border-indigo-200/70 px-2.5 py-1 rounded-full shadow-xs">
                        {sol.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {sol.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans mt-2">
                        {sol.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 relative z-10 flex items-center justify-between">
                    <Link
                      to={`/solutions/${sol.slug}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group/link"
                    >
                      <span>View Architecture</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">
                      SOVEREIGN
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Live Editor + Add Button */}
            {isLiveActive && (
              <AddCardButton
                label="Add Enterprise Platform"
                subtitle="Create a new platform card"
                onClick={openAddSolution}
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: INDUSTRIES WE SERVE (CRUD-Enabled)                              */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#0B172A] text-white border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
                {sectionHeadings.industries?.tag || 'Sector Specialization'}
              </span>
              {isLiveActive && (
                <SectionHeaderEditButton onClick={() => openEditHeading('industries', 'Industries We Serve')} />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">
              {sectionHeadings.industries?.title || 'Industries We Serve'}
            </h2>
            <p className="text-sm text-slate-300 font-sans">
              {sectionHeadings.industries?.desc || 'Domain-specific architectures addressing strict statutory requirements, legacy integration hurdles, and operational throughput.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industriesList.map((ind, idx) => (
              <div
                key={ind.id || idx}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 card-hover-industry flex flex-col justify-between group overflow-hidden relative"
              >
                {isLiveActive && (
                  <CardActionOverlay
                    title="Sector Architecture"
                    onEdit={() => openEditIndustry(ind, idx)}
                    onDelete={() => handleDeleteIndustry(ind.id, ind.title)}
                  />
                )}
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={ind.image}
                      alt={`A8Fusion ${ind.title} Enterprise Sector Platform`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                        Sector Architecture
                      </span>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-indigo-300 transition-colors drop-shadow">
                        {ind.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {ind.overview}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/80 mt-2 pt-4 flex items-center justify-between">
                  <Link
                    to={ind.link || (ind.id === 'government' ? '/government' : `/industries/${ind.slug}`)}
                    className="text-xs font-bold uppercase tracking-wider text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1.5"
                  >
                    <span>Sector Solutions</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}

            {isLiveActive && (
              <AddCardButton
                onClick={openAddIndustry}
                label="Add Sector"
                subtitle="Add new industry domain architecture"
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: WHY A8FUSION (CRUD-Enabled)                                     */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {sectionHeadings.why.tag}
              </span>
              {isLiveActive && (
                <SectionHeaderEditButton onClick={() => openEditHeading('why', 'Why A8Fusion')} />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900">
              {sectionHeadings.why.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
              {sectionHeadings.why.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {whyA8FusionPoints.map((item, idx) => {
              const IconComp = iconMap[item.iconName] || item.icon || Cpu;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 sm:p-9 border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-400 card-hover-governance flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Visual Editor Hover Actions */}
                  {isLiveActive && (
                    <CardActionOverlay
                      title="Value Card"
                      onEdit={() => openEditWhy(item, idx)}
                      onDelete={() => handleDeleteWhy(idx, item.title)}
                    />
                  )}

                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-white border border-indigo-100/90 text-indigo-700 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest text-indigo-700 bg-indigo-50/90 border border-indigo-200/80 shadow-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                        STANDARD {item.num}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans pt-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-widest">
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/60 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>VERIFIED</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Editor + Add Button */}
            {isLiveActive && (
              <AddCardButton
                label="Add Value Proposition"
                subtitle="Insert new institutional standard"
                onClick={openAddWhy}
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: OUR APPROACH (CRUD-Enabled)                                     */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                {sectionHeadings.approach?.tag || 'Disciplined Lifecycle'}
              </span>
              {isLiveActive && (
                <SectionHeaderEditButton onClick={openEditApproachHeader} label="Edit Approach" />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              {sectionHeadings.approach?.title || 'Our Engineering Approach'}
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              {sectionHeadings.approach?.desc || 'From requirement extraction to 24/7 Site Reliability Engineering, every project is governed by strict milestone gates.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {lifecycleStagesList.map((stage) => (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveLifecycleStep(stage.step)}
                className={`p-3 min-w-[110px] rounded-lg text-center transition-all border cursor-pointer ${
                  activeLifecycleStep === stage.step
                    ? 'bg-[#0B172A] text-white border-[#0B172A] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase ${
                  activeLifecycleStep === stage.step ? 'text-indigo-400' : 'text-slate-400'
                }`}>
                  0{stage.step}
                </div>
                <div className="text-xs font-bold mt-0.5">{stage.name}</div>
              </button>
            ))}

            {isLiveActive && (
              <button
                type="button"
                onClick={openAddStage}
                className="p-3 min-w-[110px] rounded-lg text-center transition-all border-2 border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 cursor-pointer flex flex-col items-center justify-center gap-0.5"
                title="Add new lifecycle milestone stage"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold font-sans">+ Add Stage</span>
              </button>
            )}
          </div>

          {(() => {
            const currentIdx = lifecycleStagesList.findIndex(s => s.step === activeLifecycleStep);
            const safeIdx = currentIdx !== -1 ? currentIdx : 0;
            const currentStage = lifecycleStagesList[safeIdx] || lifecycleStagesList[0] || DEFAULT_LIFECYCLE_STAGES[0];
            return (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
                {isLiveActive && (
                  <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditStage(currentStage, safeIdx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Stage 0{currentStage.step}</span>
                    </button>
                    {lifecycleStagesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteStage(currentStage.step, currentStage.name)}
                        className="p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title={`Delete stage 0${currentStage.step}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
                    {currentStage.phase}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    Phase {currentStage.step}: {currentStage.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {currentStage.summary}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={sectionHeadings.approach?.bottomLinkUrl || '/company/our-approach'}
                      className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                    >
                      <span>{sectionHeadings.approach?.bottomLinkText || 'Read Complete 8-Stage Governance Framework'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold font-mono uppercase text-slate-700">
                    Mandatory Audit Deliverables
                  </div>
                  <ul className="space-y-2.5">
                    {(currentStage.deliverables || []).map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: GLOBAL TECHNOLOGY (CRUD-Enabled & 3D Responsive Mesh)           */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#050A15] text-white border-b border-slate-800 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-serif">
                {sectionHeadings.global?.tag || 'International Delivery Mesh · Sovereign Corridors'}
              </span>
              {isLiveActive && (
                <SectionHeaderEditButton onClick={() => openEditHeading('global', 'Global Technology Infrastructure')} />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white">
              {sectionHeadings.global?.title || 'Global Technology Infrastructure & Strategic Operations'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              {sectionHeadings.global?.desc || 'Coordinated international software engineering, cross-border regulatory compliance, and sovereign technology governance across Singapore, the UAE, and the United Kingdom.'}
            </p>
          </div>

          <GlobalGlobe3D />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {globalPillars.map((pillar, idx) => {
              const IconComponent = iconMap[pillar.iconName] || ShieldCheck;
              const col = pillarColorStyles[pillar.color] || pillarColorStyles.indigo;
              return (
                <div key={pillar.id || idx} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-xl relative">
                  {isLiveActive && (
                    <CardActionOverlay
                      title="Strategic Pillar"
                      onEdit={() => openEditGlobalPillar(pillar, idx)}
                      onDelete={() => handleDeleteGlobalPillar(pillar.id, pillar.num)}
                    />
                  )}
                  <div className={`flex items-center gap-2.5 ${col.text} font-serif font-bold text-base`}>
                    <div className={`p-2 rounded-lg ${col.bg} border ${col.border}`}>
                      <IconComponent className={`w-4 h-4 ${col.text}`} />
                    </div>
                    <span>{pillar.num}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                  {pillar.badge && (
                    <div className={`text-[11px] font-mono ${col.text} pt-1`}>
                      {pillar.badge}
                    </div>
                  )}
                </div>
              );
            })}

            {isLiveActive && (
              <AddCardButton
                onClick={openAddGlobalPillar}
                label="Add Pillar"
                subtitle="Add international strategic operation pillar"
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: INSIGHTS PREVIEW (CRUD-Enabled)                                 */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  {sectionHeadings.insights?.tag || 'Knowledge & Executive Analysis'}
                </span>
                {isLiveActive && (
                  <SectionHeaderEditButton onClick={openEditInsightsHeader} label="Edit Header" />
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
                {sectionHeadings.insights?.title || 'Latest Enterprise Insights'}
              </h2>
              <p className="text-sm text-slate-600 font-sans">
                {sectionHeadings.insights?.desc || 'Executive analysis, sovereign technology frameworks, and architecture whitepapers authored by our principal engineers.'}
              </p>
            </div>

            <Link
              to={sectionHeadings.insights?.ctaLink || '/insights'}
              className="px-5 py-2.5 rounded-lg border border-slate-300 hover:border-indigo-600 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-indigo-600 transition-colors self-start md:self-end flex items-center gap-2"
            >
              <span>{sectionHeadings.insights?.ctaText || 'Explore All Insights'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insightsList.map((article, idx) => (
              <article
                key={article.id || idx}
                className="bg-white rounded-2xl border border-slate-200 card-hover-editorial flex flex-col justify-between group overflow-hidden relative"
              >
                {isLiveActive && (
                  <CardActionOverlay
                    title="Insight Card"
                    onEdit={() => openEditInsight(article, idx)}
                    onDelete={() => handleDeleteInsight(article.id, article.title)}
                  />
                )}
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={`${article.title} - A8Fusion Executive Insight Briefing`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white font-mono">
                      <span className="bg-indigo-600/90 text-white font-bold uppercase px-2 py-0.5 rounded text-[10px]">
                        {article.category}
                      </span>
                      <span className="text-slate-200 drop-shadow">{article.readTime}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      <Link to={`/insights/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-2 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author?.avatar}
                      alt={article.author?.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-[11px] font-semibold text-slate-700">{article.author?.name}</span>
                  </div>

                  <Link
                    to={`/insights/${article.slug}`}
                    className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Read Whitepaper</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}

            {isLiveActive && (
              <AddCardButton
                onClick={openAddInsight}
                label="Add Article Card"
                subtitle="Feature a new whitepaper or analysis"
              />
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: FINAL CTA (CRUD-Enabled)                                      */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-[#0E1A38] via-[#162347] to-[#1F1947] border border-indigo-400/40 shadow-2xl shadow-indigo-950/40 overflow-hidden text-center text-white space-y-6">
            {isLiveActive && (
              <div className="absolute top-4 right-4 z-30">
                <button
                  type="button"
                  onClick={openEditCta}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit CTA Banner</span>
                </button>
              </div>
            )}

            <div className="relative z-10 max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/60 text-xs font-mono text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{sectionHeadings.cta.tag}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight">
                {sectionHeadings.cta.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed font-light">
                {sectionHeadings.cta.desc}
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={sectionHeadings.cta.primaryLink || '/request-project'}
                  className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center gap-2 group"
                >
                  <span>{sectionHeadings.cta.primaryText || 'Discuss an Enterprise Project'}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to={sectionHeadings.cta.secondaryLink || '/contact'}
                  className="px-8 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>{sectionHeadings.cta.secondaryText || 'Start a Conversation'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL DIALOG FOR LIVE VISUAL EDITING                                       */}
      {/* ========================================================================= */}
      <LiveEditorModal
        isOpen={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSubmit}
      >
        {/* Core Technology Card Form */}
        {modalType === 'tech' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CAPABILITY TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Distributed Core Architecture"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">CATEGORY BADGE / TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                placeholder="e.g. Core Platform / Sovereign AI"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">CAPABILITY DESCRIPTION</label>
              <textarea
                rows="4"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Describe this engineering discipline..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESTINATION URL LINK</label>
              <input
                type="text"
                value={modalData.link || ''}
                onChange={(e) => setModalData({ ...modalData, link: e.target.value })}
                placeholder="/services/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
          </div>
        )}

        {/* Enterprise Platform Card Form */}
        {modalType === 'solution' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">PLATFORM NAME</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Enterprise ERP Platform"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">BADGE</label>
                <input
                  type="text"
                  value={modalData.badge || ''}
                  onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                  placeholder="e.g. Resource Engine"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">SOLUTION SLUG</label>
                <input
                  type="text"
                  value={modalData.slug || ''}
                  onChange={(e) => setModalData({ ...modalData, slug: e.target.value })}
                  placeholder="e.g. enterprise-erp"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PLATFORM DESCRIPTION</label>
              <textarea
                rows="4"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Describe enterprise capability..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
          </div>
        )}

        {/* Why Point Form */}
        {modalType === 'why' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">STANDARD #</label>
                <input
                  type="text"
                  required
                  value={modalData.num || ''}
                  onChange={(e) => setModalData({ ...modalData, num: e.target.value })}
                  placeholder="01"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="font-bold text-slate-700 block mb-1">PILLAR TAG</label>
                <input
                  type="text"
                  value={modalData.tag || ''}
                  onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                  placeholder="e.g. Zero-Trust Perimeters"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">VALUE TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Scalable Engineering"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">EXPLANATION</label>
              <textarea
                rows="4"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Verifiable engineering methodology..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
          </div>
        )}

        {/* Hero Narrative Scene Form */}
        {modalType === 'scene' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CHAPTER TAG / CORRIDOR</label>
              <input
                type="text"
                required
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY HEADLINE</label>
                <input
                  type="text"
                  required
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">HIGHLIGHT TEXT</label>
                <input
                  type="text"
                  required
                  value={modalData.titleHighlight || ''}
                  onChange={(e) => setModalData({ ...modalData, titleHighlight: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">NARRATIVE COPY</label>
              <textarea
                rows="3"
                required
                value={modalData.description || ''}
                onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">METRIC LABEL</label>
                <input
                  type="text"
                  value={modalData.metricLabel || ''}
                  onChange={(e) => setModalData({ ...modalData, metricLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">METRIC VALUE</label>
                <input
                  type="text"
                  value={modalData.metricValue || ''}
                  onChange={(e) => setModalData({ ...modalData, metricValue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY CTA TEXT</label>
                <input
                  type="text"
                  value={modalData.primaryText || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY CTA LINK</label>
                <input
                  type="text"
                  value={modalData.primaryLink || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section Heading Form */}
        {modalType === 'heading' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION CATEGORY TAG</label>
              <input
                type="text"
                required
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION HEADING</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION SUBTITLE / OVERVIEW</label>
              <textarea
                rows="3"
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
          </div>
        )}

        {/* Pre-Footer CTA Form */}
        {modalType === 'cta' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">BANNER TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SUBTITLE</label>
              <textarea
                rows="3"
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY BUTTON TEXT</label>
                <input
                  type="text"
                  value={modalData.primaryText || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">PRIMARY BUTTON LINK</label>
                <input
                  type="text"
                  value={modalData.primaryLink || ''}
                  onChange={(e) => setModalData({ ...modalData, primaryLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* Company Intro Form */}
        {modalType === 'companyIntro' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION HEADING</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESCRIPTION PARAGRAPH</label>
              <textarea
                rows="4"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">BUTTON TEXT</label>
                <input
                  type="text"
                  value={modalData.ctaText || ''}
                  onChange={(e) => setModalData({ ...modalData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">BUTTON LINK</label>
                <input
                  type="text"
                  value={modalData.ctaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* Foundation Card Form */}
        {modalType === 'foundation' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CARD TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Enterprise Engineering Capabilities"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ICON</label>
                <select
                  value={modalData.iconName || 'Server'}
                  onChange={(e) => setModalData({ ...modalData, iconName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                >
                  <option value="Server">Server</option>
                  <option value="Workflow">Workflow</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Globe2">Globe2</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Database">Database</option>
                  <option value="Network">Network</option>
                  <option value="Lock">Lock</option>
                  <option value="Layers">Layers</option>
                  <option value="Building2">Building2</option>
                  <option value="Code2">Code2</option>
                  <option value="Activity">Activity</option>
                  <option value="Terminal">Terminal</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">COLOR ACCENT</label>
                <select
                  value={modalData.color || 'indigo'}
                  onChange={(e) => setModalData({ ...modalData, color: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                >
                  <option value="indigo">Indigo</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="emerald">Emerald</option>
                  <option value="cyan">Cyan</option>
                  <option value="amber">Amber</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">DESCRIPTION</label>
              <textarea
                rows="4"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Describe this corporate capability..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Facilities Showcase Header Form */}
        {modalType === 'facilitiesHeader' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">FACILITY TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">FACILITY SHOWCASE TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif text-sm"
              />
            </div>
          </div>
        )}

        {/* Facility Photographic Card Form */}
        {modalType === 'facility' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">FACILITY / NODE TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Air-Gapped Sovereign Cloud"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">NODE BADGE</label>
                <input
                  type="text"
                  value={modalData.badge || ''}
                  onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                  placeholder="e.g. Tier-IV Sovereign Node"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">BADGE COLOR</label>
                <select
                  value={modalData.badgeColor || 'cyan'}
                  onChange={(e) => setModalData({ ...modalData, badgeColor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                >
                  <option value="cyan">Cyan</option>
                  <option value="indigo">Indigo</option>
                  <option value="emerald">Emerald</option>
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PHOTOGRAPHIC IMAGE URL</label>
              <input
                type="text"
                required
                value={modalData.image || ''}
                onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">OPERATIONAL DESCRIPTION</label>
              <textarea
                rows="3"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Describe this verified infrastructure node..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
          </div>
        )}

        {/* Industry Sector Form */}
        {modalType === 'industry' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTOR TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Banking & Financial Services"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">SECTOR SLUG</label>
                <input
                  type="text"
                  value={modalData.slug || ''}
                  onChange={(e) => setModalData({ ...modalData, slug: e.target.value })}
                  placeholder="e.g. banking-finance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">LINK ROUTE</label>
                <input
                  type="text"
                  value={modalData.link || ''}
                  onChange={(e) => setModalData({ ...modalData, link: e.target.value })}
                  placeholder="/industries/banking-finance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">COVER IMAGE URL</label>
              <input
                type="text"
                required
                value={modalData.image || ''}
                onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTOR ARCHITECTURE OVERVIEW</label>
              <textarea
                rows="4"
                required
                value={modalData.overview || ''}
                onChange={(e) => setModalData({ ...modalData, overview: e.target.value })}
                placeholder="Explain the sector's regulatory standards and architectures..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Approach Header Form */}
        {modalType === 'approachHeader' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION HEADING</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">OVERVIEW</label>
              <textarea
                rows="3"
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">FRAMEWORK LINK TEXT</label>
                <input
                  type="text"
                  value={modalData.bottomLinkText || ''}
                  onChange={(e) => setModalData({ ...modalData, bottomLinkText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">FRAMEWORK LINK ROUTE</label>
                <input
                  type="text"
                  value={modalData.bottomLinkUrl || ''}
                  onChange={(e) => setModalData({ ...modalData, bottomLinkUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* Lifecycle Stage Form */}
        {modalType === 'stage' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">STAGE #</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="12"
                  value={modalData.step || 1}
                  onChange={(e) => setModalData({ ...modalData, step: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="font-bold text-slate-700 block mb-1">STAGE NAME</label>
                <input
                  type="text"
                  required
                  value={modalData.name || ''}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  placeholder="e.g. Understand / Architect"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PHASE TITLE</label>
              <input
                type="text"
                required
                value={modalData.phase || ''}
                onChange={(e) => setModalData({ ...modalData, phase: e.target.value })}
                placeholder="Stage 01: Requirement Discovery"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">STAGE SUMMARY</label>
              <textarea
                rows="3"
                required
                value={modalData.summary || ''}
                onChange={(e) => setModalData({ ...modalData, summary: e.target.value })}
                placeholder="What happens in this milestone gate..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">AUDIT DELIVERABLES (ONE PER LINE)</label>
              <textarea
                rows="4"
                value={modalData.deliverablesText || ''}
                onChange={(e) => setModalData({ ...modalData, deliverablesText: e.target.value })}
                placeholder="Functional Requirement Specification (FRS)&#10;Domain Entity Bounded-Context Map&#10;Regulatory Assessment"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono text-[11px] leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Global Strategic Pillar Form */}
        {modalType === 'globalPillar' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">PILLAR TITLE / NUMBER</label>
              <input
                type="text"
                required
                value={modalData.num || ''}
                onChange={(e) => setModalData({ ...modalData, num: e.target.value })}
                placeholder="e.g. 1. International Collaboration"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ICON</label>
                <select
                  value={modalData.iconName || 'ShieldCheck'}
                  onChange={(e) => setModalData({ ...modalData, iconName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                >
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Code2">Code2</option>
                  <option value="Handshake">Handshake</option>
                  <option value="Globe2">Globe2</option>
                  <option value="Server">Server</option>
                  <option value="Lock">Lock</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Database">Database</option>
                  <option value="Workflow">Workflow</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">COLOR ACCENT</label>
                <select
                  value={modalData.color || 'indigo'}
                  onChange={(e) => setModalData({ ...modalData, color: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                >
                  <option value="indigo">Indigo</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="emerald">Emerald</option>
                  <option value="cyan">Cyan</option>
                  <option value="amber">Amber</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">BOTTOM BADGE TAG</label>
              <input
                type="text"
                value={modalData.badge || ''}
                onChange={(e) => setModalData({ ...modalData, badge: e.target.value })}
                placeholder="e.g. SIAC & LCIA Arbitration Enforceable"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PILLAR DESCRIPTION</label>
              <textarea
                rows="4"
                required
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                placeholder="Describe international operational capability..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Insights Header Form */}
        {modalType === 'insightsHeader' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION TAG</label>
              <input
                type="text"
                value={modalData.tag || ''}
                onChange={(e) => setModalData({ ...modalData, tag: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SECTION HEADING</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif text-sm"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">OVERVIEW</label>
              <textarea
                rows="3"
                value={modalData.desc || ''}
                onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ALL INSIGHTS BUTTON TEXT</label>
                <input
                  type="text"
                  value={modalData.ctaText || ''}
                  onChange={(e) => setModalData({ ...modalData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ALL INSIGHTS ROUTE</label>
                <input
                  type="text"
                  value={modalData.ctaLink || ''}
                  onChange={(e) => setModalData({ ...modalData, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* Insight Article Card Form */}
        {modalType === 'insight' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">ARTICLE TITLE</label>
              <input
                type="text"
                required
                value={modalData.title || ''}
                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                placeholder="e.g. Architecting Sovereign Cloud Infrastructure"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-serif"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">CATEGORY</label>
                <input
                  type="text"
                  value={modalData.category || ''}
                  onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
                  placeholder="Architecture"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">READ TIME</label>
                <input
                  type="text"
                  value={modalData.readTime || ''}
                  onChange={(e) => setModalData({ ...modalData, readTime: e.target.value })}
                  placeholder="8 min read"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ARTICLE SLUG</label>
                <input
                  type="text"
                  value={modalData.slug || ''}
                  onChange={(e) => setModalData({ ...modalData, slug: e.target.value })}
                  placeholder="sovereign-cloud-whitepaper"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">COVER IMAGE URL</label>
              <input
                type="text"
                required
                value={modalData.coverImage || ''}
                onChange={(e) => setModalData({ ...modalData, coverImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">EXECUTIVE EXCERPT</label>
              <textarea
                rows="3"
                required
                value={modalData.excerpt || ''}
                onChange={(e) => setModalData({ ...modalData, excerpt: e.target.value })}
                placeholder="Key takeaways and architectural framework..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">AUTHOR NAME</label>
                <input
                  type="text"
                  value={modalData.authorName || ''}
                  onChange={(e) => setModalData({ ...modalData, authorName: e.target.value })}
                  placeholder="Dr. Marcus Vance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">AUTHOR AVATAR URL</label>
                <input
                  type="text"
                  value={modalData.authorAvatar || ''}
                  onChange={(e) => setModalData({ ...modalData, authorAvatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-indigo-600 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        )}
      </LiveEditorModal>
    </div>
  );
}
