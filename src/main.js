// Main Prototype Orchestrator
import { playlistInfo, originalTracks, recommendedTracks, similarArtists } from "./mockData.js";

// ==========================================================================
// 1. PROTOTYPE STATE DEFINITION
// ==========================================================================
const state = {
  // Playlist Mode States
  activeDiscoveryMode: "balanced",     // safe | balanced | adventurous | explorer
  smartShuffleActive: false,
  hasOnboarded: false,                 // First-time selector sheet state
  nudgesEnabled: true,
  currentTracks: [...originalTracks],
  likedTrackIds: new Set(originalTracks.map(t => t.id)),
  queue: [...originalTracks],          // Active audio playback queue
  
  // Media Playback States
  isPlaying: false,
  currentTrack: null,
  elapsedSeconds: 0,
  playbackInterval: null,
  
  // Navigation State
  activeScreen: "playlist",            // playlist | settings | discovery
  
  // Followed Artists List
  followedArtists: new Set()
};

// ==========================================================================
// 2. DOM ELEMENTS REFERENCES
// ==========================================================================
const playlistScreen = document.getElementById("playlist-screen");
const settingsScreen = document.getElementById("settings-screen");
const discoveryScreen = document.getElementById("discovery-screen");

const playlistArtImg = document.getElementById("playlist-art-img");
const playlistCountText = document.getElementById("playlist-count-text");
const songListContainer = document.getElementById("song-list");
const nudgeCardSlot = document.getElementById("nudge-card-slot");

const smartShuffleToggle = document.getElementById("smart-shuffle-toggle");
const playlistPlayBtn = document.getElementById("playlist-play-btn");
const headerPlayIcon = document.getElementById("header-play-icon");
const headerPauseIcon = document.getElementById("header-pause-icon");

// Settings Elements
const settingsBackBtn = document.getElementById("settings-back-btn");
const playlistSettingsBtn = document.getElementById("playlist-settings-btn");
const resetOnboardingBtn = document.getElementById("reset-onboarding-btn");
const nudgeToggleInput = document.getElementById("nudge-toggle-input");
const previewModeTitle = document.getElementById("preview-mode-title");
const previewModeDesc = document.getElementById("preview-mode-desc");
const previewFlowVisual = document.getElementById("preview-flow-visual");

// Discovery Elements
const discoveryBackBtn = document.getElementById("discovery-back-btn");
const discoveryArtistsList = document.getElementById("discovery-artists-list");

// Mini Player Elements
const miniPlayer = document.getElementById("mini-player");
const miniPlayerArtFill = document.getElementById("mini-player-art-fill");
const miniTitle = document.getElementById("mini-title");
const miniArtist = document.getElementById("mini-artist");
const miniPlayBtn = document.getElementById("mini-play-btn");
const miniNextBtn = document.getElementById("mini-next-btn");
const miniProgressFill = document.getElementById("mini-progress-fill");

// Bottom Sheets & Modals
const onboardingBackdrop = document.getElementById("onboarding-sheet-backdrop");
const transparencyBackdrop = document.getElementById("transparency-sheet-backdrop");
const modalBackdrop = document.getElementById("confirm-modal-backdrop");
const clockEl = document.getElementById("mock-clock");

// ==========================================================================
// 3. INITIALIZATION & ROUTING
// ==========================================================================
function init() {
  // Set Playlist details
  playlistArtImg.src = playlistInfo.coverImage;
  
  // Render playlist songs initial
  renderPlaylistSongs();
  
  // Setup clock loop
  startClock();
  
  // Setup Visual Flow Preview inside Settings
  updateSettingsPreview();
  
  // Wire up event listeners
  setupEvents();
}

