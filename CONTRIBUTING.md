# Contributing to Modern Clock

Thank you for your interest in contributing to Modern Clock! We appreciate all contributions, whether they're bug reports, feature suggestions, or code improvements. Please take a moment to review this guide to make the process smooth for everyone.

## Code of Conduct

### Our Commitment
We are committed to providing a welcoming and inclusive environment for all contributors. We expect all community members to:

- **Be respectful** — Treat all contributors with kindness and professionalism
- **Be inclusive** — Welcome people of all backgrounds, experience levels, and perspectives
- **Be constructive** — Provide helpful feedback and focus on ideas, not individuals
- **Be collaborative** — Work together toward common goals

### Unacceptable Behavior
The following behaviors are not tolerated:
- Harassment, discrimination, or offensive language
- Personal attacks or insults
- Unwelcome advances or attention
- Trolling or deliberate disruption
- Any form of bullying

**If you witness or experience unacceptable behavior, please report it immediately.**

---

## Reporting Bugs

Before submitting a bug report, please check existing issues to avoid duplicates.

### How to Submit a Bug Report

1. **Go to the Issues tab** and click "New Issue"
2. **Choose the "Bug Report" template** (if available)
3. **Provide the following information:**

   - **Title:** Brief, descriptive summary of the bug
   - **Description:** Clear description of what went wrong
   - **Steps to Reproduce:**
     1. Open the app in [browser name/version]
     2. Enable [specific feature]
     3. Perform [specific action]
   - **Expected Behavior:** What should happen
   - **Actual Behavior:** What actually happened
   - **Screenshots/Screen recording:** If applicable
   - **Environment:**
     - Browser (Chrome, Firefox, Safari, Edge) and version
     - Operating system (Windows, macOS, Linux)
     - Device type (desktop, tablet, mobile)
   - **Console Errors:** Any JavaScript errors from the browser console
   - **Additional Context:** Any other relevant details

### Example Bug Report

```
Title: Blur effects not working in Safari

Steps to Reproduce:
1. Open the app in Safari 15.0
2. Enable "Enable Blur Effects" toggle
3. Notice the backdrop blur is not applied

Expected: Backdrop blur effect should appear on the controls panel
Actual: No blur effect is visible; controls have solid background instead

Screenshot: [attachment]
```

---

## Suggesting Features or Enhancements

We'd love to hear your ideas for improving Modern Clock!

### How to Submit a Feature Request

1. **Go to the Issues tab** and click "New Issue"
2. **Choose the "Feature Request" template** (if available)
3. **Provide:**

   - **Title:** Clear, concise title of the feature
   - **Description:** What problem does this solve or what value does it add?
   - **Use Case:** How would you use this feature?
   - **Proposed Solution:** Your idea for implementation (optional)
   - **Alternatives:** Other approaches you've considered
   - **Examples:** Links or screenshots of similar features in other apps

### Example Feature Request

```
Title: Add analog clock display option

Description: Add an optional classic analog clock face alongside the digital display

Use Case: Some users prefer the visual simplicity and familiarity of an analog clock

Proposed Solution: 
- Add a "Display Style" dropdown with options: "Digital" or "Analog"
- When analog is selected, render clock hands on a circular face
- Use existing style customizations (colors, blur) for the clock face background
```

---

## Submitting Changes

### Development Setup

1. **Fork the repository** to your own GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Modern-Clock.git
   cd "Modern Clock"
   ```
3. **Open the project** in your preferred code editor (VS Code recommended)
4. **Test locally** by opening `ModernClock.html` in your browser

### Before You Start

- Check open pull requests and issues to avoid duplicate work
- For significant changes, open an issue first to discuss the approach
- Make sure your changes align with the project's goals

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/descriptive-name
   ```
   Examples: `feature/add-analog-clock`, `fix/textarea-blur-issue`

2. **Make your changes** with clear, logical commits
3. **Test thoroughly:**
   - Test in modern browsers (Chrome, Firefox, Safari, Edge)
   - Test at different viewport sizes (mobile, tablet, desktop)
   - Verify geolocation functionality works (or gracefully falls back)
   - Check console for errors or warnings
   - Verify cross-origin image handling

4. **Keep code style consistent:**
   - Use 2-4 space indentation (match existing code)
   - Use clear, descriptive variable names
   - Add comments for complex logic
   - Keep functions focused and modular

### Commit Messages

Write clear, descriptive commit messages that explain **what** and **why**:

```
Good:
- "Fix geolocation weather fetching bug on app initialization"
- "Add local storage persistence for additional control settings"
- "Improve background brightness sampling with multi-region detection"

Avoid:
- "fix bug"
- "update"
- "changes"
```

**Format:**
```
[Type] Brief description (50 chars or less)

Detailed explanation of the change and why it was made.
Reference any related issues with #123.

- Bullet 1
- Bullet 2
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/descriptive-name
   ```

2. **Create a pull request** using the PR template
3. **Provide:**
   - Clear title summarizing the changes
   - Description of what changed and why
   - Reference to related issues (`Fixes #123`)
   - Testing notes (browsers tested, features verified)
   - Screenshots/recordings if visual changes were made

4. **Be responsive** to feedback and requests for changes
5. **Keep commits clean** — rebase if needed before merge

---

## Code Guidelines

### JavaScript
- Use modern ES6+ syntax (arrow functions, const/let, template literals)
- Avoid global variables; scope appropriately
- Add comments for non-obvious logic
- Handle errors gracefully (geolocation, API calls, CORS issues)

### CSS
- Follow existing naming conventions
- Keep selectors simple and maintainable
- Document complex or non-obvious CSS
- Test across browsers, especially `backdrop-filter` for browser support

### HTML
- Use semantic HTML when possible
- Ensure accessibility (alt text, ARIA labels, keyboard navigation)
- Keep markup clean and properly indented

### General
- Keep functions small and focused
- Avoid code duplication
- Write code that's easy to understand and maintain
- Consider localStorage implications for persisted state

---

## Testing Checklist

Before submitting a PR, verify:

- [ ] Code runs without console errors or warnings
- [ ] Tested in Chrome, Firefox, Safari, and Edge
- [ ] Tested on mobile, tablet, and desktop viewports
- [ ] Geolocation feature tested (or fallback verified)
- [ ] Background image upload tested with various formats/sources
- [ ] Blur effects toggled and verified across browsers
- [ ] Settings are persisted correctly (where applicable)
- [ ] No hardcoded API keys or sensitive data
- [ ] Code follows project style guidelines

---

## Known Issues & Future Work

Please see [README.md](../README.md) for:
- Current known issues
- Recommended improvements
- Browser compatibility notes
- API considerations (Weather.gov requires User-Agent header)

---

## Questions?

- Open a discussion in the Issues tab
- Keep messages respectful and constructive
- Search existing issues first to see if your question has been addressed

---

## Recognition

Thank you for contributing! Your efforts help make Modern Clock better for everyone. Significant contributors may be recognized in the project README or changelog.

---

**Thank you.**

