import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Network, 
  Lock, 
  Activity, 
  CheckCircle2,
  RefreshCw,
  Terminal,
  Zap
} from 'lucide-react';

export default function ArchitectureVisualizer() {
  const [activeLayer, setActiveLayer] = useState('mesh'); // 'edge', 'mesh', 'core', 'sovereign'
  const [simulating, setSimulating] = useState(false);

  const layers = [
    {
      id: 'edge',
      name: 'Layer 1: Sovereign Edge & Zero-Trust Ingress',
      short: 'Edge & Ingress',
      icon: ShieldCheck,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/40 border-indigo-800/40',
      metrics: {
        latency: '0.8ms',
        throughput: '1.4M req/sec',
        ssl: 'TLS 1.3 / mTLS',
        firewall: 'WAF & DDoS Shield Active'
      },
      description: 'Distributed sovereign edge nodes intercepting inbound traffic, verifying client cryptographic certificates, and routing requests through zero-trust security perimeters.'
    },
    {
      id: 'mesh',
      name: 'Layer 2: Event-Driven Enterprise Service Bus',
      short: 'Event Mesh (ESB)',
      icon: Network,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-800/40',
      metrics: {
        latency: '1.2ms',
        throughput: '850K events/sec',
        protocol: 'gRPC / Kafka 3.6',
        resiliency: 'Zero Packet Loss / Dead-Letter Quorum'
      },
      description: 'Decoupled asynchronous message broker orchestrating bi-directional synchronization across core ERPs, custom business engines, and external government portals.'
    },
    {
      id: 'core',
      name: 'Layer 3: Multi-Tenant Business Kernel',
      short: 'Business Kernel',
      icon: Server,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-800/40',
      metrics: {
        concurrency: '50,000 active sessions',
        uptime: '99.999% SLA',
        isolation: 'Schema-Level Multi-Tenancy',
        engine: 'Reactive Java / Go Core'
      },
      description: 'High-throughput transactional kernel executing complex domain workflows, multi-currency ledger reconciliations, and role-based permissions.'
    },
    {
      id: 'sovereign',
      name: 'Layer 4: Sovereign Cryptographic Vault & Vector AI',
      short: 'Sovereign Enclave',
      icon: Lock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800/40',
      metrics: {
        encryption: 'AES-256-GCM / HSM Backed',
        residency: 'Domestic In-Country VPC',
        vectorCluster: 'Air-Gapped Qdrant / Milvus',
        compliance: 'FIPS 140-2 / ISO 27001'
      },
      description: 'Isolated in-country data residency vault storing encrypted citizen registries, financial audit trails, and private on-premise Large Language Model embeddings.'
    }
  ];

  const current = layers.find(l => l.id === activeLayer) || layers[1];
  const Icon = current.icon;

  const triggerSimulation = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 1200);
  };

  return (
    <div className="bg-[#0B1424] rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-white space-y-6">
      {/* Console Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              A8FUSION // INTERACTIVE ENTERPRISE ARCHITECTURE TOPOLOGY
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
            Click layers below to inspect decoupled zero-trust architectural tiers.
          </p>
        </div>

        <button
          type="button"
          onClick={triggerSimulation}
          disabled={simulating}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-indigo-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{simulating ? 'Simulating Traffic...' : 'Stress-Test Latency'}</span>
        </button>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {layers.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveLayer(l.id)}
            className={`p-3 rounded-xl text-left border transition-all ${
              activeLayer === l.id
                ? 'bg-slate-800/90 border-indigo-500/80 shadow-lg text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-slate-500">Tier 0{layers.indexOf(l) + 1}</div>
            <div className="text-xs font-bold font-sans mt-0.5 truncate">{l.short}</div>
          </button>
        ))}
      </div>

      {/* Active Layer Deep Dive Blueprint */}
      <div className={`p-6 rounded-xl border ${current.bgColor} transition-all duration-300 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${current.color}`} />
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-white">{current.name}</h4>
              <span className="text-[10px] font-mono text-slate-400">STATUS: AUDITED &amp; OPERATIONAL</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40 hidden sm:inline">
            HEALTH: 100%
          </span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {current.description}
        </p>

        {/* Real-time Telemetry Metrics Grid */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {Object.entries(current.metrics).map(([key, val], idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">{key}</span>
              <span className="text-slate-200 font-bold block mt-0.5 truncate">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Assurance Footnote */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
        <span>Framework: Micro-modular decoupled services</span>
        <span className="text-indigo-400">Zero Single Point of Failure (SPOF)</span>
      </div>
    </div>
  );
}

