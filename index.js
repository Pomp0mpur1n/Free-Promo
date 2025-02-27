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

// List of songs (add more as needed)
const songs = [
  { title: 'Japanese Sample 1', artist: 'AFK', src: 'assets/1.opus', art: 'assets/1.gif' },
  { title: 'Japanese Sample 2', artist: 'AFK', src: 'assets/2.opus', art: 'assets/2.gif' },
  { title: 'Working Out', artist: 'AFK, Ethan', src: 'assets/3.opus', art: 'assets/3.gif' },
  { title: 'Mixed Emotions', artist: 'AFK, bag of chips', src: 'assets/4.opus', art: 'assets/4.gif' },
  { title: 'Like What', artist: 'AFK, doht,', src: 'assets/5.opus', art: 'assets/5.gif' },
  { title: 'Moonrock', artist: 'AFK, Eskii', src: 'assets/6.opus', art: 'assets/6.gif' }
];

let currentSongIndex = 0;

// Load a song
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  albumArt.src = song.art;

  // Reset the play/pause button to "play" state
  const icon = playPauseBtn.querySelector('i');
  icon.classList.remove('fa-pause');
  icon.classList.add('fa-play');
}

// Play or pause the song
function togglePlayPause() {
  const icon = playPauseBtn.querySelector('i'); // Get the <i> element inside the button
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

  // Update the play/pause button to "pause" state
  const icon = playPauseBtn.querySelector('i');
  icon.classList.remove('fa-play');
  icon.classList.add('fa-pause');
}

// Play next song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length; // Loop back to the first song
  loadSong(currentSongIndex);
  audio.play();

  // Update the play/pause button to "pause" state
  const icon = playPauseBtn.querySelector('i');
  icon.classList.remove('fa-play');
  icon.classList.add('fa-pause');
}

// Autoplay the next song when the current song ends
audio.addEventListener('ended', () => {
  playNextSong(); // Automatically play the next song
});

// Populate the playlist
function populatePlaylist() {
  playlistEl.innerHTML = ''; // Clear existing playlist
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.setAttribute('draggable', true); // Enable drag-and-drop
    li.dataset.index = index; // Store the song's index

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

      // Repopulate the playlist to highlight the active song
      populatePlaylist();
    });

    // Add event listeners for drag-and-drop
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);

    playlistEl.appendChild(li);
  });
}

// Handle drag-and-drop events
let draggedIndex = null;

function handleDragStart(e) {
  draggedIndex = e.target.dataset.index; // Store the index of the dragged item
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault(); // Allow dropping
}

function handleDrop(e) {
  e.preventDefault();
  const targetIndex = e.target.dataset.index;

  if (draggedIndex !== null && targetIndex !== undefined) {
    // Rearrange the songs array
    const draggedSong = songs.splice(draggedIndex, 1)[0];
    songs.splice(targetIndex, 0, draggedSong);

    // Update the currentSongIndex if necessary
    if (currentSongIndex == draggedIndex) {
      currentSongIndex = targetIndex;
    } else if (draggedIndex < currentSongIndex && targetIndex >= currentSongIndex) {
      currentSongIndex--;
    } else if (draggedIndex > currentSongIndex && targetIndex <= currentSongIndex) {
      currentSongIndex++;
    }

    // Repopulate the playlist
    populatePlaylist();
  }
}

// Update the playlist when a new song starts playing
audio.addEventListener('play', () => {
  const playlistItems = playlistEl.querySelectorAll('li');
  playlistItems.forEach((item, index) => {
    item.classList.toggle('active', index === currentSongIndex);
  });
});

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
  if (event.code === 'Space') { // Check if the pressed key is the spacebar
    event.preventDefault(); // Prevent default behavior (e.g., scrolling)
    togglePlayPause(); // Toggle play/pause
  }
});