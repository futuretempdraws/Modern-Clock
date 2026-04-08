// Set all constants at beginning of run //
const clock = document.getElementById('clock');
const clockBg = document.getElementById('clock-bg');
const clockBgToggle = document.getElementById('clockbg');
const formatSelect = document.getElementById('format');
const colorPicker = document.getElementById('color');
const styleSelect = document.getElementById('style');
const bgPicker = document.getElementById('bgcolor');
const bgImage = document.getElementById('bgimage');
const bgUrlInput = document.getElementById('bgurl');
const applyBgUrlBtn = document.getElementById('applyBgUrl');
const clearBgUrlBtn = document.getElementById('clearBgUrl');
const secondsCheckbox = document.getElementById('seconds');
const controlsTextElements = document.querySelectorAll('.controls *');
const settingsBtn = document.getElementById('settings-btn');
const autoTextToggle = document.getElementById('autotext');
const uiTextNodes = document.querySelectorAll('label, .top-right-text, #settings-btn span, .upload-icon, #app-name, #weather'); // This is where you'll update the text that will update when ambient mode is turned on or off //
const isAmbient = () => styleSelect.value === 'ambient';
const modal = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');

// Small helper if you ever want to set ambient via the color picker in solid hex
const hexToRgba = (hex, a = 0.45) => {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
};
const controlsPanel = document.querySelector('.controls');
let panelOpen = false;

const now = new Date();

const options = { year: 'numeric', month: 'short', day: 'numeric' };
const formattedDate = now.toLocaleDateString('en-US', options);
const dateElement = document.getElementById('currentDate');
dateElement.innerHTML = formattedDate;

// --- New element references (place with other consts) ---
const blurEffectsToggle = document.getElementById('enableBlur');
const topBarToggle = document.getElementById('showTopBar');
const topBar = document.querySelector('.top-bar');

// utility to query the blur elements in one place
const blurElementsSelector = '#clock-bg, .controls, #settings-btn, .top-bar, #dateBackground';
const blurElements = document.querySelectorAll(blurElementsSelector);

settingsBtn.addEventListener('click', () => {
    panelOpen = !panelOpen;
    controlsPanel.style.transition = 'transform 0.5s cubic-bezier(0.25,1,0.5,1), opacity 0.5s ease';
    if(panelOpen){
        controlsPanel.style.transform = 'translateX(-50%) translateY(-10px)'; // move up
        controlsPanel.style.opacity = '1';
    } else {
        controlsPanel.style.transform = 'translateX(-50%) translateY(0)';
        controlsPanel.style.opacity = '0';
    }
  settingsBtn.style.display = panelOpen ? 'none' : 'flex';
});

