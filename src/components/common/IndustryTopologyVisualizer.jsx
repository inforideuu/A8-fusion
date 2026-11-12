import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  Zap, 
  Activity,
  ShieldCheck,
  Stethoscope,
  GraduationCap,
  Factory,
  HardHat,
  Truck,
  Landmark,
  Building2,
  Zap as EnergyIcon,
  Cpu,
  Layers,
  Database,
  BarChart3,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function IndustryTopologyVisualizer({ industry }) {
  const [activeNodeId, setActiveNodeId] = useState('center');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Industry-specific 5-node Radial Ecosystem Data (1 Center Spine + 4 Cardinal Quadrant Nodes)
  const getIndustryEcosystem = (slug) => {
    switch (slug) {
      case 'healthcare':
        return {
          center: {
            id: 'center',
            title: 'Sovereign Clinical Core Spine',
            role: 'Enterprise Healthcare Orchestration',
            desc: 'Real-time synchronization bus coordinating patient safety, EHR records, and statutory health data sovereignty.',
            color: '#4F46E5', // Indigo
            icon: Stethoscope
          },
          nodes: [
            {
              id: 'nw',
              title: 'Clinical Workstations & EHR',
              short: 'EHR Ingress',
              desc: 'Bedside tablet charting, doctor order entries, and IoT biometric monitors streaming over mTLS.',
              color: '#0284C7', // Sky Blue
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Diagnostic Imaging & PACS',
              short: 'DICOM Core',
              desc: 'Sub-second DICOM medical image routing and AI automated radiology pre-screening cross-checks.',
              color: '#7C3AED', // Purple
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Sovereign PHI & HIPAA Vault',
              short: 'HIPAA Vault',
              desc: 'Air-gapped patient records encrypted with AES-256-GCM and zero-knowledge database audit escrow.',
              color: '#059669', // Emerald
              icon: Database
            },
            {
              id: 'sw',
              title: 'Multi-Payer Claims & Billing',
              short: 'Claims Escrow',
              desc: 'Automated health insurance pre-authorizations, tariff calculations, and instant insurer clearance.',
              color: '#D97706', // Amber
              icon: ShieldCheck
            }
          ]
        };
      case 'manufacturing':
        return {
          center: {
            id: 'center',
            title: 'Industry 4.0 MES Spine',
            role: 'Shopfloor Execution Engine',
            desc: 'Central manufacturing execution system synchronizing machine controllers, inventory thresholds, and plant safety.',
            color: '#4F46E5',
            icon: Factory
          },
          nodes: [
            {
              id: 'nw',
              title: 'SCADA Machine Telemetry',
              short: 'IoT Telemetry',
              desc: 'High-frequency PLC feeds, vibration monitors, and sub-second machine health telemetry.',
              color: '#D97706',
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Predictive Maintenance AI',
              short: 'AI Anomaly',
              desc: 'Zero-downtime thermal anomaly detection, tool wear algorithms, and automated technician dispatch.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'ISO-9001 Batch Traceability',
              short: 'Quality Ledger',
              desc: 'Deterministic component serialization archives and tamper-evident production certificates.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Dynamic MRP & Supply Bus',
              short: 'Supply Bus',
              desc: 'Real-time bill-of-materials recalculation and automated electronic vendor procurement orders.',
              color: '#0284C7',
              icon: ShieldCheck
            }
          ]
        };
      case 'construction':
        return {
          center: {
            id: 'center',
            title: 'Capital Project Spine',
            role: 'Infrastructure Program Management',
            desc: 'Master digital twin program engine coordinating contractor schedules, project costs, and sovereign compliance.',
            color: '#4F46E5',
            icon: HardHat
          },
          nodes: [
            {
              id: 'nw',
              title: 'Field Tablets & Drone Survey',
              short: 'Site Ingress',
              desc: 'Offline-first jobsite inspection apps, drone photogrammetry uploads, and 3D LiDAR point clouds.',
              color: '#EA580C', // Orange
              icon: Layers
            },
            {
              id: 'ne',
              title: 'BIM 3D & BoQ Reconciler',
              short: 'BoQ Engine',
              desc: 'Automated bill-of-quantities reconciler comparing as-built telemetry against architectural designs.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Milestone Escrow & Audit',
              short: 'Escrow Vault',
              desc: 'Cryptographic milestone validation enforcing zero release of capital funds without verified sign-off.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Critical Path Monte Carlo',
              short: 'Risk Predictor',
              desc: 'Stochastic schedule risk modeling identifying weather, supply chain, and subcontractor bottlenecks.',
              color: '#0284C7',
              icon: ShieldCheck
            }
          ]
        };
      case 'education':
        return {
          center: {
            id: 'center',
            title: 'Campus Institutional Core',
            role: 'University SIS & Academic Spine',
            desc: 'Unified collegiate platform governing admissions, academic progression, faculty tenure, and campus housing.',
            color: '#4F46E5',
            icon: GraduationCap
          },
          nodes: [
            {
              id: 'nw',
              title: 'Student Admissions & Portal',
              short: 'Student Portal',
              desc: 'High-traffic course enrollment engines, student financial aid portals, and campus mobile apps.',
              color: '#2563EB',
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Curriculum & Degree Audit',
              short: 'Degree Engine',
              desc: 'Automated graduation clearance audits, credit transfer evaluations, and prerequisite validations.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Sovereign Academic Vault',
              short: 'FERPA Vault',
              desc: 'FERPA-compliant student permanent record archives and tamper-evident degree verification ledgers.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Research Grants & Compliance',
              short: 'Grants Ledger',
              desc: 'Government research grant tracking, IRB compliance certification, and multi-PI fund allocation.',
              color: '#D97706',
              icon: ShieldCheck
            }
          ]
        };
      case 'logistics':
        return {
          center: {
            id: 'center',
            title: 'Global Freight Routing Core',
            role: 'Multi-Modal Logistics Hub',
            desc: 'International freight engine managing multi-carrier dispatch, cross-border clearance, and cold-chain integrity.',
            color: '#4F46E5',
            icon: Truck
          },
          nodes: [
            {
              id: 'nw',
              title: 'Fleet Telematics & IoT Probes',
              short: 'Telematics',
              desc: 'GPS transponder telemetry, cold-chain temperature monitoring, and port gate RFID ingress.',
              color: '#0284C7',
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Algorithmic Route Dispatch',
              short: 'Route Engine',
              desc: 'Multi-stop freight optimization factoring live traffic congestion, fuel efficiency, and driver rest limits.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Sovereign Manifest Ledger',
              short: 'Customs Vault',
              desc: 'Immutable digital bill-of-lading archives and multi-jurisdiction customs compliance escrow.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Carrier EDI & Settlement',
              short: 'Settlement Rail',
              desc: 'Automated milestone billing, freight invoice reconciliations, and fuel surcharge calculations.',
              color: '#D97706',
              icon: ShieldCheck
            }
          ]
        };
      case 'banking-finance':
        return {
          center: {
            id: 'center',
            title: 'Financial Transaction Switch',
            role: 'Core Banking & Settlement Spine',
            desc: 'Ultra-low latency transaction clearing core enforcing ACID compliance and real-time ledger finality.',
            color: '#4F46E5',
            icon: Landmark
          },
          nodes: [
            {
              id: 'nw',
              title: 'Multi-Channel Ingress & Auth',
              short: 'Channel Gateway',
              desc: 'Corporate treasury portals, retail mobile apps, and SWIFT ISO-20022 biometric authentication gateways.',
              color: '#0891B2',
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Real-Time AML & Anti-Fraud',
              short: 'Anti-Fraud Core',
              desc: 'Sub-millisecond machine learning scoring identifying transaction anomalies and PEP sanctions screening.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Central Bank & Basel III Vault',
              short: 'HSM Vault',
              desc: 'FIPS 140-2 Level 4 hardware security module enclaves with zero-knowledge transaction audit escrow.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Automated Clearing & Rails',
              short: 'Clearing Rails',
              desc: 'Bi-directional integration with national real-time payment switches (FAST, FedNow, CHAPS, SEPA).',
              color: '#D97706',
              icon: ShieldCheck
            }
          ]
        };
      case 'real-estate':
        return {
          center: {
            id: 'center',
            title: 'Asset Portfolio Core Spine',
            role: 'Real Estate Asset Management',
            desc: 'Consolidated commercial real estate engine governing lease contracts, facility IoT, and institutional yields.',
            color: '#4F46E5',
            icon: Building2
          },
          nodes: [
            {
              id: 'nw',
              title: 'Tenant Cockpit & Smart IoT',
              short: 'Tenant Portals',
              desc: 'Access control badge integrations, automated utility sub-metering, and mobile tenant maintenance requests.',
              color: '#4F46E5',
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Lease Indexation & CAM Core',
              short: 'Lease Engine',
              desc: 'Dynamic CPI rent indexation, automated common-area maintenance allocations, and tenant arrears management.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Land Registry & Title Vault',
              short: 'Title Vault',
              desc: 'Cryptographic ownership ledgers, digital contract escrow, and institutional property title registries.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Cap-Rate & Investor Analytics',
              short: 'Yield Analytics',
              desc: 'Multi-property cash flow projections, debt amortizations, and automated quarterly institutional reporting.',
              color: '#D97706',
              icon: ShieldCheck
            }
          ]
        };
      case 'energy-utilities':
        return {
          center: {
            id: 'center',
            title: 'Smart Grid Management Spine',
            role: 'Critical Utility Grid Orchestration',
            desc: 'National infrastructure telemetry engine coordinating electricity transmission, smart meters, and outage routing.',
            color: '#4F46E5',
            icon: EnergyIcon
          },
          nodes: [
            {
              id: 'nw',
              title: 'Smart Meter & SCADA Ingress',
              short: 'Grid Telemetry',
              desc: 'Sub-second substation feeds, automated meter infrastructure (AMI) reads, and transmission line sensors.',
              color: '#CA8A04',
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Dynamic Load Balancing Core',
              short: 'Load Balancer',
              desc: 'Predictive grid demand balancing, automated circuit switching, and peak surge prevention algorithms.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Critical Infrastructure Vault',
              short: 'Sovereign Vault',
              desc: 'Air-gapped consumption archives, national security enclaves, and tamper-evident audit logs.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Regulatory Tariff & Billing',
              short: 'Tariff Engine',
              desc: 'Time-of-use tariff calculations, distributed solar feed-in reconciliations, and regulatory emission reporting.',
              color: '#0284C7',
              icon: ShieldCheck
            }
          ]
        };
      default:
        return {
          center: {
            id: 'center',
            title: 'Sovereign Sector Core Spine',
            role: 'Enterprise Domain Operations',
            desc: 'Central orchestration engine synchronizing field telemetry, workflow rules, and sovereign data residency.',
            color: '#4F46E5',
            icon: ShieldCheck
          },
          nodes: [
            {
              id: 'nw',
              title: 'Field Ingestion & Edge Gateways',
              short: 'Edge Ingress',
              desc: 'Unified multi-device ingestion points with strict TLS 1.3 encryption and zero-trust verification.',
              color: '#0284C7',
              icon: Layers
            },
            {
              id: 'ne',
              title: 'Domain Workflow & Decision Core',
              short: 'Decision Core',
              desc: 'High-throughput event-driven microservices bus executing zero-latency business workflows.',
              color: '#7C3AED',
              icon: Cpu
            },
            {
              id: 'se',
              title: 'Sovereign Cryptographic Vault',
              short: 'Sovereign Vault',
              desc: 'In-country hardware-isolated database clusters enforcing zero cross-border data egress.',
              color: '#059669',
              icon: Database
            },
            {
              id: 'sw',
              title: 'Continuous Telemetry & Compliance',
              short: 'Audit Watch',
              desc: 'Real-time telemetry probing verifying SLA adherence, zero data leaks, and legal enforceability.',
              color: '#D97706',
              icon: ShieldCheck
            }
          ]
        };
    }
  };

  const ecosystem = getIndustryEcosystem(industry?.slug);
  const allNodes = [ecosystem.center, ...ecosystem.nodes];
  const currentNode = allNodes.find(n => n.id === activeNodeId) || ecosystem.center;

  // Initialize and animate Radial Ecosystem Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);

    // Initial radial particles flowing between satellites and center
    const particleCount = 24;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      nodeIndex: Math.floor(Math.random() * 4), // NW, NE, SE, SW
      direction: Math.random() > 0.5 ? 1 : -1, // in or out
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      size: 2 + Math.random() * 1.8
    }));

    let lastTime = performance.now();

    const render = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rx = Math.max(90, width * 0.36);
      const ry = Math.max(45, height * 0.32);

      // 1. Subtle radial coordinate orbits behind diagram
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);

      // Inner resonance ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Outer satellite orbit ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // 2. Compute 4 Satellite Coordinates in 4 Quadrants around center
      const satelliteCoords = [
        { x: cx - rx * 0.92, y: cy - ry * 0.85, data: ecosystem.nodes[0] }, // NW
        { x: cx + rx * 0.92, y: cy - ry * 0.85, data: ecosystem.nodes[1] }, // NE
        { x: cx + rx * 0.92, y: cy + ry * 0.85, data: ecosystem.nodes[2] }, // SE
        { x: cx - rx * 0.92, y: cy + ry * 0.85, data: ecosystem.nodes[3] }  // SW
      ];

      // 3. Draw Radial Spokes between Center and each Satellite
      satelliteCoords.forEach(sat => {
        // Outer conduit track
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sat.x, sat.y);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Inner glowing colored vector
        const spokeGrad = ctx.createLinearGradient(cx, cy, sat.x, sat.y);
        spokeGrad.addColorStop(0, ecosystem.center.color + '50');
        spokeGrad.addColorStop(1, sat.data.color + '70');
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sat.x, sat.y);
        ctx.strokeStyle = spokeGrad;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 4. Update and Draw Flowing Photons along Radial Spokes
      const burstMultiplier = isSimulatingSync ? 3.5 : 1;
      particlesRef.current.forEach(p => {
        if (isPlaying) {
          p.t += p.speed * burstMultiplier;
          if (p.t > 1) {
            p.t = 0;
            p.nodeIndex = Math.floor(Math.random() * 4);
            p.direction = Math.random() > 0.5 ? 1 : -1;
          }
        }

        const sat = satelliteCoords[p.nodeIndex];
        if (!sat) return;

        // Linear interpolation: either Center -> Satellite or Satellite -> Center
        const fromX = p.direction === 1 ? cx : sat.x;
        const fromY = p.direction === 1 ? cy : sat.y;
        const toX = p.direction === 1 ? sat.x : cx;
        const toY = p.direction === 1 ? sat.y : cy;

        const px = fromX + (toX - fromX) * p.t;
        const py = fromY + (toY - fromY) * p.t;

        ctx.beginPath();
        ctx.arc(px, py, p.size * (isSimulatingSync ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fillStyle = sat.data.color;
        ctx.shadowColor = sat.data.color;
        ctx.shadowBlur = isSimulatingSync ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 5. Draw the 4 Satellite Nodes
      satelliteCoords.forEach(sat => {
        const isSelected = sat.data.id === activeNodeId;
        const radius = isSelected ? 17 : 14;

        if (isSelected) {
          const pulse = (Math.sin(now * 0.005) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(sat.x, sat.y, radius + 6 + pulse * 4, 0, Math.PI * 2);
          ctx.strokeStyle = sat.data.color + '40';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Base circle
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border ring
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? sat.data.color : '#CBD5E1';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Inner core
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, isSelected ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = sat.data.color;
        ctx.fill();

        // Label Pill
        const labelText = sat.data.short.toUpperCase();
        ctx.font = isSelected ? 'bold 10px Plus Jakarta Sans, sans-serif' : '600 9px Plus Jakarta Sans, sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        const textY = sat.y > cy ? sat.y + radius + 5 : sat.y - radius - 15;

        ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(248, 250, 252, 0.9)';
        ctx.beginPath();
        ctx.roundRect(sat.x - textWidth / 2 - 4, textY - 1, textWidth + 8, 14, 3);
        ctx.fill();
        ctx.strokeStyle = isSelected ? sat.data.color + '70' : '#E2E8F0';
        ctx.stroke();

        ctx.fillStyle = isSelected ? sat.data.color : '#475569';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(labelText, sat.x, textY);
      });

      // 6. Draw Central Core Node
      const isCenterSelected = activeNodeId === 'center';
      const centerRadius = isCenterSelected ? 24 : 20;

      // Pulse ring for center core
      const pulseCenter = (Math.sin(now * 0.004) + 1) * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, centerRadius + 7 + pulseCenter * 5, 0, Math.PI * 2);
      ctx.strokeStyle = ecosystem.center.color + '30';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Base circle
      ctx.beginPath();
      ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(79, 70, 229, 0.15)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Core border
      ctx.beginPath();
      ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isCenterSelected ? ecosystem.center.color : '#818CF8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner Core Dot
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = ecosystem.center.color;
      ctx.fill();

      // Center Core Label Pill
      const centerText = 'ENTERPRISE CORE';
      ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
      const cWidth = ctx.measureText(centerText).width;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.roundRect(cx - cWidth / 2 - 5, cy + centerRadius + 4, cWidth + 10, 14, 3);
      ctx.fill();
      ctx.strokeStyle = ecosystem.center.color + '50';
      ctx.stroke();

      ctx.fillStyle = ecosystem.center.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(centerText, cx, cy + centerRadius + 5);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [activeNodeId, isPlaying, isSimulatingSync, ecosystem]);

  // Handle canvas click to select radial node
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const rx = Math.max(90, width * 0.36);
    const ry = Math.max(45, height * 0.32);

    // Center click
    if (Math.hypot(clickX - cx, clickY - cy) < 28) {
      setActiveNodeId('center');
      return;
    }

    const satelliteCoords = [
      { x: cx - rx * 0.92, y: cy - ry * 0.85, id: ecosystem.nodes[0].id },
      { x: cx + rx * 0.92, y: cy - ry * 0.85, id: ecosystem.nodes[1].id },
      { x: cx + rx * 0.92, y: cy + ry * 0.85, id: ecosystem.nodes[2].id },
      { x: cx - rx * 0.92, y: cy + ry * 0.85, id: ecosystem.nodes[3].id }
    ];

    satelliteCoords.forEach(item => {
      if (Math.hypot(clickX - item.x, clickY - item.y) < 25) {
        setActiveNodeId(item.id);
      }
    });
  };

  const triggerSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => setIsSimulatingSync(false), 1400);
  };

  const Icon = currentNode.icon;

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/90 shadow-xl shadow-slate-200/50 p-5 sm:p-6 relative overflow-hidden group">
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-100/35 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider pl-1">
            Sector Ecosystem Matrix
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Synchronize Load Burst */}
          <button
            type="button"
            onClick={triggerSync}
            disabled={isSimulatingSync}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors shadow-xs"
            title="Simulate cross-domain data synchronization"
          >
            <Zap className={`w-3 h-3 ${isSimulatingSync ? 'text-amber-500 animate-bounce' : 'text-indigo-600'}`} />
            <span>{isSimulatingSync ? 'Syncing...' : 'Simulate'}</span>
          </button>

          {/* Pause / Resume */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
            title={isPlaying ? 'Pause orbit animation' : 'Resume orbit animation'}
          >
            {isPlaying ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Active Flow Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-700 font-bold tracking-wider">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Radial Hub-and-Spoke Ecosystem Canvas */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full h-[180px] sm:h-[195px] rounded-xl bg-white border border-slate-200 shadow-inner overflow-hidden cursor-pointer"
        onClick={handleCanvasClick}
        title="Click on the central spine or any satellite node to inspect"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block"
        />

        {/* Floating helper instruction */}
        <div className="absolute bottom-2 left-2.5 pointer-events-none flex items-center gap-1.5 text-[9px] font-mono text-slate-400 bg-white/90 backdrop-blur px-2 py-0.5 rounded border border-slate-200/80">
          <Activity className="w-2.5 h-2.5 text-indigo-500 animate-pulse" />
          <span>Click center core or satellites to inspect</span>
        </div>
      </div>

      {/* Quick Quadrant Selector Tabs */}
      <div className="relative z-10 grid grid-cols-5 gap-1.5 pt-3">
        {/* Core Spine Button */}
        <button
          type="button"
          onClick={() => setActiveNodeId('center')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all border ${
            activeNodeId === 'center'
              ? 'bg-white border-indigo-500 ring-2 ring-indigo-100 shadow-xs text-indigo-950 font-bold'
              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white text-slate-700'
          }`}
        >
          <div className="text-[8px] font-mono uppercase text-slate-400">HUB</div>
          <div className="text-[11px] truncate font-semibold">Core</div>
        </button>

        {/* 4 Satellite Buttons */}
        {ecosystem.nodes.map(n => {
          const isActive = n.id === activeNodeId;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setActiveNodeId(n.id)}
              className={`py-1.5 px-1.5 rounded-lg text-center transition-all border ${
                isActive
                  ? 'bg-white border-indigo-400 ring-2 ring-indigo-100 shadow-xs text-indigo-950 font-bold'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white text-slate-700'
              }`}
            >
              <div className="text-[8px] font-mono uppercase text-slate-400 truncate">{n.short.split(' ')[0]}</div>
              <div className="text-[11px] truncate font-semibold">{n.short.split(' ')[1] || n.short}</div>
            </button>
          );
        })}
      </div>

      {/* Compact Active Quadrant Short Description Card */}
      <div className="relative z-10 mt-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
        <div 
          className="w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0 mt-0.5"
          style={{ 
            backgroundColor: currentNode.color + '15', 
            borderColor: currentNode.color + '30',
            color: currentNode.color 
          }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-serif font-bold text-slate-900 truncate">
              {currentNode.title}
            </span>
            <span 
              className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold border flex-shrink-0"
              style={{ 
                backgroundColor: currentNode.color + '10', 
                color: currentNode.color,
                borderColor: currentNode.color + '30'
              }}
            >
              {currentNode.id === 'center' ? 'CENTRAL CORE' : 'SECTOR SATELLITE'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            {currentNode.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
