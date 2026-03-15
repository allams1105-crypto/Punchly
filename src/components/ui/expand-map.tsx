"use client"
import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
}

export function LocationMap({
  location = "Tu empresa",
  coordinates = "Configura tu ubicación",
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleMouseLeave = () => {
    mouseX.set(0); mouseY.set(0); setIsHovered(false)
  }

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{ perspective: 1000, cursor: "pointer", userSelect: "none", position: "relative" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        style={{
          rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d",
          background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", position: "relative",
        }}
        animate={{ width: isExpanded ? 360 : 260, height: isExpanded ? 280 : 120 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(201,168,76,0.05), transparent, rgba(96,165,250,0.03))" }} />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div style={{ position: "absolute", inset: 0, background: "rgba(10,12,20,0.95)" }} />
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
                {[35, 65].map((y, i) => (
                  <motion.line key={"h"+i} x1="0%" y1={y+"%"} x2="100%" y2={y+"%"}
                    stroke="rgba(201,168,76,0.2)" strokeWidth="3"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} />
                ))}
                {[30, 70].map((x, i) => (
                  <motion.line key={"v"+i} x1={x+"%"} y1="0%" x2={x+"%"} y2="100%"
                    stroke="rgba(96,165,250,0.15)" strokeWidth="2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }} />
                ))}
                {[20, 50, 80].map((y, i) => (
                  <motion.line key={"hs"+i} x1="0%" y1={y+"%"} x2="100%" y2={y+"%"}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }} />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <motion.line key={"vs"+i} x1={x+"%"} y1="0%" x2={x+"%"} y2="100%"
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }} />
                ))}
              </svg>

              {[
                { top:"40%", left:"10%", w:"15%", h:"20%" },
                { top:"15%", left:"35%", w:"12%", h:"15%" },
                { top:"70%", left:"75%", w:"18%", h:"18%" },
                { top:"20%", right:"10%", w:"10%", h:"25%" },
                { top:"55%", left:"5%",  w:"8%",  h:"12%" },
                { top:"8%",  left:"75%", w:"14%", h:"10%" },
              ].map((b, i) => (
                <motion.div key={i}
                  style={{ position:"absolute", ...b, width:b.w, height:b.h, borderRadius:"3px",
                    background:"rgba(201,168,76,0.12)", border:"1px solid rgba(201,168,76,0.15)" }}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }} />
              ))}

              {/* Pin */}
              <motion.div
                style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}
                initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }}
                transition={{ type:"spring", stiffness:400, damping:20, delay:0.3 }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  style={{ filter:"drop-shadow(0 0 12px rgba(201,168,76,0.7))" }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#C9A84C"/>
                  <circle cx="12" cy="9" r="2.5" fill="#030508"/>
                </svg>
              </motion.div>

              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(6,8,16,0.8), transparent, transparent)", pointerEvents:"none" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div style={{ position:"relative", zIndex:10, height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"16px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              animate={{ opacity: isExpanded ? 0 : 1 }} transition={{ duration: 0.3 }}>
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" x2="9" y1="3" y2="18"/>
              <line x1="15" x2="15" y1="6" y2="21"/>
            </motion.svg>
            <div style={{ display:"flex", alignItems:"center", gap:"5px", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.15)", padding:"3px 10px", borderRadius:"100px" }}>
              <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#C9A84C", boxShadow:"0 0 6px #C9A84C" }} />
              <span style={{ fontSize:"10px", fontWeight:600, color:"rgba(201,168,76,0.8)", textTransform:"uppercase", letterSpacing:"1px", fontFamily:"var(--font-dm-sans)" }}>Geo</span>
            </div>
          </div>

          <div>
            <motion.p
              style={{ color:"#FAFAFA", fontFamily:"var(--font-syne)", fontWeight:700, fontSize:"13px", marginBottom:"3px" }}
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ type:"spring", stiffness:400, damping:25 }}
            >
              {location}
            </motion.p>
            <AnimatePresence>
              {isExpanded && (
                <motion.p style={{ color:"rgba(201,168,76,0.6)", fontSize:"11px", fontFamily:"var(--font-dm-sans)" }}
                  initial={{ opacity:0, y:-8, height:0 }} animate={{ opacity:1, y:0, height:"auto" }}
                  exit={{ opacity:0, y:-8, height:0 }} transition={{ duration:0.25 }}>
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.div
              style={{ height:"1px", background:"linear-gradient(to right, rgba(201,168,76,0.5), rgba(96,165,250,0.3), transparent)", originX:0 }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              transition={{ duration:0.4 }}
            />
          </div>
        </div>
      </motion.div>

      <motion.p
        style={{ position:"absolute", bottom:"-22px", left:"50%", x:"-50%", fontSize:"10px", color:"rgba(255,255,255,0.25)", whiteSpace:"nowrap", fontFamily:"var(--font-dm-sans)" }}
        animate={{ opacity: isHovered && !isExpanded ? 1 : 0, y: isHovered ? 0 : 4 }}
        transition={{ duration:0.2 }}
      >
        Click para expandir
      </motion.p>
    </motion.div>
  )
}