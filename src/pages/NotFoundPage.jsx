import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded border border-[#2A2828] bg-[#151417] p-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-[#7A7570]">404</p>
      <h1 className="mt-2 font-['Bebas_Neue'] text-5xl text-[#C81E3A]">Page Not Found</h1>
      <p className="mt-4 text-[#7A7570]">Halaman yang Anda cari tidak tersedia.</p>
      <Link to="/" className="mt-6 inline-block rounded border border-[#C81E3A] bg-[#C81E3A] px-4 py-2 text-sm font-medium text-white">
        Kembali ke Dashboard
      </Link>
    </div>
  )
}