// Simple Router Helper
function routeTo(screenName) {
  triggerHaptic();
  
  // Hide all screens
  playlistScreen.classList.add("hidden");
  settingsScreen.classList.add("hidden");
  discoveryScreen.classList.add("hidden");
  
  state.activeScreen = screenName;
  
  // Update Bottom Nav active states
  document.querySelectorAll(".bottom-nav-item").forEach(item => item.classList.remove("active"));
  
  if (screenName === "playlist") {
    playlistScreen.classList.remove("hidden");
    document.getElementById("nav-library-btn").classList.add("active");
  } else if (screenName === "settings") {
    settingsScreen.classList.remove("hidden");
    document.getElementById("nav-settings-btn").classList.add("active");
    // Sync checkbox input
    nudgeToggleInput.checked = state.nudgesEnabled;
    syncSettingsTabs();
  } else if (screenName === "discovery") {
    discoveryScreen.classList.remove("hidden");
    document.getElementById("nav-discovery-btn").classList.add("active");
    renderDiscoveryFeed();
  }
}

// Haptic Simulation
function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
  console.log("[Haptic Feedback simulated]");
}

// ==========================================================================
// 4. EVENT BINDINGS
// ==========================================================================
function setupEvents() {
  // Play button on playlist
  playlistPlayBtn.addEventListener("click", () => {
    triggerHaptic();
    if (state.currentTrack) {
      togglePlayback();
    } else {
      // Play first song in list
      playTrack(state.currentTracks[0], state.currentTracks);
    }
  });

  // Mini player click
  miniPlayer.addEventListener("click", (e) => {
    if (e.target.closest(".mini-player-controls")) return;
    // Tapping player triggers brief feedback/expand hint
    triggerHaptic();
    showToast("Expanding Player... (UX Prototype only contains bottom controls)");
  });

  // Mini player controls
  miniPlayBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    triggerHaptic();
    togglePlayback();
  });

  miniNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    triggerHaptic();
    playNext();
  });

  // Settings trigger
  if (playlistSettingsBtn) playlistSettingsBtn.addEventListener("click", () => routeTo("settings"));
  if (settingsBackBtn) settingsBackBtn.addEventListener("click", () => routeTo("playlist"));
  
  // Discovery Back arrow
  if (discoveryBackBtn) discoveryBackBtn.addEventListener("click", () => routeTo("playlist"));

  // Bottom Nav items
  document.getElementById("nav-library-btn").addEventListener("click", () => routeTo("playlist"));
  document.getElementById("nav-settings-btn").addEventListener("click", () => routeTo("settings"));
  document.getElementById("nav-discovery-btn").addEventListener("click", () => routeTo("discovery"));

  // Settings checkbox nudge toggle
  nudgeToggleInput.addEventListener("change", function() {
    triggerHaptic();
    state.nudgesEnabled = this.checked;
    showToast(state.nudgesEnabled ? "Discovery nudge enabled" : "Discovery nudge disabled");
  });

  // Settings Tab switches
  document.querySelectorAll(".settings-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      triggerHaptic();
      const mode = btn.dataset.mode;
      state.activeDiscoveryMode = mode;
      syncSettingsTabs();
      updateSettingsPreview();
      
      // If smart shuffle is active, dynamically update playlist immediately
      if (state.smartShuffleActive) {
        applySmartShuffleTracks();
      }
    });
  });

  // Reset Onboarding button
  resetOnboardingBtn.addEventListener("click", () => {
    triggerHaptic();
    state.hasOnboarded = false;
    showToast("Smart Shuffle onboarding reset!");
  });

  // Smart Shuffle toggle button click
  smartShuffleToggle.addEventListener("click", () => {
    triggerHaptic();
    if (state.smartShuffleActive) {
      disableSmartShuffle();
    } else {
      if (state.hasOnboarded) {
        enableSmartShuffle();
      } else {
        openOnboardingSheet();
      }
    }
  });

  // Onboarding card selections
  document.querySelectorAll(".mode-card").forEach(card => {
    card.addEventListener("click", () => {
      triggerHaptic();
      document.querySelectorAll(".mode-card").forEach(el => el.classList.remove("selected"));
      card.classList.add("selected");
      
      const choice = card.dataset.choice;
      updateOnboardingPreview(choice);
    });
  });

  // Start Listening button on onboarding
  document.getElementById("sheet-start-btn").addEventListener("click", () => {
    triggerHaptic();
    const selectedMode = document.querySelector(".mode-card.selected").dataset.choice;
    state.activeDiscoveryMode = selectedMode;
    state.hasOnboarded = true;
    
    // Close sheet
    onboardingBackdrop.classList.remove("visible");
    
    // Enable Smart Shuffle
    enableSmartShuffle();
  });

  // Onboarding Backdrop click close
  onboardingBackdrop.addEventListener("click", (e) => {
    if (e.target === onboardingBackdrop) {
      onboardingBackdrop.classList.remove("visible");
    }
  });

  // Transparency close btn
  document.getElementById("trans-close-btn").addEventListener("click", () => {
    triggerHaptic();
    transparencyBackdrop.classList.remove("visible");
  });

  transparencyBackdrop.addEventListener("click", (e) => {
    if (e.target === transparencyBackdrop) {
      transparencyBackdrop.classList.remove("visible");
    }
  });
}

