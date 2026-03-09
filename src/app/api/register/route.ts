import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const company = body.company || body.orgName;
  const { name, email, password } = body;

  if (!company || !name || !email || !password) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 });

  const slug = company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
  const hashedPassword = await bcrypt.hash(password, 10);

  const org = await prisma.organization.create({
    data: {
      name: company,
      slug,
      users: {
        create: { name, email, pin: hashedPassword, role: "OWNER", isActive: true },
      },
    },
  });

  // Welcome email
  try {
    await resend.emails.send({
      from: "Punchly.Clock <onboarding@resend.dev>",
      to: email,
      subject: "Bienvenido a Punchly.Clock 🎉",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,sans-serif;background:#f9fafb;padding:40px 20px;margin:0;">
  <div style="max-width:520px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#000;padding:32px;text-align:center;">
      <div style="width:48px;height:48px;background:#E8B84B;border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
        <span style="color:black;font-weight:900;font-size:22px;line-height:48px;display:block;">P</span>
      </div>
      <h1 style="color:white;font-size:22px;font-weight:900;margin:0;">Punchly.Clock</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="font-size:20px;font-weight:900;color:#111;margin:0 0 8px;">¡Bienvenido, ${name}! 👋</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Tu empresa <strong style="color:#111;">${company}</strong> ya está lista en Punchly.Clock. Tienes <strong style="color:#E8B84B;">14 días gratis</strong> para explorar todo.</p>
      
      <div style="background:#f9fafb;border-radius:14px;padding:20px;margin-bottom:24px;">
        <p style="font-size:13px;font-weight:700;color:#111;margin:0 0 12px;">Para empezar:</p>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="width:6px;height:6px;background:#E8B84B;border-radius:50%;shrink:0;"></div>
          <p style="font-size:13px;color:#6b7280;margin:0;">Agrega tus empleados desde el dashboard</p>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="width:6px;height:6px;background:#E8B84B;border-radius:50%;"></div>
          <p style="font-size:13px;color:#6b7280;margin:0;">Configura un Kiosk en tu tablet o computadora</p>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:6px;height:6px;background:#E8B84B;border-radius:50%;"></div>
          <p style="font-size:13px;color:#6b7280;margin:0;">Revisa la nómina al final de cada quincena</p>
        </div>
      </div>

      <a href="https://punchlyclock.vercel.app/en/admin/dashboard"
        style="display:block;background:#E8B84B;color:black;text-align:center;padding:14px;border-radius:14px;font-weight:900;font-size:14px;text-decoration:none;">
        Ir a mi dashboard →
      </a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">Punchly.Clock · Si no creaste esta cuenta ignora este email</p>
    </div>
  </div>
</body>
</html>`,
    });
  } catch(e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ success: true, organizationId: org.id });
}