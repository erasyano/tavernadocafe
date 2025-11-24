"use client";
import React, { useRef, useEffect } from "react";

// Canvas animado: estrelas e cometas neon
export default function NeonStarsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Estrelas
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.5,
      speed: Math.random() * 0.2 + 0.05,
      glow: Math.random() * 12 + 8,
      color: `hsl(${180 + Math.random() * 120}, 100%, 70%)`,
    }));

    // Cometas
    const comets = Array.from({ length: 3 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 180 + 120,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.2 + 0.7,
      color: `hsl(${180 + Math.random() * 120}, 100%, 60%)`,
      tail: Math.random() * 18 + 8,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Fundo escuro com gradiente mais escuro
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#10111a"); // ainda mais escuro
      grad.addColorStop(1, "#181922"); // ainda mais escuro
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Estrelas neon
      for (const s of stars) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.glow;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();
        // Movimento sutil
        s.x += s.speed;
        if (s.x > width) s.x = 0;
      }

      // Cometas neon
      for (const c of comets) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(
          c.x - Math.cos(c.angle) * c.len,
          c.y - Math.sin(c.angle) * c.len
        );
        ctx.strokeStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = c.tail;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.restore();
        // Movimento
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        if (
          c.x < -c.len ||
          c.x > width + c.len ||
          c.y < -c.len ||
          c.y > height + c.len
        ) {
          c.x = Math.random() * width;
          c.y = Math.random() * height;
          c.angle = Math.random() * Math.PI * 2;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    // Responsivo
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.92,
      }}
      aria-hidden="true"
    />
  );
}
