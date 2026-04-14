# Password-Strength-Checker
Password Strength checker by using HTML, CSS, JS

Enhancements added (feature branch):

- Modern UI with glassmorphism and smooth animations (`styles.css`).
- Password strength meter with color indicators and real-time feedback (`script.js`).
- Show/hide password toggle button.
- Strong random password generator.
- Simulated breach detection for common passwords with a warning.
- Stores a salted SHA-256 hash of the entered password in `localStorage` (one-way) when you click Save.

Files:

- `index.html` — main UI
- `styles.css` — styles and animations
- `script.js` — logic for evaluation, generation, storage

How to run:

Open `index.html` in a browser (double-click or serve via a static server). Works offline.

Notes:

- The project intentionally uses only HTML/CSS/JS and keeps storage one-way by storing a hash with a random salt.
- This demo is for educational purposes. For production storage of passwords, always use server-side best practices and never store raw passwords in localStorage.