// ==========================================================================
// 5. SMART SHUFFLE CONTROLLERS & DATA MERGING
// ==========================================================================

function openOnboardingSheet() {
  // Sync the current selected tab into the onboarding cards
  document.querySelectorAll(".mode-card").forEach(card => {
    card.classList.remove("selected");
    if (card.dataset.choice === state.activeDiscoveryMode) {
      card.classList.add("selected");
    }
  });
  
  // Load initial preview
  updateOnboardingPreview(state.activeDiscoveryMode);
  
  onboardingBackdrop.classList.add("visible");
}

function enableSmartShuffle() {
  state.smartShuffleActive = true;
  smartShuffleToggle.classList.add("active");
  
  // Render loading skeleton first
  renderSkeletonLoader();
  
  // Rotate spinner
  smartShuffleToggle.classList.add("loading");
  
  setTimeout(() => {
    smartShuffleToggle.classList.remove("loading");
    applySmartShuffleTracks();
  }, 800);
}

function disableSmartShuffle() {
  state.smartShuffleActive = false;
  smartShuffleToggle.classList.remove("active");
  
  // Hide active banner
  const banner = document.getElementById("smart-shuffle-banner");
  if (banner) banner.style.display = "none";

  // Remove nudge card if any
  nudgeCardSlot.innerHTML = "";
  
  // Trigger removal transitions
  const recRows = songListContainer.querySelectorAll(".song-row.recommendation");
  recRows.forEach(row => {
    row.classList.add("removing");
  });
  
  // Wait for transition before resetting state and rerendering
  setTimeout(() => {
    state.currentTracks = [...originalTracks];
    renderPlaylistSongs();
    updateHeaderCount();
    
    // If current playing track was a recommendation, play next (since it is removed)
    if (state.currentTrack && state.currentTrack.recommended) {
      playNext();
    }
    
    showToast("Smart Shuffle Off");
  }, 350);
}