document.addEventListener('click', (e) => {
    if(panelOpen && !controlsPanel.contains(e.target) && !settingsBtn.contains(e.target)){
        controlsPanel.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        controlsPanel.style.transform = 'translateX(-50%) translateY(0)';
        controlsPanel.style.opacity = '0';
        panelOpen = false;
        settingsBtn.style.display = 'flex';
    }
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (formatSelect.value === '12') hours = hours % 12 || 12;

    let timeStr = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
    if(secondsCheckbox.checked) timeStr += `:${seconds.toString().padStart(2,'0')}`;
    clock.textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

function applyClockStyle() {
  // Clear prior classes
  clock.classList.remove('ambient-clock');
  dateElement.classList.remove('ambient-ui');
  uiTextNodes.forEach(n => n.classList.remove('ambient-ui'));

  if (isAmbient()) {
    // Add ambient classes
    clock.classList.add('ambient-clock');
    dateElement.classList.add('ambient-ui');
    uiTextNodes.forEach(n => n.classList.add('ambient-ui'));

    // If auto text is OFF, drive ambient color from the color picker immediately
    if (!autoTextToggle.checked) {
      const amb = hexToRgba(colorPicker.value, 0.75);
      // set ambient variable AND use it for UI text by updating --text-color
      document.documentElement.style.setProperty('--ambient-color', amb);
      document.documentElement.style.setProperty('--text-color', amb);
      clock.style.color = amb;     // clock is special (blend mode); keep this
      setDateColor(amb);

      // remove inline color from UI nodes so CSS variable takes over
      uiTextNodes.forEach(n => n.style.color = '');
      controlsTextElements.forEach(el => { if (el.tagName !== 'INPUT' || el.type !== 'file') el.style.color = ''; });
    }
    // If auto text is ON, updateTextColor() will set the variables periodically.
  } else {
    // SOLID mode: set from color picker right now
    const solid = colorPicker.value;
    // clock still gets direct color
    clock.style.color = solid;
    setDateColor(solid);

    // use CSS variable for all other UI text
    document.documentElement.style.setProperty('--text-color', solid);

    // remove inline styles so CSS variable applies uniformly
    controlsTextElements.forEach(el => {
      if (el.tagName !== 'INPUT' || el.type !== 'file') el.style.color = '';
    });
    uiTextNodes.forEach(n => n.style.color = '');
  }
}

colorPicker.addEventListener('input', () => {
  if (isAmbient() && !autoTextToggle.checked) {
    const amb = hexToRgba(colorPicker.value, 0.75);
    document.documentElement.style.setProperty('--ambient-color', amb);
    clock.style.color = amb;
    setDateColor(amb);
    uiTextNodes.forEach(n => n.style.color = amb);
  } else {
    applyClockStyle();
  }
});

bgPicker.addEventListener('input', () => {
    document.body.style.background = bgPicker.value;
    document.body.style.backgroundImage = '';
});

// 1. Select the input element
const blurInput = document.getElementById('blurControl');

// 2. Function to update the CSS variable
function updateBlurAmount(value) {
    // specific check to ensure value isn't empty or negative
    const pxValue = value ? `${value}px` : '20px';
    document.documentElement.style.setProperty('--blur-amount', pxValue);
}

// 3. Event Listener for real-time updates
if (blurInput) {
    blurInput.addEventListener('input', (e) => {
        const val = e.target.value;
        updateBlurAmount(val);
        // Save to localStorage so it persists on reload
        localStorage.setItem('modernClock.blurAmount', val);
    });
}

// 4. Load saved value on page load
const storedBlurAmount = localStorage.getItem('modernClock.blurAmount');
if (storedBlurAmount) {
    // Update the input field to show the saved number
    if (blurInput) blurInput.value = storedBlurAmount;
    // Update the actual visual blur
    updateBlurAmount(storedBlurAmount);
}

styleSelect.addEventListener('change', applyClockStyle);
secondsCheckbox.addEventListener('change', updateClock);
formatSelect.addEventListener('change', updateClock);

clockBgToggle.addEventListener('change', () => {
    clockBg.style.display = clockBgToggle.checked ? 'block' : 'none';
});

bgImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(event){
            const img = new Image();
            img.onload = () => {
                document.body.style.transition = 'background-image 0.5s ease';
                document.body.style.backgroundImage = `url('${event.target.result}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Apply when button clicked
applyBgUrlBtn.addEventListener('click', () => {
  applyBackgroundFromUrl(bgUrlInput.value);
});

// Apply when pressing Enter inside the input
bgUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    applyBackgroundFromUrl(bgUrlInput.value);
  }
});

// Clear
clearBgUrlBtn.addEventListener('click', () => {
  bgUrlInput.value = '';
  clearBackgroundImage();
});

// Automatic text color detection for clock and controls with interval, adapted for images
let textColorInterval = 500; // editable interval in ms
function computeBrightnessFromImage(){
    return new Promise(resolve => {
        const bodyBg = window.getComputedStyle(document.body).backgroundImage;
        if(bodyBg && bodyBg !== 'none'){
            const imgUrl = bodyBg.slice(5, -2);
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let r=0,g=0,b=0, count=0;
                for(let i=0; i<data.length; i+=4){
                    r += data[i]; g += data[i+1]; b += data[i+2]; count++;
                }
                r = Math.floor(r/count); g = Math.floor(g/count); b = Math.floor(b/count);
                resolve((r*299 + g*587 + b*114)/1000);
            };
            img.onerror = () => resolve(127); // fallback brightness
            img.src = imgUrl;
        } else {
            const computedBg = window.getComputedStyle(document.body).backgroundColor;
            let r=0,g=0,b=0;
            if(computedBg.startsWith('rgb')){
                const vals = computedBg.match(/\d+/g);
                r = parseInt(vals[0]); g = parseInt(vals[1]); b = parseInt(vals[2]);
            } else {
                const hex = computedBg.replace('#','');
                r = parseInt(hex.substring(0,2),16);
                g = parseInt(hex.substring(2,4),16);
                b = parseInt(hex.substring(4,6),16);
            }
            resolve((r*299 + g*587 + b*114)/1000);
        }
    });
}

function setDateColor(c) {
  if (!dateElement) return;       // safety
  dateElement.style.transition = 'color 0.3s ease';
  dateElement.style.color = c;
}
  
async function updateTextColor(){
  const brightness = await computeBrightnessFromImage();
  const solid = (brightness < 128) ? '#fff' : '#000';
  const ambient = (brightness < 128) ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';

  if (isAmbient()) {
    // Drive ambient via CSS vars; let CSS variable control UI text
    document.documentElement.style.setProperty('--ambient-color', ambient);
    document.documentElement.style.setProperty('--text-color', ambient);
    clock.style.transition = 'color 0.5s ease';
    clock.style.color = ambient;
    // remove inline colors so CSS var can be used everywhere
    uiTextNodes.forEach(n => { n.style.transition = 'color 0.3s ease'; n.style.color = ''; });
    controlsTextElements.forEach(el => { if (el.tagName !== 'INPUT' || el.type !== 'file') el.style.color = ''; });
    setDateColor(ambient);
  } else {
    // SOLID: set CSS var for global UI text and clock
    document.documentElement.style.setProperty('--text-color', solid);
    clock.style.transition = 'color 0.5s ease';
    clock.style.color = solid;
    controlsTextElements.forEach(el => {
      el.style.transition = 'color 0.5s ease';
      if (el.tagName !== 'INPUT' || el.type !== 'file') el.style.color = '';
      if (el.tagName === 'OPTION') el.style.backgroundColor = '';
    });
    uiTextNodes.forEach(n => n.style.color = '');
    setDateColor(solid);
  }

  // dateBackground tweaks (keeps same)
  const dateBg = document.getElementById('dateBackground');
  if (dateBg) {
    dateBg.style.background = (brightness >= 128) ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
    dateBg.style.backdropFilter = 'blur(20px)';
    dateBg.style.webkitBackdropFilter = 'blur(20px)';
    dateBg.style.borderRadius = '24px';
  }
}

setInterval(() => {
    if (autoTextToggle.checked) updateTextColor();
}, textColorInterval);

if(autoTextToggle.checked) updateTextColor();

// Safety: clicking anywhere on the visual switch should toggle the checkbox
const blurSwitch = document.getElementById('blur-toggle');
const blurToggle = document.getElementById('blurMode');

blurSwitch.addEventListener('click', (e) => {
  // If the click wasn't directly on the checkbox, flip it manually
  if (e.target !== blurToggle) {
    blurToggle.checked = !blurToggle.checked;
    blurToggle.dispatchEvent(new Event('change', { bubbles: true }));
  }
});

function applyBlurTheme(isLight) {
  const root = document.documentElement;
  const get = (v) => getComputedStyle(root).getPropertyValue(v).trim();

  // derive values from :root CSS variables
  const blurBg = isLight ? get('--blur-bg-light') : get('--blur-bg-dark');
  const textColor = isLight ? get('--text-light') : get('--text-dark');

  // update CSS variables (these are what the CSS reads)
  root.style.setProperty('--blur-bg', blurBg);
  root.style.setProperty('--text-color', textColor);

  // Set backgrounds for blur elements, but do NOT set inline color
  document.querySelectorAll('#clock-bg, .controls, #settings-btn, .top-bar, #dateBackground')
    .forEach(el => {
      el.style.background = blurBg;
      // don't set el.style.color here: let CSS var handle it
      el.style.transition = 'background 0.5s ease, color 0.5s ease';
    });
}

// Opening creator pop-up
openBtn.onclick = () => modal.style.display = 'flex';

// Closing with X button
closeBtn.onclick = () => modal.style.display = 'none';

// Close creator pop-up by clicking outside
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// --- Toggle blur effects on/off ---
function setBlurEnabled(enabled, isLightMode = null) {
  // isLightMode optional: if provided, will set data-bg attribute for color fallback
  blurElements.forEach(el => {
    if (enabled) {
      // remove no-blur class to restore blur/backdrop-filter
      el.classList.remove('no-blur');
      // remove any inline backdrop style overrides
      el.style.backdropFilter = '';
      el.style.webkitBackdropFilter = '';
      el.removeAttribute('data-bg');
    } else {
      // disable blur by adding class and set a fallback tint depending on current mode
      el.classList.add('no-blur');
      if (isLightMode === true) el.setAttribute('data-bg','light');
      else if (isLightMode === false) el.setAttribute('data-bg','dark');
      // Also explicitly remove backdrop style just in case
      el.style.backdropFilter = 'none';
      el.style.webkitBackdropFilter = 'none';
    }
  });
}

// Event: when user toggles the blur effects switch
blurEffectsToggle.addEventListener('change', () => {
  // Determine current light/dark via your existing blurToggle or CSS var
  // If you use the blurMode checkbox for light/dark, use blurToggle.checked;
  // otherwise, detect computed --text-color or similar. Here we use blurToggle as in your code.
  const isLightMode = !!blurToggle.checked; // true when light mode is active
  setBlurEnabled(blurEffectsToggle.checked, isLightMode);
});

// --- Toggle top bar visibility ---
function setTopBarVisible(visible) {
  if (!topBar) return;
  topBar.style.display = visible ? '' : 'none'; // '' -> default (flex from CSS)
  // If hiding the top bar you may want to reposition the settings button
  // (it sits near bottom center now, so typically nothing else required).
}

topBarToggle.addEventListener('change', () => {
  setTopBarVisible(topBarToggle.checked);
});

blurToggle.addEventListener('change', () => {
  if (blurToggle.checked) {
    // Light mode
    document.documentElement.style.setProperty('--blur-bg', getComputedStyle(document.documentElement).getPropertyValue('--blur-bg-light'));
    document.documentElement.style.setProperty('--text-color', getComputedStyle(document.documentElement).getPropertyValue('--text-light'));
    applyBlurTheme(true);
  } else {
    // Dark mode
    document.documentElement.style.setProperty('--blur-bg', getComputedStyle(document.documentElement).getPropertyValue('--blur-bg-dark'));
    document.documentElement.style.setProperty('--text-color', getComputedStyle(document.documentElement).getPropertyValue('--text-dark'));
    applyBlurTheme(false);
  }
  // after applyBlurTheme(true/false) runs:
  const blurIsEnabled = blurEffectsToggle ? blurEffectsToggle.checked : true;
  // If blur is disabled, re-run setBlurEnabled to update the fallback bg mode
  if (!blurIsEnabled) {
    const isLightMode = blurToggle.checked; // true = light
    setBlurEnabled(false, isLightMode);
  }
});

/**
 * Try to apply a remote image URL as the page background.
 * - Preloads the image (crossOrigin attempt).
 * - Detects CORS tainting by attempting a small canvas read.
 * - Sets document.body.style.backgroundImage and triggers updateTextColor().
 */
function applyBackgroundFromUrl(url) {
  if (!url || url.trim() === '') {
    clearBackgroundImage();
    return;
  }

  const sanitized = url.trim();

  // Basic URL sanity (http(s) or data:)
  if (!/^https?:\/\//i.test(sanitized) && !/^data:/i.test(sanitized)) {
    alert('Please enter a valid image URL (http(s) or data URL).');
    return;
  }

  const img = new Image();
  // Try to request crossOrigin so canvas read works if the host allows it
  img.crossOrigin = 'Anonymous';

  // show quick feedback (optional): set a temporary blurred background while loading
  // document.body.style.opacity = 0.95;

  img.onload = () => {
    // Try a small canvas read to detect whether the image is usable for brightness sampling
    let canReadPixels = true;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(200, img.width);
      canvas.height = Math.min(200, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // try reading one pixel — will throw if CORS blocks it
      ctx.getImageData(0, 0, 1, 1);
    } catch (err) {
      // If we get here, the image loaded but the canvas is tainted (CORS)
      canReadPixels = false;
      console.warn('Background image is CORS-tainted — automatic brightness detection may be unavailable.', err);
    }

    // Apply the background image regardless of CORS
    document.body.style.backgroundImage = `url('${sanitized}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    // If we could read pixels, let existing auto-text-color run to compute brightness.
    // If not, call updateTextColor() anyway; computeBrightnessFromImage will fallback to computed background color
    // (which would be the body color) — so it won't capture image brightness. You can prompt the user to
    // choose text color if that matters.
    if (canReadPixels) {
      // short delay to let computed styles settle
      setTimeout(() => updateTextColor(), 40);
    } else {
      // If canvas read failed (CORS), fall back to a reasonable choice:
      // decide by checking image filename for "dark"/"light" keywords as a small heuristic, else keep current behavior.
      let fallbackIsDark = /dark|night|black|midnight/i.test(sanitized);
      document.documentElement.style.setProperty('--text-color', fallbackIsDark ? '#fff' : '#000');
      // Also nudge the clock color (clock is special)
      clock.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    }
  };

  img.onerror = () => {
    alert('Image failed to load. Check the URL or try another image.');
  };

  // Kick off loading
  img.src = sanitized;
}

/** Clears any background image and revert to current background color */
function clearBackgroundImage() {
  document.body.style.backgroundImage = '';
  // No change to bg color itself; if you want to force bgPicker color:
  if (bgPicker && bgPicker.value) {
    document.body.style.background = bgPicker.value;
  } else {
    document.body.style.background = ''; // fallback to default CSS
  }
  // Recompute text color
  setTimeout(() => updateTextColor(), 40);
}

// Default: dark mode
document.documentElement.style.setProperty('--blur-bg', getComputedStyle(document.documentElement).getPropertyValue('--blur-bg-dark'));
document.documentElement.style.setProperty('--text-color', getComputedStyle(document.documentElement).getPropertyValue('--text-dark'));

async function fetchWeatherGov(lat, lon) {
  try {
    // Step 1: Find the forecast office & grid for this lat/lon
    const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const pointRes = await fetch(pointUrl, {
      headers: { "User-Agent": "ModernClockApp (ignacio.shanks@gmail.com)" }
    });
    if (!pointRes.ok) throw new Error("Failed to fetch point data");

    const pointData = await pointRes.json();
    const forecastUrl = pointData.properties.forecastHourly;

    // Step 2: Fetch hourly forecast from the URL provided
    const forecastRes = await fetch(forecastUrl, {
      headers: { "User-Agent": "ModernClockApp (ignacio.shanks@gmail.com)" }
    });
    if (!forecastRes.ok) throw new Error("Failed to fetch forecast");

    const forecastData = await forecastRes.json();

    // Step 3: Get the first period (current hour’s forecast)
    const current = forecastData.properties.periods[0];

    // Extract temp + condition
    const temp = current.temperature;
    const unit = current.temperatureUnit; // F or C
    const condition = current.shortForecast;

    // Pick an emoji based on condition
    let emoji = "☀️";
    if (condition.includes("Cloud")) emoji = "☁️";
    if (condition.includes("Rain")) emoji = "🌧️";
    if (condition.includes("Snow")) emoji = "❄️";
    if (condition.includes("Thunder")) emoji = "⛈️";
    if (condition.includes("Fog")) emoji = "🌫️";

    // Display on your clock
    document.getElementById("weather").textContent = `${temp}°${unit} ${emoji}`;
  } catch (err) {
    console.error("Weather.gov error:", err);
    document.getElementById("weather").textContent = "--°";
  }
}

function getWeatherWithGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err);
        // fallback city
        fetchWeatherByCoords(40.7128, -74.0060); // NYC as default
      }
    );
  } else {
    console.warn("Geolocation not supported.");
    fetchWeatherByCoords(40.7128, -74.0060);
  }
}

