import SorteiosPanel from '../components/SorteiosPanel'
import SorteioBanner from '../components/SorteioBanner'

export default function SorteioPage() {
  return (
    <>
      <SorteioBanner />
      <div className="w-full max-w-4xl z-10 relative bg-zinc-900/80 rounded-2xl shadow-xl p-8 mt-6 mx-auto animate-in">
        <SorteiosPanel modoPublico />
      </div>
    </>
  )
}
