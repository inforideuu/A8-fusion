import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Globe2, 
  ShieldCheck, 
  Server, 
  Zap, 
  RotateCcw, 
  Play, 
  Pause, 
  Navigation, 
  CheckCircle2, 
  Cpu,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Verified operational hubs strictly conforming to enterprise governance specifications
const HUBS = [
  {
    id: 'singapore',
    name: 'Singapore Core Hub',
    city: 'Singapore',
    region: 'Asia-Pacific Headquarters',
    lat: 1.3521,
    lon: 103.8198,
    color: '#06B6D4', // Cyan
    glowColor: 'rgba(6, 182, 212, 0.4)',
    role: 'Regional Headquarters & Distributed Systems Integration Hub',
    facility: 'Level 24, Tower 1, Marina Bay Financial Centre, Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Arbitration', val: 'SIAC Aligned' },
      { label: 'Latency Interlink', val: '< 0.8ms Core' },
      { label: 'Architecture', val: 'ASEAN Cloud VPC' },
      { label: 'Audit Standard', val: 'MAS TRM / ISO 27001' }
    ],
    mission: 'High-concurrency financial switch integration, cross-border trade telemetry, and ASEAN public infrastructure backbones.'
  },
  {
    id: 'uae',
    name: 'United Arab Emirates Hub',
    city: 'Dubai, UAE',
    region: 'Middle East & GCC Operations',
    lat: 25.2048,
    lon: 55.2708,
    color: '#818CF8', // Indigo
    glowColor: 'rgba(129, 140, 248, 0.4)',
    role: 'Sovereign Public Sector & Municipal Technology Center',
    facility: 'DIFC Innovation Hub, Gate Avenue, Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Sovereign Policy', val: 'UAE Data Law / DIFC' },
      { label: 'Residency Node', val: 'Domestic In-Country' },
      { label: 'Latency Interlink', val: '< 1.1ms GCC' },
      { label: 'Security Model', val: 'Zero-Trust Enclave' }
    ],
    mission: 'Smart governance portals, sovereign identity infrastructure, and high-security municipal ERP deployments.'
  },
  {
    id: 'uk',
    name: 'United Kingdom Hub',
    city: 'London, UK',
    region: 'EMEA Governance & Architecture',
    lat: 51.5074,
    lon: -0.1278,
    color: '#A855F7', // Royal Purple
    glowColor: 'rgba(168, 85, 247, 0.4)',
    role: 'Enterprise Compliance, Architecture Advisory & GDPR Oversight',
    facility: '100 Bishopsgate, Level 18, City of London, UK',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Governance Law', val: 'LCIA Arbitration' },
      { label: 'Privacy Standard', val: 'UK & EU GDPR' },
      { label: 'Latency Interlink', val: '< 1.4ms EMEA' },
      { label: 'Engineering Core', val: 'Tier-1 SRE Pod' }
    ],
    mission: 'Enterprise architecture governance, cross-jurisdictional compliance, and sovereign AI platform research.'
  },
  {
    id: 'malaysia',
    name: 'Southeast Asia Engineering Squad',
    city: 'Kuala Lumpur',
    region: 'Southeast Asia Delivery',
    lat: 3.1390,
    lon: 101.6869,
    color: '#10B981', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.4)',
    role: 'Industrial Technology & Advanced Engineering Delivery Center',
    facility: 'Kuala Lumpur Tech Corridor, Malaysia',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Delivery Model', val: 'Dedicated Pods' },
      { label: 'Industrial Tech', val: 'Industry 4.0 / IoT' },
      { label: 'Synchronization', val: 'Follow-The-Sun' },
      { label: 'Compliance', val: 'PDPA Certified' }
    ],
    mission: 'Industrial shop-floor telemetry, supply chain tracking engines, and dedicated long-term engineering squads.'
  }
];

// Arcs between strategic operational hubs
const NETWORK_ARCS = [
  { from: 'singapore', to: 'uae', speed: 0.0018, color: '#06B6D4' },
  { from: 'uae', to: 'uk', speed: 0.0015, color: '#818CF8' },
  { from: 'singapore', to: 'uk', speed: 0.0012, color: '#A855F7' },
  { from: 'singapore', to: 'malaysia', speed: 0.0022, color: '#10B981' }
];

