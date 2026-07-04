// Mock database for Spotify Smart Shuffle 2.0 UX Prototype

export const playlistInfo = {
  name: "Bollywood Liked Songs",
  creator: "Sandy",
  coverImage: "./assets/playlist_cover.png",
  description: "A highly-fidelity playlist featuring India's finest tracks."
};

// The original 6 songs in the playlist
export const originalTracks = [
  {
    id: "fam-1",
    title: "Kesariya",
    artist: "Arijit Singh",
    album: "Brahmastra",
    duration: "4:28",
    durationSec: 268,
    artwork: "linear-gradient(135deg, #F09819, #EDDE5D)",
    explicit: false,
    liked: true,
    recommended: false
  },
  {
    id: "fam-2",
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    album: "Bhediya",
    duration: "4:21",
    durationSec: 261,
    artwork: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
    explicit: false,
    liked: true,
    recommended: false
  },
  {
    id: "fam-3",
    title: "Satranga",
    artist: "Arijit Singh",
    album: "Animal",
    duration: "4:31",
    durationSec: 271,
    artwork: "linear-gradient(135deg, #FF416C, #FF4B2B)",
    explicit: false,
    liked: true,
    recommended: false
  },
  {
    id: "fam-4",
    title: "Channa Mereya",
    artist: "Arijit Singh",
    album: "Ae Dil Hai Mushkil",
    duration: "4:49",
    durationSec: 289,
    artwork: "linear-gradient(135deg, #1fa2ff, #12d8fa, #a6ffcb)",
    explicit: false,
    liked: true,
    recommended: false
  },
  {
    id: "fam-5",
    title: "Ilahi",
    artist: "Arijit Singh",
    album: "Yeh Jawaani Hai Deewani",
    duration: "3:48",
    durationSec: 228,
    artwork: "linear-gradient(135deg, #ee0979, #ff6a00)",
    explicit: false,
    liked: true,
    recommended: false
  },
  {
    id: "fam-6",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    duration: "4:22",
    durationSec: 262,
    artwork: "linear-gradient(135deg, #00c6ff, #0072ff)",
    explicit: false,
    liked: true,
    recommended: false
  }
];

// Recommended tracks that get injected in Smart Shuffle
export const recommendedTracks = [
  {
    id: "rec-1",
    title: "Heeriye",
    artist: "Arijit Singh & Jasleen Royal",
    album: "Heeriye Single",
    duration: "3:14",
    durationSec: 194,
    artwork: "linear-gradient(135deg, #7F00FF, #E100FF)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Because you frequently listen to Arijit Singh."
  },
  {
    id: "rec-2",
    title: "O Bedardeya",
    artist: "Arijit Singh",
    album: "Tu Jhoothi Main Makkaar",
    duration: "5:12",
    durationSec: 312,
    artwork: "linear-gradient(135deg, #3a7bd5, #3a6073)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Recently released."
  },
  {
    id: "rec-3",
    title: "Chaleya",
    artist: "Anirudh Ravichander & Arijit Singh",
    album: "Jawan",
    duration: "3:20",
    durationSec: 200,
    artwork: "linear-gradient(135deg, #f12711, #f5af19)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Trending among listeners with similar taste."
  },
  {
    id: "rec-4",
    title: "Pehle Bhi Main",
    artist: "Vishal Mishra",
    album: "Animal",
    duration: "4:10",
    durationSec: 250,
    artwork: "linear-gradient(135deg, #11998e, #38ef7d)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Similar mood."
  },
  {
    id: "rec-5",
    title: "Ruaan",
    artist: "Arijit Singh",
    album: "Tiger 3",
    duration: "4:17",
    durationSec: 257,
    artwork: "linear-gradient(135deg, #f857a6, #ff5858)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Similar acoustic style."
  },
  {
    id: "rec-6",
    title: "Tere Vaaste",
    artist: "Varun Jain & Sachin-Jigar",
    album: "Zara Hatke Zara Bachke",
    duration: "3:09",
    durationSec: 189,
    artwork: "linear-gradient(135deg, #43c6ac, #191654)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Trending among listeners with similar taste."
  },
  {
    id: "rec-7",
    title: "Tum Kya Mile",
    artist: "Arijit Singh & Shreya Ghoshal",
    album: "Rocky Aur Rani Kii Prem Kahaani",
    duration: "4:37",
    durationSec: 277,
    artwork: "linear-gradient(135deg, #654ea3, #eaafc8)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Similar acoustic style."
  },
  {
    id: "rec-8",
    title: "Ve Kamleya",
    artist: "Arijit Singh & Shreya Ghoshal",
    album: "Rocky Aur Rani Kii Prem Kahaani",
    duration: "4:07",
    durationSec: 247,
    artwork: "linear-gradient(135deg, #4568dc, #b06ab3)",
    explicit: false,
    liked: false,
    recommended: true,
    reason: "Hidden gem."
  }
];