function applySmartShuffleTracks() {
  // Render skeleton loaders for dynamic transitions
  renderSkeletonLoader();
  
  setTimeout(() => {
    // Generate simulated playlist based on mode
    const mode = state.activeDiscoveryMode;
    let merged = [];
    
    if (mode === "safe") {
      // safe: original + 1 recommendation
      merged = [
        originalTracks[0],
        originalTracks[1],
        originalTracks[2],
        { ...recommendedTracks[0], delay: "0.2s" }, // Heeriye
        originalTracks[3],
        originalTracks[4],
        originalTracks[5]
      ];
    } else if (mode === "balanced") {
      // balanced: 1 recommendation after every 2-3 tracks
      merged = [
        originalTracks[0],
        originalTracks[1],
        { ...recommendedTracks[0], delay: "0.1s" }, // Heeriye
        originalTracks[2],
        originalTracks[3],
        { ...recommendedTracks[1], delay: "0.3s" }, // O Bedardeya
        originalTracks[4],
        originalTracks[5],
        { ...recommendedTracks[2], delay: "0.5s" }  // Chaleya
      ];
    } else if (mode === "adventurous") {
      // adventurous: strictly alternate
      merged = [
        originalTracks[0],
        { ...recommendedTracks[0], delay: "0.1s" },
        originalTracks[1],
        { ...recommendedTracks[1], delay: "0.25s" },
        originalTracks[2],
        { ...recommendedTracks[3], delay: "0.4s" }, // Pehle Bhi Main
        originalTracks[3],
        { ...recommendedTracks[2], delay: "0.55s" },
        originalTracks[4],
        { ...recommendedTracks[4], delay: "0.7s" }, // Ruaan
        originalTracks[5]
      ];
    } else if (mode === "explorer") {
      // explorer: mostly new, keep few familiar
      merged = [
        { ...recommendedTracks[0], delay: "0.05s" },
        { ...recommendedTracks[1], delay: "0.15s" },
        originalTracks[0], // Kesariya
        { ...recommendedTracks[3], delay: "0.3s" },
        { ...recommendedTracks[2], delay: "0.45s" },
        originalTracks[1], // Apna Bana Le
        { ...recommendedTracks[6], delay: "0.6s" }, // Tum Kya Mile
        { ...recommendedTracks[4], delay: "0.75s" },
        { ...recommendedTracks[7], delay: "0.9s" }, // Ve Kamleya
        originalTracks[5] // Tum Hi Ho
      ];
    }
    
    state.currentTracks = merged;
    renderPlaylistSongs();
    updateHeaderCount();
    
    // Show active banner
    const banner = document.getElementById("smart-shuffle-banner");
    const bannerMode = document.getElementById("banner-mode-name");
    const bannerCount = document.getElementById("banner-rec-count");
    if (banner && bannerMode && bannerCount) {
      banner.style.display = "flex";
      bannerMode.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
      
      const recCount = merged.filter(t => t.recommended).length;
      bannerCount.textContent = `${recCount} recommendation${recCount > 1 ? 's' : ''} added`;
    }

    // Stagger slide-in classes
    setTimeout(() => {
      songListContainer.querySelectorAll(".song-row.recommendation").forEach(row => {
        row.classList.add("inserted");
      });
    }, 50);
    
    showToast(`Smart Shuffle: ${mode.toUpperCase()} mode active`);
  }, 400);
}

// ==========================================================================
// 6. RENDERERS & DATA BINDERS
// ==========================================================================

function renderPlaylistSongs() {
  songListContainer.innerHTML = "";
  
  state.currentTracks.forEach((track, index) => {
    const isPlaying = state.isPlaying && state.currentTrack && state.currentTrack.id === track.id;
    const row = document.createElement("div");
    row.className = `song-row ${isPlaying ? "active" : ""}`;
    
    if (track.recommended) {
      row.classList.add("recommendation");
      // Add delay variable for transition staggering
      row.style.setProperty("--delay", track.delay || "0.1s");
    }
    
    // Left side content: index or EQ
    let indexHTML = `<span class="song-index">${index + 1}</span>`;
    if (isPlaying) {
      indexHTML = `
        <div class="song-index">
          <div class="playing-eq">
            <div class="playing-eq-bar"></div>
            <div class="playing-eq-bar"></div>
            <div class="playing-eq-bar"></div>
          </div>
        </div>
      `;
    }

    // NEW label + Info button for recommendations
    let badgeHTML = "";
    if (track.recommended) {
      badgeHTML = `
        <span class="new-badge">NEW</span>
        <button class="info-icon-btn btn-haptic" data-id="${track.id}" title="Why recommended?">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      `;
    }

    row.innerHTML = `
      ${indexHTML}
      <div class="song-art">
        <div class="song-art-gradient" style="background: ${track.artwork};"></div>
      </div>
      <div class="song-info">
        <div class="song-title-wrapper">
          <span class="song-title">${track.title}</span>
          ${badgeHTML}
        </div>
        <div class="song-meta-line">
          ${track.explicit ? '<span class="explicit-badge">E</span>' : ''}
          <span>${track.artist}</span>
        </div>
      </div>
      <button class="song-opt-btn btn-haptic" title="More options">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </button>
    `;

    // Row playing trigger
    row.addEventListener("click", (e) => {
      // Don't play if clicking info button
      if (e.target.closest(".info-icon-btn")) return;
      playTrack(track, state.currentTracks);
    });

    // Info click transparency trigger
    if (track.recommended) {
      row.querySelector(".info-icon-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        triggerHaptic();
        openTransparencySheet(track);
      });
    }

    songListContainer.appendChild(row);
  });
}

