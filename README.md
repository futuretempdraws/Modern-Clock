# Modern Clock

A clean, modern web application designed to help you study and stay focused. Modern Clock combines essential time-tracking functionality with customizable visual styling—enough features to be useful without becoming distracting.

## Features

### Clock Display
- **12 and 24-hour formats** — Toggle between standard 12-hour or 24-hour time display
- **Seconds display** — Show or hide seconds with a single toggle
- **Large, readable text** — High-contrast, bold typography optimized for visibility
- **Live updates** — Clock updates every second

### Customization & Styling
- **Text color picker** — Choose any color for the clock display
- **Text style modes:**
  - **Solid** — Standard text rendering
  - **Ambient** — Subtle, blended styling that adapts to your background
- **Background color picker** — Select a solid background color
- **Background images** — Upload images from your device or paste image URLs
- **Auto text color detection** — Automatically adjusts text color (white/black) based on background brightness
- **Clock background** — Optional glassmorphic background with blur effect

### Visual Effects
- **Backdrop blur** — Modern glassmorphism effects with toggle and adjustable intensity (1-100px)
- **Smooth transitions** — All changes animate smoothly
- **Top bar** — Displays weather information and current date (toggle visibility)
- **Light/Dark mode** — Blur theme adapts to your style preference

### Persistent Settings
- Settings are saved to browser localStorage, so your preferences persist across sessions:
  - Blur effects toggle
  - Top bar visibility
  - Blur intensity value

### Additional UI
- **Settings panel** — Click the gear icon to reveal all controls
- **Current date display** — Shows today's date in the top bar
- **Real-time updates** — Date and time update automatically

---

## Installation & Usage

### Option 1: Single Compiled File (Recommended for Simplicity)
1. Download the `Compiled (Single File)/compiledCode.html` file
2. Save it to your desired location (Downloads, Documents, or any folder)
3. Open the file in any modern web browser
4. No additional files or setup required

### Option 2: Three Separate Files (Recommended for Development)
1. Download all three files to the same directory:
   - `ModernClock.html`
   - `ModernClockFunction.js`
   - `ClockStyling.css`
2. Place them in the same folder (e.g., Downloads or Documents)
3. Open `ModernClock.html` in a web browser
4. **Important:** All three files must be in the same directory for the application to work correctly

### Getting Started
1. Open the application in your browser
2. Click the gear icon (Settings) at the bottom to reveal all controls
3. Customize your clock:
   - Change text color using the color picker
   - Upload a background image or paste a URL
   - Toggle blur effects and adjust intensity
   - Choose between 12-hour and 24-hour format
   - Toggle seconds display

---

## Browser Requirements

Modern Clock requires a modern web browser with support for:
- CSS Custom Properties (CSS Variables)
- `backdrop-filter` for blur effects
- Modern JavaScript (ES6+)

Works best on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Note: Older browsers will display the application without blur effects, but all core functionality will work.

---

## Known Issues & Limitations

### Weather Feature
The weather feature is currently non-functional and requires rework. The weather display in the top bar shows placeholder values. This feature will be reimplemented in a future version.

### Background Images
- **CORS restrictions:** Images hosted on servers with strict CORS policies may not work. Automatic brightness detection may fail for these images, so text color will fall back to defaults.
- **Remote images:** Cross-origin images may display but won't allow pixel-level color sampling
- **Supported formats:** PNG, JPG, GIF, WebP

### Blur Effects
- `backdrop-filter` support varies: Some older browsers or specific operating systems may not support blur effects. When blur is disabled, a semi-transparent fallback background will be used instead.

### Browser Compatibility
- Mobile browsers may have limited support for some CSS effects
- Test thoroughly in your target browsers before relying on this for production environments

---

## Settings & Customization

### Display Options
| Setting | Options | Default | Effect |
|---------|---------|---------|--------|
| Hour Format | 12-hour, 24-hour | 12-hour | Changes time display format |
| Show Seconds | On/Off | On | Toggles seconds in display |
| Text Style | Solid, Ambient | Solid | Changes text rendering mode |
| Text Color | Any hex color | White | Sets clock text color |
| Show Top Bar | On/Off | On | Shows/hides date and weather bar |

### Background Options
| Setting | Options | Default | Effect |
|---------|---------|---------|--------|
| Background Color | Any hex color | Dark gray | Sets solid background |
| Background Image | File upload or URL | None | Sets background image |
| Auto Text Color | On/Off | On | Auto-detects text color for readability |
| Clock Background | On/Off | Off | Adds blurred background behind clock |

### Visual Effects
| Setting | Options | Default | Effect |
|---------|---------|---------|--------|
| Enable Blur | On/Off | On | Toggles glassmorphism effects |
| Blur Value | 1-100 px | 20 | Adjusts blur intensity |
| Light/Dark Mode | Toggle | Dark | Changes blur theme colors |

---

## Development

### Technologies Used
- **HTML5** — Semantic markup and web standards
- **CSS3** — Modern styling with variables, transitions, and backdrop filters
- **JavaScript (ES6+)** — Event handling, DOM manipulation, color detection
- **Browser APIs:** Geolocation (for future weather), localStorage, Canvas (for brightness detection)

### For Developers
If you'd like to contribute or extend this project, see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- How to submit bug reports and feature requests
- Pull request process
- Development setup instructions

### Key JavaScript Functions
- `updateClock()` — Updates the displayed time
- `applyClockStyle()` — Applies text style (Solid/Ambient)
- `computeBrightnessFromImage()` — Detects background brightness for text color
- `updateTextColor()` — Adjusts text color based on background
- `applyBackgroundFromUrl()` — Loads and applies background images
- `setBlurEnabled()` — Toggles and configures blur effects
- `applyBlurTheme()` — Manages light/dark theme for blur

---

## Tips for Best Results

### Optimal Usage
- Use on a computer or larger screen for best visibility
- Allow geolocation prompt (if/when weather feature is re-enabled) for automatic local weather
- Test blur effects in your browser; adjust values if needed
- Use high-contrast text colors against your background for readability

### Choosing Backgrounds
- Light backgrounds work best with dark text
- Dark backgrounds work best with light text
- Enable "Auto Text Color" for automatic optimization
- Test images to ensure CORS compatibility and proper color sampling

### Performance
- Large, high-resolution background images may impact performance
- Try downscaling images before uploading for better performance
- Reduce blur value if animation feels sluggish

---

## Future Improvements

Planned enhancements (as noted in code comments):
- Reimplement weather feature with working API integration
- iOS-like feature additions
- Settings panel UI improvements
- Option for analog clock display with hands
- Conditional control display (hide irrelevant options based on selections)
- Unit tests and static linting
- Enhanced background brightness sampling
- Expanded persistent settings storage

---

## License

See LICENSE file for usage terms.

---

## Questions or Issues?

Found a bug or have a feature request? Please open an issue on this GitHub repository. See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on reporting issues and suggesting features.