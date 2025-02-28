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
  { title: 'Japanese Sample 1', artist: 'AFK', src: 'assets/1.mp3', art: 'assets/1.gif' },
  { title: 'Japanese Sample 2', artist: 'AFK', src: 'assets/2.mp3', art: 'assets/2.gif' },
  { title: 'Workin Out', artist: 'AFK, Reese', src: 'assets/3.mp3', art: 'assets/3.gif' },
  { title: 'Lost in your thoughts', artist: 'AFK', src: 'assets/4.mp3', art: 'assets/4.gif' },
  { title: 'Like What', artist: 'AFK, doht', src: 'assets/5.mp3', art: 'assets/5.gif' },
  { title: 'Drunk Text', artist: 'AFK, thatslamlam', src: 'assets/6.mp3', art: 'assets/6.gif' }
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
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent;
}

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

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);
audio.addEventListener('timeupdate', updateProgress);
progress.addEventListener('input', setProgress);

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