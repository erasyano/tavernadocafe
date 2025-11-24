export default function PlaylistPanel({ playlists, selectedPlaylist, onSelect, selectedLesson, onLessonSelect }) {
  return (
    <div className="w-72 bg-[#1a2236] rounded-xl p-4 shadow-xl flex flex-col gap-4 border border-[#2c5364]">
      <h3 className="text-lg font-semibold text-neon-blue mb-2">Playlists</h3>
      {playlists.map((pl) => (
        <div key={pl.id} className="mb-4">
          <button
            className={`w-full text-left px-3 py-2 rounded-md font-bold mb-2 transition-all ${selectedPlaylist === pl.id ? 'bg-gradient-to-r from-[#43e97b] to-[#38f9d7] text-black shadow' : 'hover:bg-[#232b3e] text-white'}`}
            onClick={() => onSelect(pl.id)}
          >
            {pl.name}
          </button>
          <ul className="ml-2 mt-1">
            {pl.lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  className={`block w-full text-left px-2 py-1 rounded transition-all text-sm ${selectedLesson === lesson.id ? 'bg-[#00f2fe] text-black' : 'hover:bg-[#232b3e] text-white'}`}
                  onClick={() => onLessonSelect(lesson.id)}
                >
                  {lesson.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
