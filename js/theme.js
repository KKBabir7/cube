// // Theme configuration object
// const themes = {
//   // Image themes
//   "hill": {
//     type: "image",
//     background: "assets/theme/hill.png",
//     opacity: 0.7
//   },
//   "candy": {
//     type: "image",
//     background: "assets/theme/candy.png",
//     opacity: 0.7
//   },
//   "sky": {
//     type: "image",
//     background: "assets/theme/sky.png",
//     opacity: 0.7
//   },
//    "playground": {
//     type: "image",
//     background: "assets/theme/playground.png",
//     opacity: 0.7
//   },
//     "water": {
//     type: "image",
//     background: "assets/theme/water.png",
//     opacity: 0.7
//   },
//   // Video themes
//   "car": {
//     type: "video",
//     background: "assets/theme/car.mp4",
//     opacity: 0.5
//   },
//     "space": {
//     type: "video",
//     background: "assets/theme/space.mp4",
//     opacity: 0.5
//   },
  
  
//   // Default themes
//   "white": {
//     type: "default",
//     background: "#f8f8f8",
//     opacity: 1
//   },
//   "black": {
//     type: "default",
//     background: "#000000",
//     opacity: 0.1
//   }
// };

// const BIN_ID = "68eb0729ae596e708f0f1e67";
// const GET_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
// const PUT_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// // 👉 Use your real master key
// const MASTER_KEY = "$2a$10$u7Mi.anzXWGXJSSlNcetHOp91wqYtvvmtX7KYz.CbBplCZud7TV0i";

// const select = $('#themeSelect');
// const videoElement = document.getElementById('videoBackground');


// // Initialize Select2
// select.select2({
//   templateResult: formatThemeOption,
//   templateSelection: formatThemeSelection,
//    width: '100%',
//     minimumResultsForSearch: Infinity
// });

// // Format theme options in Select2
// function formatThemeOption(theme) {
//   if (!theme.id) return theme.text;
  
//   const themeData = themes[theme.id];
//   let $theme = $('<span class="theme-option"></span>');
  
//   if (themeData.type === "image") {
//     $theme.append($('<img src="' + themeData.background + '" />'));
//   } else if (themeData.type === "video") {
//     $theme.append($('<img src="https://img.icons8.com/color/20/000000/video.png" />'));
//   } else {
//     $theme.append($('<img src="https://img.icons8.com/color/20/000000/paint-palette.png" />'));
//   }
  
//   $theme.append(theme.text);
//   return $theme;
// }

// // Format selected theme in Select2
// function formatThemeSelection(theme) {
//   if (!theme.id) return theme.text;
//   return theme.text;
// }

// // Apply theme
// function applyTheme(themeId) {
//   const theme = themes[themeId];
//   if (!theme) return;
  
//   // Update current theme display

  
//   // Apply opacity to tool-container-theme elements
//   document.querySelectorAll('.tool-container-theme').forEach(el => {
//     el.style.background = `rgba(255, 255, 255, ${theme.opacity})`;
//   });
  
//   // Handle different theme types
//   if (theme.type === "image") {
//     // Hide video and show image background
//     videoElement.style.display = 'none';
//     document.querySelector('.main-container-block').style.backgroundImage = `linear-gradient(#c8c8c87d, #c8c8c87d),url('${theme.background}')`;
//      document.querySelector('.main-container-block').classList.remove('main-container-block-black');
//     //document.body.style.backgroundColor = 'transparent';
//   } else if (theme.type === "video") {
//     // Set video source and show video
//     videoElement.src = theme.background;
//     videoElement.style.display = 'block';
//     document.querySelector('.main-container-block').style.backgroundImage = 'none';
//      document.querySelector('.main-container-block').style.backgroundColor = "transparent";
//       document.querySelector('.main-container-block').classList.remove('main-container-block-black');
//     //document.body.style.backgroundColor = 'transparent';
//   } else if (theme.type === "default") {
 
//     // Hide video and set solid color
//     videoElement.style.display = 'none';
//     document.querySelector('.main-container-block').style.backgroundImage = 'none';
//     document.querySelector('.main-container-block').style.backgroundColor = theme.background;
//     if (themeId === "black") {
//       document.querySelector('.main-container-block').classList.add('main-container-block-black');
//     } else {
//       document.querySelector('.main-container-block').classList.remove('main-container-block-black');
//     }
//   }
// }

// // Load last saved theme from JSONBin
// async function loadTheme() {
//   try {
//     const res = await fetch(GET_URL, {
//       headers: { 'X-Master-Key': MASTER_KEY }
//     });
//     const data = await res.json();
//     const theme = data.record?.theme || "white";
//     select.val(theme).trigger('change');
//     applyTheme(theme);
//   } catch (err) {
//     console.error("Load error:", err);
//     // Apply default theme if loading fails
//     applyTheme("white");
//   }
// }

// // Save selected theme to JSONBin
// async function saveTheme(theme) {
//   try {
//     await fetch(PUT_URL, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Master-Key': MASTER_KEY
//       },
//       body: JSON.stringify({ theme })
//     });
//   } catch (err) {
//     console.error("Save error:", err);
//   }
// }

