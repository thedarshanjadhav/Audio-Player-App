import './App.css'

import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(storedPlaylist);

    const lastTrackIndex = parseInt(localStorage.getItem('currentTrackIndex'), 10) || 0;
    setCurrentTrackIndex(lastTrackIndex);

    const lastPlaybackTime = parseFloat(localStorage.getItem('lastPlaybackTime')) || 0;
    if (audioRef.current) {
      audioRef.current.currentTime = lastPlaybackTime;
    }
  }, []);

  // Update playlist in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const updatedPlaylist = [...playlist, ...files];
    setPlaylist(updatedPlaylist);
  };

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  useEffect(() => {
    localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      localStorage.setItem('lastPlaybackTime', audioRef.current.currentTime.toString());
    }
  };

  const currentFile = playlist[currentTrackIndex];

  return (
    <div className='container'>
      <h1>Audio Player App</h1>
      <input type="file" accept=".mp3" onChange={handleFileUpload} multiple />
      <h2>Playlist</h2>
      <ul>
        {playlist.map((track, index) => (
          <li key={index} onClick={() => setCurrentTrackIndex(index)}>
            {track.name}
          </li>
        ))}
      </ul>
      {currentFile && (
        <div>
          <h2>Now Playing</h2>
          <audio
            controls
            autoPlay
            onEnded={playNextTrack}
            onTimeUpdate={handleTimeUpdate}
            ref={audioRef}
            src={URL.createObjectURL(currentFile)}
          />
        </div>
      )}
    </div>
  );
}

export default App;