function renderSkeletonLoader() {
  songListContainer.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.className = "skeleton-row";
    row.innerHTML = `
      <div class="skeleton-art"></div>
      <div class="skeleton-info">
        <div class="skeleton-bar-title"></div>
        <div class="skeleton-bar-meta"></div>
      </div>
    `;
    songListContainer.appendChild(row);
  }
}

function openTransparencySheet(track) {
  document.getElementById("trans-art-box").style.background = track.artwork;
  document.getElementById("trans-song-title").textContent = track.title;
  document.getElementById("trans-song-artist").textContent = track.artist;
  document.getElementById("trans-reason-text").textContent = track.reason || "Trending recommendation.";
  
  transparencyBackdrop.classList.add("visible");
}

function updateHeaderCount() {
  playlistCountText.textContent = `${state.currentTracks.length} songs`;
}

// Settings Screen Helpers
function syncSettingsTabs() {
  document.querySelectorAll(".settings-tab-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.mode === state.activeDiscoveryMode) {
      btn.classList.add("active");
    }
  });
}

// Recommendations mapping helper
function getModeRecommendations(mode) {
  if (mode === "safe") {
    return [recommendedTracks[0]]; // Heeriye
  } else if (mode === "balanced") {
    return [recommendedTracks[0], recommendedTracks[1], recommendedTracks[2]]; // Heeriye, O Bedardeya, Chaleya
  } else if (mode === "adventurous") {
    return [recommendedTracks[0], recommendedTracks[1], recommendedTracks[3], recommendedTracks[2], recommendedTracks[4]];
  } else if (mode === "explorer") {
    return [recommendedTracks[0], recommendedTracks[1], recommendedTracks[3], recommendedTracks[2], recommendedTracks[6], recommendedTracks[4], recommendedTracks[7]];
  }
  return [];
}

// Mini track renderer inside previews
function renderPreviewTracksList(containerEl, mode) {
  const recs = getModeRecommendations(mode);
  containerEl.innerHTML = "";
  
  recs.forEach(track => {
    const item = document.createElement("div");
    item.className = "preview-song-item";
    item.innerHTML = `
      <div class="preview-song-art" style="background: ${track.artwork};"></div>
      <div class="preview-song-details">
        <span class="preview-song-title">${track.title}</span>
        <span class="preview-song-artist">${track.artist}</span>
      </div>
      <span class="new-badge" style="font-size: 7px; padding: 1px 4px; border-radius: 2px;">NEW</span>
    `;
    containerEl.appendChild(item);
  });
}

function updateSettingsPreview() {
  const mode = state.activeDiscoveryMode;
  let title = "Balanced Mode";
  let desc = "70% Familiar, 30% New. One recommendation after every 2–3 familiar songs.";
  let flow = ["fam", "fam", "new", "fam", "fam", "new"];

  if (mode === "safe") {
    title = "Safe Mode";
    desc = "90% Familiar, 10% New. Mostly familiar songs, only one recommendation.";
    flow = ["fam", "fam", "fam", "new", "fam", "fam"];
  } else if (mode === "adventurous") {
    title = "Adventurous Mode";
    desc = "50% Familiar, 50% New. Alternates between familiar tracks and new recommendations.";
    flow = ["fam", "new", "fam", "new", "fam", "new"];
  } else if (mode === "explorer") {
    title = "Explorer Mode";
    desc = "20% Familiar, 80% New. Hidden gems, emerging artists, and indie discoveries.";
    flow = ["new", "new", "fam", "new", "new", "fam"];
  }

  previewModeTitle.textContent = title;
  previewModeDesc.textContent = desc;

  // Render previews flow visual dots
  previewFlowVisual.innerHTML = "";
  flow.forEach((type, index) => {
    const dot = document.createElement("div");
    dot.className = `preview-dot ${type === "fam" ? "familiar" : "new"}`;
    dot.textContent = type === "fam" ? "FAM" : "NEW";
    previewFlowVisual.appendChild(dot);

    if (index < flow.length - 1) {
      const conn = document.createElement("div");
      conn.className = "preview-flow-connector";
      previewFlowVisual.appendChild(conn);
    }
  });

  // Render mini track preview list dynamically in settings
  let listEl = previewFlowVisual.nextElementSibling;
  if (!listEl || !listEl.classList.contains("preview-songs-list-container")) {
    listEl = document.createElement("div");
    listEl.className = "preview-songs-list-container";
    listEl.style.borderTop = "1px solid rgba(255,255,255,0.06)";
    listEl.style.paddingTop = "8px";
    listEl.style.marginTop = "8px";
    listEl.style.textAlign = "left";
    listEl.innerHTML = `
      <span style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Recommended Additions:</span>
      <div class="settings-songs-preview-list" style="display: flex; flex-direction: column; gap: 6px; max-height: 105px; overflow-y: auto;"></div>
    `;
    previewFlowVisual.parentElement.appendChild(listEl);
  }
  
  const innerList = listEl.querySelector(".settings-songs-preview-list");
  renderPreviewTracksList(innerList, mode);
}