/* ======= Widgets panel / widget-mode wiring ======= */

// DOM refs (place after existing const declarations)
const widgetsBtn = document.getElementById('widgets-btn');
const widgetsPanel = document.getElementById('widgets-panel');
const widgetsPanelClose = document.getElementById('widgets-panel-close');
const widgetModeToggle = document.getElementById('widgetModeToggle');
const widgetsGrid = document.getElementById('widgets-grid');
const addWidgetBtn = document.getElementById('addWidgetBtn');

// open/close the panel
function openWidgetsPanel() {
  widgetsPanel.setAttribute('aria-hidden','false');
  // trap focus if you want (basic)
  widgetsPanel.querySelector('.widgets-panel-inner').focus?.();
}
function closeWidgetsPanel() {
  widgetsPanel.setAttribute('aria-hidden','true');
}

// toggle widget mode on body for site-wide changes
function setWidgetMode(active) {
  if (active) {
    document.body.classList.add('widget-mode-active');
    // make tiles draggable now
    Array.from(widgetsGrid.children).forEach(tile => tile.setAttribute('draggable', 'true'));
  } else {
    document.body.classList.remove('widget-mode-active');
    Array.from(widgetsGrid.children).forEach(tile => tile.setAttribute('draggable', 'false'));
  }
}

