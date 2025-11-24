"use client";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import CategoryMenu from "../../components/CategoryMenu";

export default function DropdownCategorias({ categories, selectedCategory }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef();
  // Ref para alinhar o menu ao botão
  const buttonRef = useRef();
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ left: rect.left, top: rect.bottom + 4 });
    }
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 1000);
  };

  return (
    <div className="relative flex items-center h-full ml-72" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button ref={buttonRef} className="px-4 py-2 rounded-lg bg-[#181c2b] text-white font-semibold shadow hover:bg-[#232b3e] transition flex items-center gap-2">
        <svg width="20" height="20" fill="none" stroke="#00f2fe" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>
        Categorias
      </button>
      {typeof window !== 'undefined' && open && createPortal(
        <div className={`fixed w-64 bg-[#181c2b] border border-[#232b3e] rounded-xl shadow-xl z-[999999] transition-opacity duration-200 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          style={{ pointerEvents: open ? 'auto' : 'none', left: menuPosition.left, top: menuPosition.top }}>
          <div className="flex flex-col gap-2 p-3">
            <button
              className={`text-left px-4 py-2 rounded-lg transition-all font-medium mb-1 ${!selectedCategory ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black shadow-lg' : 'hover:bg-[#232b3e] text-white'}`}
              onClick={() => { window.location.href = '/perfil/tavernaclass'; }}
            >
              INICIO
            </button>
            <CategoryMenu 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={(catId) => {
                window.location.href = `/perfil/tavernaclass/${catId}`;
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}