function updateOnboardingPreview(mode) {
  const titleEl = document.getElementById("onboarding-preview-title");
  const descEl = document.getElementById("onboarding-preview-desc");
  const visualEl = document.getElementById("onboarding-preview-visual");
  const listEl = document.getElementById("onboarding-preview-songs-list");
  
  if (!titleEl || !descEl || !visualEl || !listEl) return;
  
  let title = "Balanced Mode";
  let desc = "70% Familiar, 30% New. One recommendation after every 2–3 familiar songs.";
  let flow = ["fam", "fam", "new", "fam", "fam", "new"];
  
  if (mode === "safe") {
    title = "Safe Mode";
    desc = "90% Familiar, 10% New. Mostly familiar songs, only one recommendation.";
    flow = ["fam", "fam", "fam", "new", "fam", "fam"];
  } else if (mode === "adventurous") {
    title = "Adventurous Mode";
    desc = "50% Familiar, 50% New. Alternates between familiar tracks and new recommendations.";
    flow = ["fam", "new", "fam", "new", "fam", "new"];
  } else if (mode === "explorer") {
    title = "Explorer Mode";
    desc = "20% Familiar, 80% New. Deep cuts & hidden gems.";
    flow = ["new", "new", "fam", "new", "new", "fam"];
  }
  
  titleEl.textContent = title;
  descEl.textContent = desc;
  
  // Render flow dots
  visualEl.innerHTML = "";
  flow.forEach((type, index) => {
    const dot = document.createElement("div");
    dot.className = `preview-dot ${type === "fam" ? "familiar" : "new"}`;
    dot.textContent = type === "fam" ? "FAM" : "NEW";
    visualEl.appendChild(dot);

    if (index < flow.length - 1) {
      const conn = document.createElement("div");
      conn.className = "preview-flow-connector";
      visualEl.appendChild(conn);
    }
  });

  // Render dynamic list of tracks in onboarding
  renderPreviewTracksList(listEl, mode);
}

// ==========================================================================
// 7. PLAYBACK COORDINATION & TICKERS
// ==========================================================================

function playTrack(track, customQueue) {
  clearInterval(state.playbackInterval);
  
  if (customQueue) {
    state.queue = customQueue;
  }
  
  state.currentTrack = track;
  state.isPlaying = true;
  state.elapsedSeconds = 0;
  
  // Show player bar
  miniPlayer.classList.add("visible");
  miniPlayerArtFill.style.background = track.artwork;
  miniTitle.textContent = track.title;
  miniArtist.textContent = track.artist;
  
  // Update icons
  playlistPlayBtn.setAttribute("title", "Pause");
  headerPlayIcon.style.display = "none";
  headerPauseIcon.style.display = "block";
  
  miniPlayBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1"></rect>
      <rect x="14" y="4" width="4" height="16" rx="1"></rect>
    </svg>
  `;
  
  // Update list
  renderPlaylistSongs();
  if (state.activeScreen === "discovery") {
    renderDiscoveryFeed();
  }
  
  // Start clock progress bar
  startTicker();
}

function togglePlayback() {
  if (!state.currentTrack) return;
  
  state.isPlaying = !state.isPlaying;
  
  if (state.isPlaying) {
    headerPlayIcon.style.display = "none";
    headerPauseIcon.style.display = "block";
    miniPlayBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1"></rect>
        <rect x="14" y="4" width="4" height="16" rx="1"></rect>
      </svg>
    `;
    startTicker();
  } else {
    clearInterval(state.playbackInterval);
    headerPlayIcon.style.display = "block";
    headerPauseIcon.style.display = "none";
    miniPlayBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
  }
  
  renderPlaylistSongs();
  if (state.activeScreen === "discovery") {
    renderDiscoveryFeed();
  }
}