// basic open/close events
widgetsBtn.addEventListener('click', (e) => {
  openWidgetsPanel();
  // show the panel and keep existing settings button visible per your preference
});
widgetsPanelClose.addEventListener('click', closeWidgetsPanel);
// close on outside click (panel overlay is inside; we will close when pressing ESC)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && widgetsPanel.getAttribute('aria-hidden') === 'false') closeWidgetsPanel();
});

// widget mode toggle
widgetModeToggle.addEventListener('change', () => {
  setWidgetMode(widgetModeToggle.checked);
});

// add widget button (creates a new placeholder tile)
let widgetCounter = (widgetsGrid.children.length || 0) + 1;
addWidgetBtn.addEventListener('click', () => {
  widgetCounter++;
  const tile = document.createElement('div');
  tile.className = 'widget-tile';
  tile.dataset.id = `w-${Date.now()}`;
  tile.draggable = widgetModeToggle.checked;
  tile.innerHTML = `
    <div class="widget-controls">
      <button class="widget-delete" title="Delete">✕</button>
      <button class="widget-edit" title="Edit">✎</button>
    </div>
    <div class="widget-content">
      <div class="widget-title">New Widget</div>
      <div class="widget-body">Placeholder content</div>
    </div>
    <div class="resize-handle" title="Resize"></div>
  `;
  widgetsGrid.appendChild(tile);
  wireWidgetTile(tile);
});

