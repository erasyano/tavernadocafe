export default function VideoPlayer({ youtubeId }) {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-[#00f2fe] bg-black flex items-center justify-center">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="Aula em vídeo"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
