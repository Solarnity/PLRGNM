import { useState } from 'react';
import { Link } from 'react-router';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, AudioLines, Mic, ListMusic, ChevronLeft } from 'lucide-react';

const Player = ({
  isPlaying,
  playlist,
  currentSongIndex,
  togglePlay,
  playNext,
  playPrevious,
  volume,
  setVolume,
  progress,
  duration,
  handleSeek,
  noBg,
  tab,
  setTab
}) => {
  const currentSong = playlist[currentSongIndex];
	const [isVolumeHovered, setIsVolumeHovered] = useState(false);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-white"
    >
      <div className="flex items-center justify-between w-full lg:w-[85%] lg:translate-y-[-170px] mb-4 lg:mb-0">
        <Link
          to="/"
          className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 disabled:text-white/50"
        >
          <ChevronLeft/>
        </Link>
      </div>

      <div className="text-center w-full">
        <h2 className='text-sm opacity-70'>
          {currentSong ? `Track ${currentSong.track}` : ""}
        </h2>
        <h2 className="text-xl font-semibold mb-4">
          {currentSong ? currentSong.album : ""}
        </h2>
        <div className={`flex w-full justify-center overflow-hidden mb-4 ${noBg ? '' : 'bg-white/10'}`}>
          {currentSong && currentSong.coverArt ? (
            <img 
              src={currentSong.coverArt} 
              alt="Cover Art" 
              className="object-cover aspect-square rounded-lg max-w-[200px] lg:max-w-[300px]" 
            />
          ) : (
            <div className="flex aspect-square max-w-[200px] lg:max-w-[300px] w-full justify-center items-center rounded-lg bg-white/10">
              <AudioLines size={80} className="text-white lg:size-[120px]" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold truncate px-4">
          {currentSong ? currentSong.title : "-"}
        </h2>
        <p className="text-sm opacity-70 mb-4 px-4">
          {currentSong ? currentSong.artist : "-"}
        </p>
      </div>

      <div className="w-full flex items-center justify-center gap-4 mt-4 px-4">
        <span className="text-sm lg:text-base">{formatTime(progress)}</span>
        <input
          type="range"
          value={progress}
          max={duration}
          onChange={handleSeek}
          className="range range-white w-[60%] lg:w-[70%] [--range-thumb:transparent] [--range-thumb-size:0.3rem]"
          step="0.1"
          disabled={!currentSong}
        />
        <span className="text-sm lg:text-base">{formatTime(duration)}</span>
      </div>

			{/* Contenedor principal de los controles */}
      <div className="flex items-center justify-between w-full lg:w-[85%] mt-6 px-4 lg:px-0">
        {/* Contenedor para el botón de volumen y su slider */}
        <div
          className="relative hidden lg:block"
          onMouseEnter={() => setIsVolumeHovered(true)}
          onMouseLeave={() => setIsVolumeHovered(false)}
        >
          <button
            onClick={() => setVolume(volume === 0 ? 0.15 : 0)}
            className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 disabled:text-white/50"
          >
            {volume > 0 ? <Volume2 /> : <VolumeX />}
          </button>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className={`
                transition-all duration-300 ease-in-out
                ${isVolumeHovered ? 'w-24 opacity-100' : 'w-0 opacity-0 pointer-events-none'}
                range range-white [--range-thumb:transparent] [--range-thumb-size:0.3rem]
              `}
            />
          </div>
        </div>

        {/* Contenedor de los botones de reproducción, ahora en el centro */}
        <div className="flex items-center gap-4 lg:gap-6 w-full justify-center">
          <button
            onClick={playPrevious}
            className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 disabled:text-white/50"
            disabled={currentSongIndex === 0 || playlist.length === 0}
          >
            <SkipBack size={20} className="lg:size-6" />
          </button>
          <button
            onClick={togglePlay}
            className="btn btn-lg btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 disabled:text-white/50"
            disabled={playlist.length === 0}
          >
            {isPlaying ? <Pause size={24} className="lg:size-8" /> : <Play size={24} className="lg:size-8" />}
          </button>
          <button
            onClick={playNext}
            className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 disabled:text-white/50"
            disabled={currentSongIndex === playlist.length - 1 || playlist.length === 0}
          >
            <SkipForward size={20} className="lg:size-6" />
          </button>
        </div>

        <button
          onClick={() => setTab(tab === 'playlist' ? 'lyrics' : 'playlist')}
          className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 hidden lg:flex"
        >
          {tab === 'playlist' ? <Mic /> : <ListMusic />}
        </button>

        {/* Control de volumen para móvil */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setVolume(volume === 0 ? 0.15 : 0)}
            className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 disabled:text-white/50"
          >
            {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 range range-white [--range-thumb:transparent] [--range-thumb-size:0.3rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;