// wire up existing tiles
function wireWidgetTile(tile) {
  // delete
  const del = tile.querySelector('.widget-delete');
  const edit = tile.querySelector('.widget-edit');
  const handle = tile.querySelector('.resize-handle');

  del?.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = tile.dataset.id;
    if (confirm('Delete widget?')) {
      tile.remove();
    }
  });

  edit?.addEventListener('click', (e) => {
    e.stopPropagation();
    // Hook: open individual widget settings — placeholder:
    alert(`Widget settings for ${tile.dataset.id} (implement UI later)`);
  });

  // Simple resizing inside the panel
  if (handle) {
    let resizing = false;
    let startX, startY, startW, startH;

    handle.addEventListener('pointerdown', (e) => {
      if (!widgetModeToggle.checked) return;
      e.stopPropagation();
      resizing = true;
      tile.dataset.resizing = 'true';
      startX = e.clientX;
      startY = e.clientY;
      const rect = tile.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // set inline size (constrained)
      tile.style.width = Math.max(140, startW + dx) + 'px';
      tile.style.height = Math.max(80, startH + dy) + 'px';
    });

    window.addEventListener('mouseup', () => {
      if (resizing) {
        resizing = false;
        document.body.style.userSelect = '';
        tile.dataset.resizing = 'false';
      }
    });
  }

  // Drag & drop handlers for reordering
  tile.addEventListener('dragstart', (e) => {
    if (!widgetModeToggle.checked) { e.preventDefault(); return; }
    tile.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tile.dataset.id || '');
    // store reference
    draggingTile = tile;
  });
  tile.addEventListener('dragend', () => {
    tile.classList.remove('dragging');
    draggingTile = null;
  });
}