function startTicker() {
  const track = state.currentTrack;
  if (!track) return;
  
  const totalSec = track.durationSec;
  
  state.playbackInterval = setInterval(() => {
    state.elapsedSeconds += 1;
    
    if (state.elapsedSeconds >= totalSec) {
      clearInterval(state.playbackInterval);
      playNext();
      return;
    }
    
    // Update progress visual
    const pct = (state.elapsedSeconds / totalSec) * 100;
    miniProgressFill.style.width = `${pct}%`;
  }, 1000);
}

function playNext() {
  const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
  
  // If we reach the end of the queue
  if (currentIndex === -1 || currentIndex === state.queue.length - 1) {
    // End playback
    clearInterval(state.playbackInterval);
    state.isPlaying = false;
    state.currentTrack = null;
    
    // Hide mini player
    miniPlayer.classList.remove("visible");
    
    // Reset header play button
    headerPlayIcon.style.display = "block";
    headerPauseIcon.style.display = "none";
    
    renderPlaylistSongs();
    if (state.activeScreen === "discovery") {
      renderDiscoveryFeed();
    }
    
    // Display Nudge Card if enabled (only if we completed the main playlist queue)
    if (state.nudgesEnabled && state.activeScreen === "playlist") {
      showDiscoveryNudgeCard();
    }
    return;
  }
  
  // Play next track in queue
  const nextTrack = state.queue[currentIndex + 1];
  playTrack(nextTrack);
}

// ==========================================================================
// 8. DISCOVERY NUDGES & SUB-SCREENS
// ==========================================================================

function showDiscoveryNudgeCard() {
  nudgeCardSlot.innerHTML = `
    <div class="discovery-nudge-card">
      <div class="nudge-header">
        <span style="font-size: 20px;">🎧</span>
        <span class="nudge-header-title">You're really enjoying Arijit Singh</span>
      </div>
      <p class="nudge-subtitle">Want to explore artists with a similar vibe?</p>
      
      <!-- Artist items rows -->
      <div class="nudge-artists-row">
        <div class="nudge-artist-item">
          <div class="nudge-artist-avatar" style="background: ${similarArtists[0].avatar};">AJ</div>
          <span class="nudge-artist-name">Anuv Jain</span>
        </div>
        <div class="nudge-artist-item">
          <div class="nudge-artist-avatar" style="background: ${similarArtists[1].avatar};">TC</div>
          <span class="nudge-artist-name">Taba Chake</span>
        </div>
        <div class="nudge-artist-item">
          <div class="nudge-artist-avatar" style="background: ${similarArtists[2].avatar};">JR</div>
          <span class="nudge-artist-name">Jasleen Royal</span>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="nudge-actions">
        <button class="nudge-btn explore btn-haptic" id="nudge-btn-explore">Explore Artists</button>
        <button class="nudge-btn later btn-haptic" id="nudge-btn-later">Maybe Later</button>
      </div>
    </div>
  `;
  
  // Scroll to bottom so card is fully visible
  setTimeout(() => {
    document.getElementById("playlist-scroll").scrollTo({
      top: document.getElementById("playlist-scroll").scrollHeight,
      behavior: "smooth"
    });
  }, 100);

  // Buttons event bindings
  document.getElementById("nudge-btn-later").addEventListener("click", () => {
    triggerHaptic();
    const card = document.querySelector(".discovery-nudge-card");
    card.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    card.style.transform = "scale(0.9)";
    card.style.opacity = "0";
    setTimeout(() => {
      nudgeCardSlot.innerHTML = "";
    }, 300);
  });

  document.getElementById("nudge-btn-explore").addEventListener("click", () => {
    routeTo("discovery");
  });
}

