export default function LessonDetails({ lesson }) {
  if (!lesson) return null;
  return (
    <div className="bg-[#181c2b] rounded-xl p-4 shadow-lg border border-[#2c5364] mt-2">
      <h2 className="text-2xl font-bold text-neon-blue mb-2">{lesson.title}</h2>
      <p className="text-base text-gray-200 mb-2">{lesson.description}</p>
      {/* Futuramente: botões de navegação, progresso, comentários, etc. */}
    </div>
  );
}