// wire each initial tile
let draggingTile = null;
Array.from(widgetsGrid.children).forEach(child => wireWidgetTile(child));

// grid drop handling
widgetsGrid.addEventListener('dragover', (e) => {
  if (!widgetModeToggle.checked) return;
  e.preventDefault();
  const after = getDragAfterElement(widgetsGrid, e.clientX, e.clientY);
  if (after == null) {
    widgetsGrid.appendChild(draggingTile);
  } else {
    widgetsGrid.insertBefore(draggingTile, after);
  }
});

function getDragAfterElement(container, x, y) {
  const draggableElements = [...container.querySelectorAll('.widget-tile:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    // choose the element with smallest negative offset (closest above)
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element || null;
}

/* ===== Desktop drop & clock-as-widget support ===== */

// Required DOM refs
const desktopOverlay = document.getElementById('desktop-grid-overlay');
const clockContainer = document.getElementById('clock-container'); // existing
const mainBody = document.body;

// snap grid size (px)
const SNAP = 20;

// Helper: snap coordinate to grid
const snapToGrid = (v) => Math.round(v / SNAP) * SNAP;

// Track which tile is currently dragging/moving
let currentDraggingTile = null;
let resizingTile = null;

// Convert a panel tile (inside widgetsGrid) into a desktop-placed widget
function placeTileOnDesktop(tile, clientX, clientY) {
  // If tile is originally in the panel, remove and append to body
  const rect = document.documentElement.getBoundingClientRect();

  // Make it absolute positioned
  tile.classList.add('desktop-widget');
  // remove grid flow classes if any
  tile.style.width = tile.offsetWidth + 'px';
  tile.style.height = tile.offsetHeight + 'px';
  // position centered on pointer
  const left = snapToGrid(clientX - tile.offsetWidth / 2);
  const top  = snapToGrid(clientY - tile.offsetHeight / 2);
  tile.style.left = left + 'px';
  tile.style.top = top + 'px';

  // append to body (top-level desktop)
  document.body.appendChild(tile);

  // make draggable/movable on desktop
  tile.setAttribute('draggable', 'false'); // we use pointer drag on desktop
  wireDesktopDrag(tile);
}

// When widget-mode is toggled, convert clock into a widget-like tile (in-place)
// and when turned off, if clock has been placed on desktop, consider restoring layout.
function toggleClockWidgetActive(active) {
  if (active) {
    // mark clock-container as widget-like
    clockContainer.classList.add('widget-tile', 'desktop-widget', 'main-clock-widget');
    // set a reasonable size & style
    clockContainer.style.width = clockContainer.offsetWidth + 'px';
    clockContainer.style.height = clockContainer.offsetHeight + 'px';
    // center if not already absolute
    const cx = window.innerWidth/2 - clockContainer.offsetWidth/2;
    const cy = window.innerHeight/2 - clockContainer.offsetHeight/2;
    clockContainer.style.left = snapToGrid(cx) + 'px';
    clockContainer.style.top = snapToGrid(cy) + 'px';
    clockContainer.style.position = 'absolute';
    // show overlay
    mainBody.classList.add('widget-mode-active');
  } else {
    // remove widget classes and cleanup if needed
    clockContainer.classList.remove('main-clock-widget');
    clockContainer.style.position = '';
    clockContainer.style.left = '';
    clockContainer.style.top = '';
    clockContainer.style.width = '';
    clockContainer.style.height = '';
    mainBody.classList.remove('widget-mode-active');
  }
}

// When a drag is initiated inside the widgets panel, we auto-close the panel and let the user drop on desktop
widgetsGrid.addEventListener('dragstart', (e) => {
  const tileId = e.dataTransfer.getData('text/plain') || (e.target && e.target.closest('.widget-tile')?.dataset.id);
  const tile = widgetsGrid.querySelector(`[data-id="${tileId}"]`) || e.target.closest('.widget-tile');
  if (!tile) return;
  // If the user is currently resizing this tile, block drag
  if (tile.dataset.resizing === 'true') { e.preventDefault(); return; }

  // auto-close the panel so pointer can drop on page
  closeWidgetsPanel();

  // brief delay to ensure panel closed, then place tile into body as desktop widget at cursor location on drop
  currentDraggingTile = tile;
  // highlight overlay
  desktopOverlay.style.opacity = '1';
});

// For safety: suppress dragstart when resizing is active
widgetsGrid.addEventListener('dragstart', (e) => {
  const tile = e.target.closest('.widget-tile');
  if (tile && tile.dataset.resizing === 'true') {
    e.preventDefault();
  }
});

// Desktop drop handlers
document.addEventListener('dragover', (e) => {
  if (!widgetModeToggle.checked) return;
  e.preventDefault(); // allow drop
});

document.addEventListener('drop', (e) => {
  if (!widgetModeToggle.checked) return;
  e.preventDefault();
  desktopOverlay.style.opacity = '0';
  // find the tile id
  const id = e.dataTransfer.getData('text/plain') || (currentDraggingTile && currentDraggingTile.dataset.id);
  let tile = widgetsGrid.querySelector(`[data-id="${id}"]`) || currentDraggingTile;
  if (!tile) return;

  // Move tile to desktop
  placeTileOnDesktop(tile, e.clientX, e.clientY);

  // clear dragging state
  currentDraggingTile = null;
});

// Make existing panel tiles close panel & prepare to place when dragstart fired on them
// Also ensure hover shows controls (we already have CSS), so no JS needed for that except pointer events.

// Wire desktop drag via pointer (so user can pick up placed widget and move it around)
function wireDesktopDrag(tile) {
  let offsetX = 0, offsetY = 0, dragging = false;

  tile.addEventListener('pointerdown', (ev) => {
    // If clicking a control (delete/edit/resize), ignore move
    if (ev.target.closest('.widget-controls') || ev.target.closest('.resize-handle')) return;
    if (!widgetModeToggle.checked) return;
    dragging = true;
    tile.setPointerCapture(ev.pointerId);
    tile.classList.add('dragging');
    offsetX = ev.clientX - tile.getBoundingClientRect().left;
    offsetY = ev.clientY - tile.getBoundingClientRect().top;
    ev.preventDefault();
  });

  window.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const left = snapToGrid(ev.clientX - offsetX);
    const top  = snapToGrid(ev.clientY - offsetY);
    tile.style.left = left + 'px';
    tile.style.top  = top + 'px';
  });

  window.addEventListener('pointerup', (ev) => {
    if (!dragging) return;
    dragging = false;
    tile.classList.remove('dragging');
    try { tile.releasePointerCapture(ev.pointerId); } catch {}
  });

  // Make sure resize handle still works (existing resizing code will apply)
  wireWidgetTile(tile); // ensure controls wired (delete/edit/resizer) for moved tile
}