function renderDiscoveryFeed() {
  discoveryArtistsList.innerHTML = "";
  
  similarArtists.forEach(artist => {
    const isFollowed = state.followedArtists.has(artist.name);
    const card = document.createElement("div");
    card.className = "discovery-artist-card";
    
    // Top tracks rendering
    let songsHTML = "";
    artist.songs.forEach(song => {
      const isPlaying = state.isPlaying && state.currentTrack && state.currentTrack.id === song.id;
      songsHTML += `
        <div class="discovery-song-row ${isPlaying ? 'active' : ''}" data-song-id="${song.id}">
          <div class="discovery-song-art" style="background: ${song.artwork};"></div>
          <div class="discovery-song-info">
            <span class="discovery-song-title">${song.title}</span>
            <span class="discovery-song-meta">${song.artist} • Preview</span>
          </div>
          <button class="discovery-song-play-btn btn-haptic">
            ${isPlaying 
              ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>`
            }
          </button>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="discovery-artist-profile">
        <div class="discovery-artist-avatar" style="background: ${artist.avatar};">
          ${artist.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div class="discovery-artist-meta">
          <div class="discovery-artist-name">${artist.name}</div>
          <div class="discovery-artist-genre">${artist.type}</div>
        </div>
        <button class="discovery-follow-btn btn-haptic ${isFollowed ? 'following' : ''}">
          ${isFollowed ? 'Following' : 'Follow'}
        </button>
      </div>
      <div class="discovery-artist-bio">${artist.bio}</div>
      <div class="discovery-songs-list">
        <h4 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px;">Recommended Songs</h4>
        ${songsHTML}
      </div>
    `;

    // Follow Toggle Action
    const followBtn = card.querySelector(".discovery-follow-btn");
    followBtn.addEventListener("click", () => {
      triggerHaptic();
      const follow = !state.followedArtists.has(artist.name);
      if (follow) {
        state.followedArtists.add(artist.name);
        followBtn.classList.add("following");
        followBtn.textContent = "Following";
        showToast(`Followed ${artist.name}`);
      } else {
        state.followedArtists.delete(artist.name);
        followBtn.classList.remove("following");
        followBtn.textContent = "Follow";
        showToast(`Unfollowed ${artist.name}`);
      }
    });

    // Play Discovery Song Action
    card.querySelectorAll(".discovery-song-row").forEach(row => {
      row.addEventListener("click", () => {
        const songId = row.dataset.songId;
        const songObj = artist.songs.find(s => s.id === songId);
        playTrack(songObj, artist.songs);
      });
    });

    discoveryArtistsList.appendChild(card);
  });
}

// ==========================================================================
// 9. UTILITIES
// ==========================================================================

function showToast(message) {
  const toast = document.getElementById("spotify-toast");
  toast.textContent = message;
  toast.classList.add("visible");
  
  // Specific styling based on toast content
  if (message.toLowerCase().includes("off") || message.toLowerCase().includes("unfollowed")) {
    toast.style.backgroundColor = "#e91429"; // Spotify Red
    toast.style.color = "#FFFFFF";
  } else if (message.toLowerCase().includes("reset") || message.toLowerCase().includes("onboarding")) {
    toast.style.backgroundColor = "#2E77D0"; // Spotify Blue info
    toast.style.color = "#FFFFFF";
  } else {
    toast.style.backgroundColor = "var(--spotify-green)"; // Spotify Green success
    toast.style.color = "var(--spotify-pure-black)";
  }

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

function startClock() {
  const updateClock = () => {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes();
    h = h % 12;
    h = h ? h : 12;
    const minStr = m < 10 ? "0" + m : m;
    if (clockEl) clockEl.textContent = `${h}:${minStr}`;
  };
  updateClock();
  setInterval(updateClock, 30000);
}

// Run app init
init();
