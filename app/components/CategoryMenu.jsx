export default function CategoryMenu({ categories, selectedCategory, onSelect }) {
  return (
    <aside className="w-56 bg-[#181c2b] border-r border-[#2c5364] flex flex-col py-6 px-2 gap-2 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-neon-blue">Categorias</h2>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`text-left px-4 py-2 rounded-lg transition-all font-medium mb-1 ${selectedCategory === cat.id ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black shadow-lg' : 'hover:bg-[#232b3e] text-white'}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </aside>
  );
}
