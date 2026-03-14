import { useEffect, useRef } from 'react';

// ─── CONFIG ────────────────────────────────────────────────────────────────
const CONFIG = {
  nodeCount: 80,
  nodeColor: '#ff6b35',       // orange nodes
  lineColor: '#ff6b35',       // orange lines
  cursorNodeColor: '#ffffff', // ghost cursor node
  bgColor: 'transparent',     // let page bg show through
  maxLineDistance: 140,       // px — max distance to draw a line
  cursorRadius: 180,          // px — cursor influence radius
  cursorStrength: 0.012,      // how strongly nodes drift toward cursor
  nodeMinRadius: 1.5,
  nodeMaxRadius: 3.5,
  nodeBaseOpacity: 0.7,
  lineBaseOpacity: 0.18,
  speed: 0.35,                // base drift speed
};
// ───────────────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function ParticleNetwork({ config = {} }) {
  const canvasRef = useRef(null);
  const cfg = { ...CONFIG, ...config };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let W, H;
    let nodes = [];
    const mouse = { x: -9999, y: -9999 };

    // ── Node class ──────────────────────────────────────────────────────────
    class Node {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : (Math.random() < 0.5 ? -10 : H + 10);
        this.vx = (Math.random() - 0.5) * cfg.speed;
        this.vy = (Math.random() - 0.5) * cfg.speed;
        this.r = cfg.nodeMinRadius + Math.random() * (cfg.nodeMaxRadius - cfg.nodeMinRadius);
        this.baseOpacity = 0.4 + Math.random() * 0.6;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.02;
      }

      update() {
        // Gentle cursor attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.cursorRadius && dist > 0) {
          const force = (1 - dist / cfg.cursorRadius) * cfg.cursorStrength;
          this.vx += dx / dist * force;
          this.vy += dy / dist * force;
        }

        // Velocity damping
        this.vx *= 0.995;
        this.vy *= 0.995;

        // Clamp max speed
        const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpd = cfg.speed * 2.5;
        if (spd > maxSpd) { this.vx = (this.vx / spd) * maxSpd; this.vy = (this.vy / spd) * maxSpd; }

        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += this.pulseSpeed;

        // Wrap edges
        if (this.x < -20) this.x = W + 20;
        if (this.x > W + 20) this.x = -20;
        if (this.y < -20) this.y = H + 20;
        if (this.y > H + 20) this.y = -20;
      }

      draw() {
        const pulse = 0.85 + 0.15 * Math.sin(this.pulsePhase);
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = dist < cfg.cursorRadius ? (1 - dist / cfg.cursorRadius) : 0;
        const opacity = Math.min(1, this.baseOpacity * pulse + proximity * 0.4);
        const radius = this.r + proximity * 2.5;

        // Glow on proximity
        if (proximity > 0.1) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, radius * 3, 0, Math.PI * 2);
          const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 3);
          grd.addColorStop(0, `rgba(${hexToRgb(cfg.nodeColor)},${proximity * 0.25})`);
          grd.addColorStop(1, `rgba(${hexToRgb(cfg.nodeColor)},0)`);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(cfg.nodeColor)},${opacity})`;
        ctx.fill();
      }
    }

    // ── Setup ───────────────────────────────────────────────────────────────
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function init() {
      resize();
      nodes = Array.from({ length: cfg.nodeCount }, () => new Node());
    }

    // ── Draw connections ────────────────────────────────────────────────────
    function drawLines() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > cfg.maxLineDistance) continue;

          const t = 1 - dist / cfg.maxLineDistance;

          // Extra brightness if either node is near cursor
          const dma = Math.sqrt((mouse.x - a.x) ** 2 + (mouse.y - a.y) ** 2);
          const dmb = Math.sqrt((mouse.x - b.x) ** 2 + (mouse.y - b.y) ** 2);
          const cursorBoost = Math.max(
            dma < cfg.cursorRadius ? (1 - dma / cfg.cursorRadius) * 0.4 : 0,
            dmb < cfg.cursorRadius ? (1 - dmb / cfg.cursorRadius) * 0.4 : 0
          );

          const opacity = cfg.lineBaseOpacity * t * t + cursorBoost;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${hexToRgb(cfg.lineColor)},${opacity})`;
          ctx.lineWidth = 0.6 + t * 0.8;
          ctx.stroke();
        }
      }

      // Lines from cursor ghost node to nearby real nodes
      const mx = mouse.x, my = mouse.y;
      for (const n of nodes) {
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > cfg.cursorRadius * 0.85) continue;
        const t = 1 - dist / (cfg.cursorRadius * 0.85);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = `rgba(${hexToRgb(cfg.cursorNodeColor)},${t * 0.35})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // ── Draw cursor node ────────────────────────────────────────────────────
    function drawCursorNode() {
      if (mouse.x < 0) return;
      const r = 3;
      // Outer glow
      const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, r * 6);
      grd.addColorStop(0, `rgba(${hexToRgb(cfg.cursorNodeColor)},0.18)`);
      grd.addColorStop(1, `rgba(${hexToRgb(cfg.cursorNodeColor)},0)`);
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, r * 6, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Core dot
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(cfg.cursorNodeColor)},0.9)`;
      ctx.fill();
    }

    // ── Render loop ─────────────────────────────────────────────────────────
    function render() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      nodes.forEach(n => { n.update(); n.draw(); });
      drawCursorNode();
      animId = requestAnimationFrame(render);
    }

    // ── Event listeners ─────────────────────────────────────────────────────
    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () => { resize(); };

    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    init();
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none', // lets clicks pass through to content
        zIndex: 0,
      }}
    />
  );
}