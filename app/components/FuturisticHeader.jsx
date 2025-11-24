export default function FuturisticHeader({ children }) {
  return (
    <header className="w-full py-8 px-6 bg-gradient-to-r from-[#232526] via-[#0f2027] to-[#00f2fe] shadow-2xl flex items-center justify-center border-b-4 border-[#00f2fe] backdrop-blur-md bg-opacity-80" style={{background: 'rgba(20, 24, 40, 0.7)'}}>
      <div className="absolute left-12 flex items-center z-10">{children}</div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold text-neon-blue tracking-widest drop-shadow-lg">Taverna Class</span>
          <span className="ml-4 px-3 py-1 rounded-full bg-[#00f2fe] text-black font-bold text-sm animate-pulse">Beta</span>
        </div>
      </div>
    </header>
  );
}