// Pre-generate continent dot clusters to give a true geographic silhouette on the 3D globe
function generateWorldDots() {
  const dots = [];
  
  // Latitude lines with dense points
  for (let lat = -70; lat <= 75; lat += 7) {
    const radiusAtLat = Math.cos((lat * Math.PI) / 180);
    const count = Math.max(8, Math.floor(64 * radiusAtLat));
    for (let i = 0; i < count; i++) {
      const lon = -180 + (i * 360) / count;
      
      // Determine if point falls loosely within landmass coordinate bounding boxes
      const isLand = (
        // Eurasia
        (lat >= 5 && lat <= 68 && lon >= -10 && lon <= 145) ||
        // North America
        (lat >= 15 && lat <= 70 && lon >= -165 && lon <= -55) ||
        // South America
        (lat >= -55 && lat <= 12 && lon >= -80 && lon <= -35) ||
        // Africa
        (lat >= -35 && lat <= 35 && lon >= -18 && lon <= 50) ||
        // Australia & Indonesia
        (lat >= -45 && lat <= -10 && lon >= 110 && lon <= 155) ||
        (lat >= -10 && lat <= 8 && lon >= 95 && lon <= 140)
      );

      // We add land dots with higher density, and coordinate grid dots elsewhere
      if (isLand) {
        dots.push({ lat, lon, isLand: true });
        // Add random jittered twin for organic continent density
        if (Math.random() > 0.4) {
          dots.push({ 
            lat: lat + (Math.random() * 3 - 1.5), 
            lon: lon + (Math.random() * 4 - 2), 
            isLand: true 
          });
        }
      } else if (i % 3 === 0) {
        // Celestial / latitude-longitude grid points over oceans
        dots.push({ lat, lon, isLand: false });
      }
    }
  }
  return dots;
}

const WORLD_DOTS = generateWorldDots();

