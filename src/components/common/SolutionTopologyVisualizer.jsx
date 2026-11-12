import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  Play, 
  Pause, 
  Zap, 
  Activity
} from 'lucide-react';

export default function SolutionTopologyVisualizer({ solution, topology }) {
  const [activeNodeId, setActiveNodeId] = useState('ingress');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSimulatingBurst, setIsSimulatingBurst] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Architecture tiers tailored to the solution (Tier 1 Ingress, Tier 2 Processing, Tier 3 Sovereign Storage)
  const nodes = [
    {
      id: 'ingress',
      tier: 'Tier 01',
      title: topology?.tier1?.title || 'Tier 01: Ingress & Client Portals',
      shortTitle: 'Tier 01 · Ingress',
      desc: topology?.tier1?.desc || 'Unified edge ingestion points with strict TLS 1.3 encryption and zero-trust verification.',
      icon: Layers,
      color: '#2563EB', // Blue
      lightBg: 'bg-blue-50'
    },
    {
      id: 'processing',
      tier: 'Tier 02',
      title: topology?.tier2?.title || 'Tier 02: Core Orchestration Engine',
      shortTitle: 'Tier 02 · Processing',
      desc: topology?.tier2?.desc || 'High-throughput event-driven microservices bus executing zero-latency business workflows.',
      icon: Cpu,
      color: '#4F46E5', // Indigo
      lightBg: 'bg-indigo-50'
    },
    {
      id: 'storage',
      tier: 'Tier 03',
      title: topology?.tier3?.title || 'Tier 03: Sovereign Storage Vault',
      shortTitle: 'Tier 03 · Sovereign',
      desc: topology?.tier3?.desc || 'In-country hardware-isolated database clusters enforcing zero cross-border data egress.',
      icon: Database,
      color: '#059669', // Emerald
      lightBg: 'bg-emerald-50'
    }
  ];

  const currentNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  // Initialize and animate canvas
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

    // Initial particles
    const particleCount = 20;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      pathIndex: Math.random() > 0.5 ? 0 : 1, // between 0->1 or 1->2
      t: Math.random(),
      speed: 0.0035 + Math.random() * 0.004,
      size: 2 + Math.random() * 2
    }));

    let lastTime = performance.now();

    const render = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Light blueprint grid background
      const gridSize = 22;
      ctx.fillStyle = '#E2E8F0';
      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Compute dynamic 3-node coordinates
      const padX = Math.max(48, width * 0.16);
      const centerY = height * 0.44;

      const nodeCoords = [
        { x: padX, y: centerY, node: nodes[0] },
        { x: width * 0.5, y: centerY, node: nodes[1] },
        { x: width - padX, y: centerY, node: nodes[2] }
      ];

      // Draw connection conduits between nodes
      for (let i = 0; i < nodeCoords.length - 1; i++) {
        const from = nodeCoords[i];
        const to = nodeCoords[i + 1];

        // Outer conduit track
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Inner glowing gradient conduit
        const conduitGrad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        conduitGrad.addColorStop(0, from.node.color + '70');
        conduitGrad.addColorStop(1, to.node.color + '70');
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = conduitGrad;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Update and draw flowing animated particles along conduits
      const burstMultiplier = isSimulatingBurst ? 3.5 : 1;
      particlesRef.current.forEach(p => {
        if (isPlaying) {
          p.t += p.speed * burstMultiplier;
          if (p.t > 1) {
            p.t = 0;
            p.pathIndex = (p.pathIndex + 1) % (nodeCoords.length - 1);
          }
        }

        const from = nodeCoords[p.pathIndex];
        const to = nodeCoords[p.pathIndex + 1];
        if (!from || !to) return;

        // Linear interpolation along connection
        const px = from.x + (to.x - from.x) * p.t;
        const py = from.y + (to.y - from.y) * p.t;

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(px, py, p.size * (isSimulatingBurst ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fillStyle = from.node.color;
        ctx.shadowColor = from.node.color;
        ctx.shadowBlur = isSimulatingBurst ? 10 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render interactive nodes
      nodeCoords.forEach((item) => {
        const isSelected = item.node.id === activeNodeId;
        const nodeRadius = isSelected ? 20 : 16;

        // Pulse radar ring for active node
        if (isSelected) {
          const pulse = (Math.sin(now * 0.005) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(item.x, item.y, nodeRadius + 7 + pulse * 5, 0, Math.PI * 2);
          ctx.strokeStyle = item.node.color + '40';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(item.x, item.y, nodeRadius + 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = item.node.color + '80';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // White base circle with soft shadow
        ctx.beginPath();
        ctx.arc(item.x, item.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Border ring
        ctx.beginPath();
        ctx.arc(item.x, item.y, nodeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? item.node.color : '#CBD5E1';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Inner core dot
        ctx.beginPath();
        ctx.arc(item.x, item.y, isSelected ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = item.node.color;
        ctx.fill();

        // Node Label
        ctx.font = isSelected 
          ? 'bold 11px Plus Jakarta Sans, sans-serif' 
          : '600 10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const labelText = item.node.shortTitle.toUpperCase();
        const textWidth = ctx.measureText(labelText).width;
        const labelY = item.y + nodeRadius + 7;

        ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(248, 250, 252, 0.85)';
        ctx.beginPath();
        ctx.roundRect(item.x - textWidth / 2 - 5, labelY - 2, textWidth + 10, 16, 4);
        ctx.fill();
        ctx.strokeStyle = isSelected ? item.node.color + '60' : '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isSelected ? item.node.color : '#475569';
        ctx.fillText(labelText, item.x, labelY);
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [activeNodeId, isPlaying, isSimulatingBurst, nodes]);

  // Handle canvas click to select node
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const padX = Math.max(48, width * 0.16);
    const centerY = height * 0.44;

    const nodeCoords = [
      { x: padX, y: centerY, id: nodes[0].id },
      { x: width * 0.5, y: centerY, id: nodes[1].id },
      { x: width - padX, y: centerY, id: nodes[2].id }
    ];

    nodeCoords.forEach(item => {
      const dist = Math.hypot(clickX - item.x, clickY - item.y);
      if (dist < 32) {
        setActiveNodeId(item.id);
      }
    });
  };

  const triggerBurst = () => {
    setIsSimulatingBurst(true);
    setTimeout(() => setIsSimulatingBurst(false), 1400);
  };

  const Icon = currentNode.icon;

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/90 shadow-xl shadow-slate-200/50 p-5 sm:p-6 relative overflow-hidden group">
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/35 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider pl-1">
            System Topology Mesh
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Burst Load Simulator */}
          <button
            type="button"
            onClick={triggerBurst}
            disabled={isSimulatingBurst}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors shadow-xs"
            title="Simulate load burst"
          >
            <Zap className={`w-3 h-3 ${isSimulatingBurst ? 'text-amber-500 animate-bounce' : 'text-indigo-600'}`} />
            <span>{isSimulatingBurst ? 'Bursting...' : 'Simulate'}</span>
          </button>

          {/* Pause / Resume */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
            title={isPlaying ? 'Pause animation' : 'Resume animation'}
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

      {/* Responsive Interactive Canvas Diagram */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full h-[180px] sm:h-[195px] rounded-xl bg-white border border-slate-200 shadow-inner overflow-hidden cursor-pointer"
        onClick={handleCanvasClick}
        title="Click on any tier node to inspect details"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block"
        />

        {/* Floating helper instruction */}
        <div className="absolute bottom-2 left-2.5 pointer-events-none flex items-center gap-1.5 text-[9px] font-mono text-slate-400 bg-white/90 backdrop-blur px-2 py-0.5 rounded border border-slate-200/80">
          <Activity className="w-2.5 h-2.5 text-indigo-500 animate-pulse" />
          <span>Click node to select tier</span>
        </div>
      </div>

      {/* Tier Selector Buttons (3 clean tiers side by side) */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-3">
        {nodes.map(n => {
          const isActive = n.id === activeNodeId;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setActiveNodeId(n.id)}
              className={`py-2 px-2.5 rounded-lg text-left transition-all border flex items-center justify-between ${
                isActive
                  ? 'bg-white border-indigo-400 ring-2 ring-indigo-100 shadow-sm'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="min-w-0 pr-1">
                <div className="text-[9px] font-mono uppercase text-slate-400 leading-none mb-0.5">{n.tier}</div>
                <div className={`text-xs font-bold truncate ${isActive ? 'text-indigo-950' : 'text-slate-800'}`}>
                  {n.id === 'ingress' ? 'Ingress' : n.id === 'processing' ? 'Processing' : 'Sovereign'}
                </div>
              </div>
              <span 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: n.color }}
              />
            </button>
          );
        })}
      </div>

      {/* Compact Active Tier Short Description (Replacing bulky card) */}
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
              ACTIVE TIER
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
