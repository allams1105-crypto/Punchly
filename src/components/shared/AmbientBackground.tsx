"use client";

export default function AmbientBackground() {
  return (
    <>
      <style>{`
        @keyframes floatBg{
          0%,100%{transform:translateY(0) scale(1)}
          50%{transform:translateY(-50px) scale(1.1)}
        }
      `}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden",background:"#0A0A0A"}}>
        <div style={{
          position:"absolute",top:"-10%",left:"10%",width:"60vw",height:"60vw",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)",
          filter:"blur(80px)",animation:"floatBg 20s ease-in-out infinite"
        }} />
        <div style={{
          position:"absolute",bottom:"-20%",right:"-10%",width:"70vw",height:"70vw",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%)",
          filter:"blur(100px)",animation:"floatBg 25s ease-in-out infinite reverse"
        }} />
      </div>
    </>
  );
}
