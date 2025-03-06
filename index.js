// Select DOM elements
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const albumArt = document.getElementById('album-art');
const playlistEl = document.getElementById('playlist');

// List of songs
const songs = [
  { title: 'Drunk Text', artist: 'AFK, thatslamlam, YND, Blxthe', src: 'assets/6.mp3', art: 'assets/6.gif' },
  { title: '揽佬 Type Shat', artist: 'AFK', src: 'assets/typeshit.mp3', art: 'assets/1.gif' },
  { title: 'Tik Tok Type Shat', artist: 'AFK', src: 'assets/bee poo.mp3', art: 'assets/4.gif' },
  { title: 'Doja Cat Club Shat', artist: 'AFK', src: 'assets/doja cat.mp3', art: 'assets/2.gif' },
  { title: 'Shake Them Hips', artist: 'AFK, Remi', src: 'assets/3.mp3', art: 'assets/3.gif' },
  { title: 'Formulas', artist: 'AFK, spratta', src: 'assets/Formulas.mp3', art: 'assets/5.gif' }
];

let currentSongIndex = 0;

// Load a song
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  albumArt.src = song.art;

  // Update the play/pause button to "play" state
  const icon = playPauseBtn.querySelector('i');
  icon.classList.remove('fa-pause');
  icon.classList.add('fa-play');
}

// Play or pause the song
function togglePlayPause() {
  const icon = playPauseBtn.querySelector('i');
  if (audio.paused) {
    audio.play();
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
  } else {
    audio.pause();
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  }
}

// Update progress bar
function updateProgress() {
  if (!audio.duration) return; // Exit if duration is unavailable
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.setProperty('--progress', `${percent}%`);
}

// Smooth progress bar update
function updateProgressSmoothly() {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.setProperty('--progress', `${percent}%`);
  if (!audio.paused) {
    requestAnimationFrame(updateProgressSmoothly);
  }
}

// Start smooth progress updates when the song plays
audio.addEventListener('play', () => {
  requestAnimationFrame(updateProgressSmoothly);
});

// Seek to a specific time
function setProgress() {
  const seekTime = (progress.value / 100) * audio.duration;
  audio.currentTime = seekTime;
}

// Play previous song
function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();

  // Update the play/pause button and playlist active class
  const icon = playPauseBtn.querySelector('i');
  icon.classList.remove('fa-play');
  icon.classList.add('fa-pause');
  updatePlaylistActiveClass();
}

// Play next song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();

  // Update the play/pause button and playlist active class
  const icon = playPauseBtn.querySelector('i');
  icon.classList.remove('fa-play');
  icon.classList.add('fa-pause');
  updatePlaylistActiveClass();
}

// Autoplay the next song when the current song ends
audio.addEventListener('ended', () => {
  playNextSong();
  updatePlaylistActiveClass(); // Update the active class
});

// Populate the playlist
function populatePlaylist() {
  playlistEl.innerHTML = ''; // Clear existing playlist
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.dataset.index = index;

    // Highlight the currently playing song
    if (index === currentSongIndex) {
      li.classList.add('active');
    }

    // Add click event listener to play the song
    li.addEventListener('click', () => {
      currentSongIndex = index; // Update the current song index
      loadSong(currentSongIndex); // Load the selected song
      audio.play(); // Start playback

      // Update the play/pause button to "pause" state
      const icon = playPauseBtn.querySelector('i');
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');

      // Update the active class in the playlist
      updatePlaylistActiveClass();
    });

    playlistEl.appendChild(li);
  });
}

// Function to update the active class in the playlist
function updatePlaylistActiveClass() {
  const playlistItems = playlistEl.querySelectorAll('li');
  playlistItems.forEach((item, index) => {
    item.classList.toggle('active', index === currentSongIndex);
  });
}

// Volume Control
const volumeControl = document.getElementById('volume');

// Set initial volume
audio.volume = volumeControl.value;

// Update volume when the slider is moved
volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);
audio.addEventListener('timeupdate', updateProgress);
progress.addEventListener('input', setProgress);
volumeControl.addEventListener('input', () => {
  console.log('Volume changed:', volumeControl.value);
  audio.volume = volumeControl.value;
});

// Load the first song and populate the playlist on page load
loadSong(currentSongIndex);
populatePlaylist();

// Listen for the spacebar keydown event
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    togglePlayPause();
  }
});