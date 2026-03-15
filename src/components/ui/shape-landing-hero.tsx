"use client";
import { useEffect, useRef } from "react";

// Cambiamos el nombre para que coincida con la lógica interna
function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, `#version 300 es
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
  uv.x+=.25;uv*=vec2(2,1);
  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);
  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  vec3 gold=vec3(0.788,0.659,0.298);
  col=mix(col,gold,dot(col,vec3(.21,.71,.07)));
  col=mix(vec3(.06,.07,.1),col,min(time*.1,1.));
  col=clamp(col,.06,1.);
  O=vec4(col,1);
}`);
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
      const c = canvasRef.current;
      // Blindaje de seguridad para TS
      if (!c || !gl) return;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    }
    
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    function loop(now: number) {
      const c = canvasRef.current;
      // Blindaje de seguridad para TS
      if (!c || !gl) return;
      gl.clearColor(0,0,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.uniform2f(resLoc, c.width, c.height);
      gl.uniform1f(timeLoc, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    }
    loop(0);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.45}} 
    />
  );
}

// Exportamos HeroGeometric explícitamente para que page.tsx lo vea
export function HeroGeometric({ badge, title1, title2 }: { badge: string; title1: string; title2: string }) {
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",
      background:"radial-gradient(ellipse at 20% 0%, rgba(96,165,250,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(201,168,76,0.15) 0%, transparent 50%), #060810"}}>
      
      <SmokeCanvas />

      {/* Overlay gradient */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, rgba(6,8,16,0.2) 0%, rgba(6,8,16,0.4) 60%, rgba(6,8,16,1) 100%)",zIndex:1}} />

      {/* 3D morphing shapes */}
      <div style={{position:"absolute",inset:0,zIndex:2,overflow:"hidden",pointerEvents:"none"}}>
        <style>{`
          @keyframes morph1{0%,100%{border-radius:40% 60% 70% 30%/40% 50% 60% 50%}50%{border-radius:70% 30% 30% 70%/50% 70% 30% 50%}}
          @keyframes morph2{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
          @keyframes float-shape{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-30px) rotate(180deg)}}
          @keyframes hero-fade-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
          .shape-1{animation:morph1 14s ease-in-out infinite}
          .shape-2{animation:morph2 18s ease-in-out infinite reverse}
          .shape-3{animation:float-shape 10s ease-in-out infinite}
          .hero-fade-1{animation:hero-fade-up 1s ease 0.5s both}
          .hero-fade-2{animation:hero-fade-up 1s ease 0.7s both}
          .hero-fade-3{animation:hero-fade-up 1s ease 0.9s both}
          .hero-fade-4{animation:hero-fade-up 1s ease 1.1s both}
          .hero-btn-gold{background:linear-gradient(135deg,#FFD166,#C9A84C);color:#000;font-family:var(--font-syne);font-weight:700;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);text-decoration:none;display:inline-block}
          .hero-btn-gold:hover{transform:translateY(-4px) scale(1.04);box-shadow:0 24px 60px rgba(201,168,76,0.5)}
          .hero-btn-ghost{background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);transition:all 0.3s ease;text-decoration:none;display:inline-block}
          .hero-btn-ghost:hover{background:rgba(255,255,255,0.1);color:white;transform:translateY(-2px)}
        `}</style>
        
        <div className="shape-1" style={{position:"absolute",top:"10%",right:"8%",width:"420px",height:"420px",
          background:"linear-gradient(135deg,rgba(201,168,76,0.06),rgba(255,209,102,0.03))",
          border:"1px solid rgba(201,168,76,0.08)",backdropFilter:"blur(2px)"}} />
        <div className="shape-2" style={{position:"absolute",bottom:"15%",left:"3%",width:"280px",height:"280px",
          background:"linear-gradient(135deg,rgba(96,165,250,0.05),rgba(139,92,246,0.03))",
          border:"1px solid rgba(96,165,250,0.08)"}} />
        <div className="shape-3" style={{position:"absolute",top:"35%",left:"5%",width:"100px",height:"100px",borderRadius:"50%",
          background:"rgba(201,168,76,0.04)",border:"1px solid rgba(201,168,76,0.1)"}} />
      </div>

      <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"120px 24px 80px",maxWidth:"900px",margin:"0 auto",width:"100%"}}>
        <div className="hero-fade-1" style={{display:"inline-flex",alignItems:"center",gap:"8px",
          background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",
          padding:"7px 18px",borderRadius:"100px",fontSize:"12px",color:"rgba(255,255,255,0.45)",marginBottom:"32px",fontFamily:"var(--font-dm-sans)"}}>
          <div style={{width:"6px",height:"6px",background:"#C9A84C",borderRadius:"50%",boxShadow:"0 0 8px #C9A84C"}} />
          {badge}
        </div>

        <h1 className="hero-fade-2" style={{fontFamily:"var(--font-syne)",fontSize:"clamp(42px,8vw,92px)",fontWeight:800,
          lineHeight:1,letterSpacing:"-3px",marginBottom:"24px",color:"white"}}>
          {title1}<br/>
          <span style={{background:"linear-gradient(135deg,#FFD166,#C9A84C,#FFD166)",WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",backgroundClip:"text",
            filter:"drop-shadow(0 0 40px rgba(201,168,76,0.4))"}}>
            {title2}
          </span>
        </h1>

        <p className="hero-fade-3" style={{color:"rgba(255,255,255,0.35)",fontSize:"clamp(15px,2vw,19px)",
          maxWidth:"500px",margin:"0 auto 44px",lineHeight:1.7,fontWeight:300,fontFamily:"var(--font-dm-sans)"}}>
          Kiosk con PIN, geofencing desde el móvil y reportes automáticos. Todo por un pago único de $49.
        </p>

        <div className="hero-fade-4" style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/en/register" className="hero-btn-gold" style={{padding:"16px 36px",borderRadius:"16px",fontSize:"15px",
            boxShadow:"0 0 60px rgba(201,168,76,0.3)"}}>
            Empezar 7 días gratis
          </a>
          <a href="/en/login" className="hero-btn-ghost" style={{padding:"16px 36px",borderRadius:"16px",fontSize:"15px",
            fontFamily:"var(--font-dm-sans)",fontWeight:500}}>
            Ya tengo cuenta
          </a>
        </div>
      </div>
    </div>
  );
}