// // When user selects a new theme
// select.on('change', async function() {
//   const theme = $(this).val();
//   applyTheme(theme);
//   await saveTheme(theme);
// });

// // Load on start
// loadTheme();

// Theme configuration object
const themes = {
  // Image themes
  "hill": {
    type: "image",
    background: "assets/theme/hill.png",
    opacity: 0.7
  },
  "candy": {
    type: "image",
    background: "assets/theme/candy.png",
    opacity: 0.7
  },
  "sky": {
    type: "image",
    background: "assets/theme/sky.png",
    opacity: 0.7
  },
  "playground": {
    type: "image",
    background: "assets/theme/playground.png",
    opacity: 0.7
  },
  "water": {
    type: "image",
    background: "assets/theme/water.png",
    opacity: 0.7
  },

  // Video themes
  "car": {
    type: "video",
    background: "assets/theme/car.mp4",
    opacity: 0.5
  },
  "space": {
    type: "video",
    background: "assets/theme/space.mp4",
    opacity: 0.5
  },

  // Default themes
  "white": {
    type: "default",
    background: "#f8f8f8",
    opacity: 1
  },
  "black": {
    type: "default",
    background: "#000000",
    opacity: 0.1
  }
};

const BIN_ID = "68eb0729ae596e708f0f1e67";
const GET_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
const MASTER_KEY = "$2a$10$u7Mi.anzXWGXJSSlNcetHOp91wqYtvvmtX7KYz.CbBplCZud7TV0i";

const select = $('#themeSelect');
const videoElement = document.getElementById('videoBackground');

// Initialize Select2
select.select2({
  templateResult: formatThemeOption,
  templateSelection: formatThemeSelection,
  width: '100%',
  minimumResultsForSearch: Infinity
});

// Format theme options in Select2
function formatThemeOption(theme) {
  if (!theme.id) return theme.text;
  const themeData = themes[theme.id];
  let $theme = $('<span class="theme-option"></span>');
  if (themeData.type === "image") {
    $theme.append($('<img src="' + themeData.background + '" />'));
  } else if (themeData.type === "video") {
    $theme.append($('<img src="https://img.icons8.com/color/20/000000/video.png" />'));
  } else {
    $theme.append($('<img src="https://img.icons8.com/color/20/000000/paint-palette.png" />'));
  }
  $theme.append(theme.text);
  return $theme;
}

// Format selected theme in Select2
function formatThemeSelection(theme) {
  if (!theme.id) return theme.text;
  return theme.text;
}

// Apply theme
function applyTheme(themeId) {
  const theme = themes[themeId];
  if (!theme) return;

  // Apply opacity to tool-container-theme elements
  document.querySelectorAll('.tool-container-theme').forEach(el => {
    el.style.background = `rgba(255, 255, 255, ${theme.opacity})`;
  });

  // Handle different theme types
  if (theme.type === "image") {
    videoElement.style.display = 'none';
    document.querySelector('.main-container-block').style.backgroundImage =
      `linear-gradient(#c8c8c87d, #c8c8c87d),url('${theme.background}')`;
    document.querySelector('.main-container-block').classList.remove('main-container-block-black');
  } else if (theme.type === "video") {
    videoElement.src = theme.background;
    videoElement.style.display = 'block';
    document.querySelector('.main-container-block').style.backgroundImage = 'none';
    document.querySelector('.main-container-block').style.backgroundColor = "transparent";
    document.querySelector('.main-container-block').classList.remove('main-container-block-black');
  } else if (theme.type === "default") {
    videoElement.style.display = 'none';
    document.querySelector('.main-container-block').style.backgroundImage = 'none';
    document.querySelector('.main-container-block').style.backgroundColor = theme.background;
    if (themeId === "black") {
      document.querySelector('.main-container-block').classList.add('main-container-block-black');
    } else {
      document.querySelector('.main-container-block').classList.remove('main-container-block-black');
    }
  }
}

// Load last saved theme from JSONBin (only for first time)
async function loadTheme() {
  try {
    const res = await fetch(GET_URL, {
      headers: { 'X-Master-Key': MASTER_KEY }
    });
    const data = await res.json();
    const theme = data.record?.theme || "white";
    select.val(theme).trigger('change');
    applyTheme(theme);
  } catch (err) {
    console.error("Load error:", err);
    applyTheme("white");
  }
}

// 🔹 When user selects a new theme — save only for this device (not globally)
select.on('change', function() {
  const theme = $(this).val();
  applyTheme(theme);
  sessionStorage.setItem("currentTheme", theme);
});

// 🔹 Load from sessionStorage first (local device only)
window.addEventListener('load', () => {
  const storedTheme = sessionStorage.getItem("currentTheme");
  if (storedTheme) {
    select.val(storedTheme).trigger('change');
    applyTheme(storedTheme);
  } else {
    loadTheme(); // first load uses JSONBin default
  }
});
