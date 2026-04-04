import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

interface FireEffectProps {
  width?: number;
  height?: number;
  intensity?: number;
}

export function FireEffect({
  width = 200,
  height = 120,
  intensity = 0.8,
}: FireEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const colors = [
      '#FFD700', // Gold
      '#FFA500', // Orange
      '#FF8C00', // Dark Orange
      '#FF6347', // Tomato
      '#FFE4B5', // Moccasin
    ];

    const createParticle = (): Particle => {
      return {
        x: Math.random() * width,
        y: height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 2,
        alpha: Math.random() * 0.5 + 0.3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighten';

      // Create new particles
      for (let i = 0; i < intensity * 3; i++) {
        if (Math.random() < 0.6) {
          particlesRef.current.push(createParticle());
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.1; // Gravity
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [width, height, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ filter: 'blur(1px)' }}
    />
  );
}
