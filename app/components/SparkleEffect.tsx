'use client';

import { useRef, useEffect } from 'react';

export default function SparkleEffect({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string; life: number;
    }[] = [];

    const colors = ['#10a37f', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#f59e0b'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        size: Math.random() * 4 + 2,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.02;
        p.opacity = Math.max(0, p.life);
        p.size *= 0.99;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();

          // Draw star shape
          const s = p.size;
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
            const method = j === 0 ? 'moveTo' : 'lineTo';
            ctx[method](
              p.x + Math.cos(angle) * s,
              p.y + Math.sin(angle) * s
            );
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