export default function GlobalGlobe3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [activeHubId, setActiveHubId] = useState('singapore');
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hudPinned, setHudPinned] = useState(true);

  // Rotation angles (radians)
  const rotationRef = useRef({
    x: 0.22, // Slight tilt downward for 3D depth
    y: -1.8   // Initial view showing Singapore & Middle East
  });

  // Target rotation for smooth interpolation when clicking a hub
  const targetRotationRef = useRef(null);

  // Mouse / Touch interaction refs
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const animFrameRef = useRef(null);
  const packetPhasesRef = useRef([0.1, 0.4, 0.7, 0.2]);

  // Convert lat/lon in degrees to Cartesian 3D coordinates on sphere of radius R
  const latLonTo3D = useCallback((lat, lon, R) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = (lon * Math.PI) / 180;
    return {
      x: R * Math.cos(phi) * Math.sin(lambda),
      y: R * Math.sin(phi),
      z: R * Math.cos(phi) * Math.cos(lambda)
    };
  }, []);

  // Project 3D coordinate after rotation to 2D screen coordinate
  const projectPoint = useCallback((p, rotX, rotY, cx, cy, cameraDist) => {
    // Rotate around Y axis
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = p.x * cosY + p.z * sinY;
    const z1 = -p.x * sinY + p.z * cosY;

    // Rotate around X axis
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = p.y * cosX - z1 * sinX;
    const z2 = p.y * sinX + z1 * cosX;

    // Perspective scale
    const perspective = cameraDist / (cameraDist - z2);
    return {
      px: cx + x1 * perspective,
      py: cy - y2 * perspective,
      scale: perspective,
      z: z2,
      visible: z2 > -40 // Slightly past hemisphere edge for smooth wrap
    };
  }, []);

  // Smoothly rotate globe towards target hub
  const focusHub = useCallback((hubId) => {
    setActiveHubId(hubId);
    const hub = HUBS.find(h => h.id === hubId);
    if (!hub) return;

    // Target lon needs to face front (angle = 0 or -lambda)
    const targetY = - (hub.lon * Math.PI) / 180 + Math.PI / 2;
    const targetX = (hub.lat * Math.PI) / 180 * 0.4; // Soft tilt towards hub latitude

    targetRotationRef.current = {
      x: targetX,
      y: targetY
    };
  }, []);

  // Mouse & Touch Handlers
  const handlePointerDown = (clientX, clientY) => {
    setIsDragging(true);
    targetRotationRef.current = null; // Cancel automated transition
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      rotX: rotationRef.current.x,
      rotY: rotationRef.current.y
    };
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    
    // Smooth responsive sensitivity
    const sensitivity = 0.005;
    rotationRef.current.y = dragStartRef.current.rotY + dx * sensitivity;
    rotationRef.current.x = Math.max(-1.1, Math.min(1.1, dragStartRef.current.rotX - dy * sensitivity));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let radius = 170;
    let cameraDist = 700;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      // Responsive sphere sizing
      radius = Math.min(width, height) * 0.38;
      if (width < 500) radius = width * 0.42;
      cameraDist = radius * 4.2;
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(canvas);

    let lastTime = performance.now();

    const render = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Automated camera rotation easing if user clicked a hub
      if (targetRotationRef.current) {
        const ease = 0.06;
        rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * ease;
        
        // Wrap angle shortest distance for Y rotation
        let diffY = (targetRotationRef.current.y - rotationRef.current.y) % (Math.PI * 2);
        if (diffY > Math.PI) diffY -= Math.PI * 2;
        if (diffY < -Math.PI) diffY += Math.PI * 2;
        rotationRef.current.y += diffY * ease;

        if (Math.abs(diffY) < 0.01 && Math.abs(targetRotationRef.current.x - rotationRef.current.x) < 0.01) {
          targetRotationRef.current = null;
        }
      } else if (isRotating && !isDragging) {
        // Gentle continuous auto-spin
        rotationRef.current.y += 0.0028;
      }

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Atmospheric Ambient Glow behind Sphere
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.35);
      glowGrad.addColorStop(0, 'rgba(79, 70, 229, 0.16)');
      glowGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.08)');
      glowGrad.addColorStop(0.85, 'rgba(6, 182, 212, 0.03)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Translucent Glass Sphere Silhouette
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.35,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      sphereGrad.addColorStop(0.7, 'rgba(10, 16, 32, 0.9)');
      sphereGrad.addColorStop(1, 'rgba(30, 41, 59, 0.7)');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Thin Outer Horizon Edge Ring
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. Render Latitude & Longitude Coordinate Rings in 3D
      const ringLatitudes = [-45, -20, 0, 20, 45];
      ringLatitudes.forEach(ringLat => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 8) {
          const p3 = latLonTo3D(ringLat, lon, radius);
          const proj = projectPoint(p3, rotX, rotY, cx, cy, cameraDist);
          if (proj.z > -10) {
            if (first) {
              ctx.moveTo(proj.px, proj.py);
              first = false;
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = ringLat === 0 ? 'rgba(99, 102, 241, 0.35)' : 'rgba(148, 163, 184, 0.12)';
        ctx.lineWidth = ringLat === 0 ? 1 : 0.6;
        ctx.stroke();
      });

      // 4. Render World Dot Matrix (Continents & Global Network Mesh)
      for (let i = 0; i < WORLD_DOTS.length; i++) {
        const dot = WORLD_DOTS[i];
        const p3 = latLonTo3D(dot.lat, dot.lon, radius);
        const proj = projectPoint(p3, rotX, rotY, cx, cy, cameraDist);

        if (proj.z < -20) {
          // Back-hemisphere dots: faint translucent depth particles
          if (dot.isLand && i % 4 === 0) {
            ctx.fillStyle = 'rgba(100, 116, 139, 0.15)';
            ctx.beginPath();
            ctx.arc(proj.px, proj.py, 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
          continue;
        }

        // Front-hemisphere dots
        const depthRatio = Math.max(0, (proj.z + 20) / (radius + 20));
        const alpha = dot.isLand 
          ? 0.25 + depthRatio * 0.65 
          : 0.1 + depthRatio * 0.25;
        const size = (dot.isLand ? 1.4 : 0.9) * proj.scale;

        ctx.fillStyle = dot.isLand
          ? `rgba(165, 180, 252, ${alpha})`
          : `rgba(71, 85, 105, ${alpha})`;

        ctx.beginPath();
        ctx.arc(proj.px, proj.py, Math.max(0.6, size), 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Render 3D Parabolic Network Arcs & Moving Photons
      NETWORK_ARCS.forEach((arcConfig, idx) => {
        const hubA = HUBS.find(h => h.id === arcConfig.from);
        const hubB = HUBS.find(h => h.id === arcConfig.to);
        if (!hubA || !hubB) return;

        const pA = latLonTo3D(hubA.lat, hubA.lon, radius);
        const pB = latLonTo3D(hubB.lat, hubB.lon, radius);

        // Number of samples along 3D arc
        const steps = 36;
        const arcPoints = [];
        let allInBack = true;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          // Linear interpolation on sphere
          const ix = pA.x * (1 - t) + pB.x * t;
          const iy = pA.y * (1 - t) + pB.y * t;
          const iz = pA.z * (1 - t) + pB.z * t;
          const len = Math.sqrt(ix * ix + iy * iy + iz * iz) || 1;

          // Arc elevation: parabolic arch rising into 3D space above the globe surface
          const archHeight = Math.sin(t * Math.PI) * (radius * 0.28);
          const elevatedR = radius + archHeight;

          const arc3D = {
            x: (ix / len) * elevatedR,
            y: (iy / len) * elevatedR,
            z: (iz / len) * elevatedR
          };

          const proj = projectPoint(arc3D, rotX, rotY, cx, cy, cameraDist);
          arcPoints.push(proj);
          if (proj.z > 0) allInBack = false;
        }

        if (allInBack) return; // Arc completely hidden behind globe

        // Draw Arc Line
        ctx.beginPath();
        let started = false;
        arcPoints.forEach(pt => {
          if (pt.z > -30) {
            if (!started) {
              ctx.moveTo(pt.px, pt.py);
              started = true;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            started = false;
          }
        });

        ctx.strokeStyle = arcConfig.color + '66'; // 40% alpha
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Draw moving photon bead along the arc
        packetPhasesRef.current[idx] = (packetPhasesRef.current[idx] + arcConfig.speed * 60 * dt) % 1.0;
        const phase = packetPhasesRef.current[idx];
        const packetIdx = Math.floor(phase * (steps - 1));
        const packetNext = packetIdx + 1;
        const subT = (phase * (steps - 1)) - packetIdx;

        const pt1 = arcPoints[packetIdx];
        const pt2 = arcPoints[packetNext];

        if (pt1 && pt2 && (pt1.z > 0 || pt2.z > 0)) {
          const pkX = pt1.px + (pt2.px - pt1.px) * subT;
          const pkY = pt1.py + (pt2.py - pt1.py) * subT;
          const pkZ = pt1.z + (pt2.z - pt1.z) * subT;

          if (pkZ > -10) {
            // Photon core
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pkX, pkY, 2.8, 0, Math.PI * 2);
            ctx.fill();

            // Photon glow aura
            ctx.fillStyle = arcConfig.color;
            ctx.beginPath();
            ctx.arc(pkX, pkY, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 6. Render Verified Strategic Hub Beacons & Radar Pulses
      const nowMs = performance.now();
      HUBS.forEach(hub => {
        const p3 = latLonTo3D(hub.lat, hub.lon, radius);
        const proj = projectPoint(p3, rotX, rotY, cx, cy, cameraDist);

        // Only draw beacons if on front-facing hemisphere
        if (proj.z > 0) {
          const isSelected = hub.id === activeHubId;
          const radarPulse = (nowMs % 2200) / 2200; // 0 to 1 loop

          // Expanding radar ripple
          const radarRadius = 6 + radarPulse * (isSelected ? 26 : 16);
          const radarAlpha = Math.max(0, 1 - radarPulse) * (isSelected ? 0.8 : 0.4);

          ctx.strokeStyle = hub.color;
          ctx.lineWidth = isSelected ? 1.6 : 1;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, radarRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Outer secondary ring for selected hub
          if (isSelected) {
            const radarPulse2 = ((nowMs + 1100) % 2200) / 2200;
            const radarRadius2 = 6 + radarPulse2 * 26;
            const radarAlpha2 = Math.max(0, 1 - radarPulse2) * 0.6;
            ctx.strokeStyle = hub.color;
            ctx.beginPath();
            ctx.arc(proj.px, proj.py, radarRadius2, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Hub Solid Core
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, isSelected ? 4.5 : 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = hub.color;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, isSelected ? 3 : 2, 0, Math.PI * 2);
          ctx.fill();

          // Label Flag tag
          const labelOffsetY = isSelected ? -16 : -12;
          ctx.font = isSelected ? 'bold 11px JetBrains Mono, monospace' : '9px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          // Glow background for text legibility
          ctx.fillStyle = 'rgba(7, 13, 24, 0.85)';
          const textWidth = ctx.measureText(hub.city.toUpperCase()).width;
          ctx.fillRect(proj.px - textWidth / 2 - 4, proj.py + labelOffsetY - 12, textWidth + 8, 14);

          // Text foreground
          ctx.fillStyle = isSelected ? '#FFFFFF' : '#CBD5E1';
          ctx.fillText(hub.city.toUpperCase(), proj.px, proj.py + labelOffsetY);

          // Indicator pip
          ctx.fillStyle = hub.color;
          ctx.fillRect(proj.px - textWidth / 2 - 4, proj.py + labelOffsetY - 12, 2, 14);
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [latLonTo3D, projectPoint, activeHubId, isRotating, isDragging]);

  const currentHub = HUBS.find(h => h.id === activeHubId) || HUBS[0];

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#090F1E] via-[#060B18] to-[#040812] border border-slate-800 shadow-2xl overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Telemetry Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
            SOVEREIGN GLOBAL TOPOLOGY // 3D MESH ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Play/Pause Rotation */}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {isRotating ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isRotating ? 'Pause Orbit' : 'Resume Orbit'}</span>
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={() => focusHub('singapore')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title="Reset perspective to Singapore"
          >
            <RotateCcw className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">Reset Perspective</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas + Interactive HUD Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Globe Canvas Container */}
        <div 
          ref={containerRef}
          className="lg:col-span-7 relative flex items-center justify-center min-h-[340px] sm:min-h-[440px] lg:min-h-[520px] select-none cursor-grab active:cursor-grabbing touch-none"
          style={{ touchAction: 'none' }}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handlePointerUp}
        >
          {/* Interactive HTML5 3D Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full max-w-[540px] max-h-[540px] aspect-square block mx-auto z-10"
          />

          {/* Drag Instruction Cue */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur">
            <Navigation className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
            <span>Click &amp; drag or swipe to rotate 3D sphere</span>
          </div>
        </div>

        {/* Right: Hub Selector & Holographic Telemetry HUD */}
        <div className="lg:col-span-5 relative z-20 space-y-5">
          {/* Quick Hub Navigation Pills */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Select Operational Hub</span>
              <span className="text-indigo-400 font-bold">4 Verified Nodes</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {HUBS.map(hub => {
                const isActive = hub.id === activeHubId;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => focusHub(hub.id)}
                    className={`p-2.5 rounded-lg text-left transition-all border flex items-center justify-between ${
                      isActive
                        ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400 truncate">
                        {hub.region.split(' ')[0]}
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {hub.city}
                      </div>
                    </div>
                    <span 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: hub.color }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Hub Telemetry Card */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur shadow-xl overflow-hidden">
            {/* Realistic Hub Place Photo Banner */}
            <div className="relative h-28 w-full overflow-hidden">
              <img
                src={currentHub.image}
                alt={`A8Fusion ${currentHub.city} (${currentHub.country}) Sovereign Delivery Data Center Infrastructure`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              
              <div className="absolute top-2.5 right-2.5">
                <span 
                  className="text-[10px] font-mono px-2 py-0.5 rounded border backdrop-blur"
                  style={{ 
                    color: currentHub.color, 
                    borderColor: currentHub.color + '60',
                    backgroundColor: 'rgba(7, 13, 24, 0.8)'
                  }}
                >
                  LIVE TELEMETRY
                </span>
              </div>

              <div className="absolute bottom-2.5 left-4 right-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                  {currentHub.region}
                </span>
                <h4 className="text-base font-serif font-bold text-white leading-tight">
                  {currentHub.name}
                </h4>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {currentHub.mission}
              </p>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {currentHub.specs.map((item, i) => (
                <div key={i} className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[9px] font-mono uppercase text-slate-400">{item.label}</div>
                  <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5 truncate">{item.val}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="truncate pr-2">Facility: {currentHub.facility}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            </div>
          </div>
        </div>

          {/* Regulatory Verification Notice */}
          <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong className="text-white">Strict Jurisdictional Governance:</strong> All cross-border engineering deliverables conform to domestic in-country data isolation laws, bilateral IP ownership covenants, and ISO/IEC 27001 standards.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Global Network Stats Strip */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Operational Hubs</div>
          <div className="text-lg font-serif font-bold text-white mt-0.5">3 Strategic Hubs</div>
          <div className="text-[10px] font-mono text-indigo-400 mt-0.5">Singapore · UAE · UK</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Data Residency</div>
          <div className="text-lg font-serif font-bold text-white mt-0.5">100% In-Country</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Zero Foreign Ingress</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Delivery Model</div>
          <div className="text-lg font-serif font-bold text-white mt-0.5">Follow-The-Sun</div>
          <div className="text-[10px] font-mono text-blue-400 mt-0.5">24/7 SRE &amp; Sprint Cycles</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Arbitration Venue</div>
          <div className="text-lg font-serif font-bold text-white mt-0.5">SIAC / LCIA</div>
          <div className="text-[10px] font-mono text-purple-400 mt-0.5">Enforceable Treaties</div>
        </div>
      </div>
    </div>
  );
}

