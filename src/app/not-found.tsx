import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="w-9 h-9 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-base">P</span>
          </div>
          <span className="text-white font-black text-xl">Punchly.Clock</span>
        </div>

        <div className="mb-8">
          <p className="text-[#E8B84B] text-8xl font-black leading-none mb-4">404</p>
          <h1 className="text-2xl font-black text-white mb-3">Página no encontrada</h1>
          <p className="text-white/40 text-sm">La página que buscas no existe o fue movida.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/en"
            className="bg-[#E8B84B] text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-[#d4a43a] transition">
            Ir al inicio
          </Link>
          <Link href="/en/admin/dashboard"
            className="border border-white/15 text-white/70 px-6 py-3 rounded-xl font-semibold text-sm hover:border-white/30 hover:text-white transition">
            Mi dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}