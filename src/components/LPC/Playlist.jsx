import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, ChevronUp, ChevronDown, Plus, AudioLines } from 'lucide-react';

const SortableSong = ({ song, index, currentSongIndex, setCurrentSongIndex, setIsPlaying, removeSong, moveSong, playlistLength }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: song.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card p-4 flex flex-row items-center gap-4 cursor-pointer transition-all ${
        index === currentSongIndex ? 'bg-base-100/20 ' : 'hover:bg-base-100/10'
      }`}
      onClick={() => {
        setCurrentSongIndex(index);
        setIsPlaying(false);
      }}
    >
      <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center">
        {song.coverArt ? (
          <img src={song.coverArt} alt="Cover Art" className="object-cover w-full h-full" />
        ) : (
          <AudioLines size={24} className="text-green" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className='font-semibold truncate'>{song.title}</div>
        <div className='text-sm opacity-70 truncate'>{song.artist} • {song.album}</div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1">
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={(e) => { e.stopPropagation(); moveSong(index, index - 1); }}
          disabled={index === 0}
        >
          <ChevronUp size={16} />
        </button>
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={(e) => { e.stopPropagation(); moveSong(index, index + 1); }}
          disabled={index === playlistLength - 1}
        >
          <ChevronDown size={16} />
        </button>
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={(e) => { e.stopPropagation(); removeSong(song.id); }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const Playlist = ({ playlist, currentSongIndex, setCurrentSongIndex, setIsPlaying, handleFiles, removeSong, moveSong, removeAllSongs}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div
      className={`card w-full bg-transparent shadow-none p-4 text-white transition-all ${isDragActive ? 'border-2 border-dashed border-white/50' : 'border-2 border-transparent'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className='card-body p-0'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='card-title text-xl'>Lista de Reproducción 
            {playlist.length > 0 ? (` - ${playlist.length}`) : ( "" )}
          </h2>
          <div className='flex gap-2'>
            {playlist.length > 0 && (
              <button
                className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900"
                onClick={removeAllSongs}
              >
                <Trash2 size={20} />
              </button>
            )}
            <label htmlFor="file-upload" className="btn btn-ghost btn-square flex items-center justify-center shadow-none hover:border-transparent hover:bg-white/25 hover:text-gray-900 disabled:text-white/50">
              <Plus size={20} />
              <input
                id='file-upload'
                type='file'
                accept='audio/*'
                multiple
                onChange={handleFiles}
                className='hidden'
              />
            </label>
          </div>
        </div>
        <div className='space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]'>
          {playlist.length > 0 ? (
            <>
              {playlist.map((song, index) => (
                <SortableSong
                  key={song.id}
                  song={song}
                  index={index}
                  currentSongIndex={currentSongIndex}
                  setCurrentSongIndex={setCurrentSongIndex}
                  setIsPlaying={setIsPlaying}
                  removeSong={removeSong}
                  moveSong={moveSong}
                  playlistLength={playlist.length}
                />
              ))}
            </>
          ) : (
            <div className='card p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white/10'>
              <p className='text-center text-sm opacity-50'>Tu lista de reproducción está vacía.</p>
              <p className='text-center text-xs opacity-50'>Arrastra y suelta archivos aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;