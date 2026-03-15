import { writeFileSync, mkdirSync } from "fs";

mkdirSync("src/components/ui", { recursive: true });

// Create HeroGeometric component
writeFileSync("src/components/ui/shape-landing-hero.tsx", `"use client";
import { useEffect, useRef } from "react";

function SmokeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, \`#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}\`);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, \`#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}
void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25; uv*=vec2(2,1);
  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);
  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  vec3 gold=vec3(0.788,0.659,0.298);
  col=mix(col,gold,dot(col,vec3(.21,.71,.07)));
  col=mix(vec3(.08),col,min(time*.1,1.));
  col=clamp(col,.08,1.);
  O=vec4(col,1);
}\`);
    gl.compileShader(fs);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(prog, "resolution");
    const timeLoc = gl.getUniformLocation(prog, "time");

    function resize() {
      const dpr = Math.max(1, devicePixelRatio);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    function loop(now: number) {
      gl.clearColor(0,0,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    }
    loop(0);

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.4}} />;
}

export function HeroGeometric({ badge, title1, title2 }: { badge: string; title1: string; title2: string }) {
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#030303"}}>
      {/* Smoke */}
      <SmokeBackground />

      {/* Overlay */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(3,3,3,0.3) 0%,rgba(3,3,3,0.5) 60%,rgba(3,3,3,0.95) 100%)",zIndex:1}} />

      {/* 3D geometric shapes */}
      <div style={{position:"absolute",inset:0,zIndex:1,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"15%",right:"10%",width:"300px",height:"300px",borderRadius:"40% 60% 70% 30%/40% 50% 60% 50%",background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.02))",border:"1px solid rgba(201,168,76,0.1)",animation:"morph 12s ease-in-out infinite",backdropFilter:"blur(2px)"}} />
        <div style={{position:"absolute",bottom:"20%",left:"5%",width:"200px",height:"200px",borderRadius:"30% 70% 50% 50%/50% 30% 70% 50%",background:"linear-gradient(135deg,rgba(255,255,255,0.03),rgba(201,168,76,0.04))",border:"1px solid rgba(255,255,255,0.05)",animation:"morph 16s ease-in-out infinite reverse"}} />
        <div style={{position:"absolute",top:"40%",left:"3%",width:"120px",height:"120px",borderRadius:"50%",background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.08)",animation:"float2 8s ease-in-out infinite"}} />
      </div>

      <style>{\`
        @keyframes morph{0%,100%{border-radius:40% 60% 70% 30%/40% 50% 60% 50%}50%{border-radius:70% 30% 30% 70%/50% 70% 30% 50%}}
        @keyframes float2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(180deg)}}
        @keyframes fade-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .hero-badge{animation:fade-up 0.8s ease 0.1s both}
        .hero-title{animation:fade-up 0.8s ease 0.25s both}
        .hero-sub{animation:fade-up 0.8s ease 0.4s both}
        .hero-btns{animation:fade-up 0.8s ease 0.55s both}
        .hero-btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .hero-btn-gold:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 20px 50px rgba(201,168,76,0.4)}
        .hero-btn-ghost{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);transition:all 0.3s ease}
        .hero-btn-ghost:hover{background:rgba(255,255,255,0.08);color:white}
      \`}</style>

      {/* Content */}
      <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"0 24px",maxWidth:"900px",margin:"0 auto"}}>
        <div className="hero-badge" style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",padding:"7px 18px",borderRadius:"100px",fontSize:"12px",color:"rgba(255,255,255,0.4)",marginBottom:"32px",fontFamily:"var(--font-dm-sans)"}}>
          <div style={{width:"6px",height:"6px",background:"#C9A84C",borderRadius:"50%"}} />
          {badge}
        </div>

        <h1 className="hero-title" style={{fontFamily:"var(--font-syne)",fontSize:"clamp(48px,8vw,90px)",fontWeight:800,lineHeight:1,letterSpacing:"-2px",marginBottom:"24px",color:"white"}}>
          {title1}<br/>
          <span style={{background:"linear-gradient(135deg,#C9A84C,#F0D080,#C9A84C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
            {title2}
          </span>
        </h1>

        <p className="hero-sub" style={{color:"rgba(255,255,255,0.35)",fontSize:"18px",maxWidth:"480px",margin:"0 auto 40px",lineHeight:1.7,fontWeight:300,fontFamily:"var(--font-dm-sans)"}}>
          Kiosk con PIN, geofencing desde el móvil y reportes automáticos. Todo por un pago único.
        </p>

        <div className="hero-btns" style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/en/register" className="hero-btn-gold" style={{padding:"16px 36px",borderRadius:"16px",fontSize:"15px",textDecoration:"none",display:"inline-block",boxShadow:"0 0 40px rgba(201,168,76,0.2)"}}>
            Empezar 7 días gratis
          </a>
          <a href="/en/login" className="hero-btn-ghost" style={{padding:"16px 36px",borderRadius:"16px",fontSize:"15px",textDecoration:"none",display:"inline-block",fontFamily:"var(--font-dm-sans)",fontWeight:500}}>
            Ya tengo cuenta
          </a>
        </div>
      </div>
    </div>
  );
}`);

console.log("Listo!");