// Similar artists for the Discovery Nudge Flow
export const similarArtists = [
  {
    id: "art-1",
    name: "Anuv Jain",
    type: "Acoustic / Indie Pop",
    avatar: "linear-gradient(135deg, #4A154B, #E01E5A)",
    bio: "Singer-songwriter known for his acoustic guitar melodies and narrative lyrical style that resonates deeply with youth.",
    songs: [
      {
        id: "art1-s1",
        title: "Baarishein",
        artist: "Anuv Jain",
        album: "Baarishein Single",
        duration: "3:27",
        durationSec: 207,
        artwork: "linear-gradient(135deg, #2E0854, #4A154B)",
        explicit: false,
        liked: false,
        recommended: true
      },
      {
        id: "art1-s2",
        title: "Husn",
        artist: "Anuv Jain",
        album: "Husn Single",
        duration: "3:38",
        durationSec: 218,
        artwork: "linear-gradient(135deg, #1C0A35, #350A24)",
        explicit: false,
        liked: false,
        recommended: true
      }
    ]
  },
  {
    id: "art-2",
    name: "Taba Chake",
    type: "Folk / Acoustic",
    avatar: "linear-gradient(135deg, #0f9b0f, #99f099)",
    bio: "Folk-pop singer-songwriter from Arunachal Pradesh, known for his unique vocal tones, multilingual lyricism, and nature-inspired themes.",
    songs: [
      {
        id: "art2-s1",
        title: "Aamil",
        artist: "Taba Chake",
        album: "Bombay Dreams",
        duration: "3:42",
        durationSec: 222,
        artwork: "linear-gradient(135deg, #094709, #0f9b0f)",
        explicit: false,
        liked: false,
        recommended: true
      },
      {
        id: "art2-s2",
        title: "Inayat",
        artist: "Taba Chake",
        album: "Bombay Dreams",
        duration: "3:01",
        durationSec: 181,
        artwork: "linear-gradient(135deg, #0D6E2E, #2ECC71)",
        explicit: false,
        liked: false,
        recommended: true
      }
    ]
  },
  {
    id: "art-3",
    name: "Jasleen Royal",
    type: "Indie Pop / Singer-Songwriter",
    avatar: "linear-gradient(135deg, #ff7e5f, #feb47b)",
    bio: "Versatile singer-songwriter and composer playing multiple instruments, producing unique vocals, and composing major movie soundtracks.",
    songs: [
      {
        id: "art3-s1",
        title: "Sang Rahiyo",
        artist: "Jasleen Royal",
        album: "Sang Rahiyo Single",
        duration: "3:44",
        durationSec: 224,
        artwork: "linear-gradient(135deg, #8A2387, #E94057, #F27121)",
        explicit: false,
        liked: false,
        recommended: true
      },
      {
        id: "art3-s2",
        title: "Din Shagna Da",
        artist: "Jasleen Royal",
        album: "Phillauri",
        duration: "3:36",
        durationSec: 216,
        artwork: "linear-gradient(135deg, #e65c00, #F9D423)",
        explicit: false,
        liked: false,
        recommended: true
      }
    ]
  }
];