/* ----- prevent resizing triggering dragstart ----- */
// When mousedown on resize-handle in panel tiles we set dataset.resizing flag.
// In earlier wireWidgetTile code we used handle mousedown to set local resizing boolean.
// We'll extend that to set a data attribute while resizing is active.

document.addEventListener('pointerdown', (e) => {
  const handle = e.target.closest('.resize-handle');
  if (!handle) return;
  const tile = handle.closest('.widget-tile');
  if (!tile) return;
  tile.dataset.resizing = 'true';
});

document.addEventListener('pointerup', (e) => {
  const handle = e.target.closest('.resize-handle');
  if (handle) {
    const tile = handle.closest('.widget-tile');
    if (tile) tile.dataset.resizing = 'false';
  }
  // Also clear any tiles still flagged after pointer up anywhere
  document.querySelectorAll('.widget-tile[data-resizing="true"]').forEach(t => t.dataset.resizing = 'false');
});

/* ----- reacting to widget-mode toggle: overlay + clock transform ----- */
widgetModeToggle.addEventListener('change', () => {
  const active = widgetModeToggle.checked;
  // show overlay grid background
  desktopOverlay.style.display = active ? 'block' : 'none';
  // transform clock
  toggleClockWidgetActive(active);

  // if deactivating widget mode, ensure overlay removed
  if (!active) {
    desktopOverlay.style.opacity = '0';
  }
});

// make sure initial state sync (in case toggle checked on load)
desktopOverlay.style.display = widgetModeToggle.checked ? 'block' : 'none';
if (widgetModeToggle.checked) toggleClockWidgetActive(true);

/* Optional: ensure widgets-panel doesn't steal focus or cause accidental actions
   You can extend with a focus trap and ARIA announcements later. */


// API key for weather api services: 60854b06bb29402b8b0152713252208 //

// Save when toggles change
blurEffectsToggle.addEventListener('change', () => {
  localStorage.setItem('modernClock.enableBlur', blurEffectsToggle.checked ? '1' : '0');
  setBlurEnabled(blurEffectsToggle.checked, !!blurToggle.checked);
});
topBarToggle.addEventListener('change', () => {
  localStorage.setItem('modernClock.showTopBar', topBarToggle.checked ? '1' : '0');
  setTopBarVisible(topBarToggle.checked);
});

// On init (before setBlurEnabled / setTopBarVisible) try to load:
const storedBlur = localStorage.getItem('modernClock.enableBlur');
if (storedBlur !== null) blurEffectsToggle.checked = storedBlur === '1';
const storedBar = localStorage.getItem('modernClock.showTopBar');
if (storedBar !== null) topBarToggle.checked = storedBar === '1';

// Keep checkbox and visuals in sync on load (false = dark)
blurToggle.checked = false;
applyBlurTheme(false);
fetchWeatherGov(lat, lon);
setInterval(getWeatherWithGeolocation, 15 * 60 * 1000);
applyClockStyle();
updateTextColor();
setBlurEnabled(blurEffectsToggle.checked, !!blurToggle.checked);
setTopBarVisible(topBarToggle.checked);