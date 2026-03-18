// Simple password strength checker and helpers
(function(){
  const pw = document.getElementById('password');
  const meterBar = document.getElementById('meter-bar');
  const strengthText = document.getElementById('strength-text');
  const rulesList = document.getElementById('rules');
  const toggle = document.getElementById('toggle');
  const generateBtn = document.getElementById('generate');
  const saveBtn = document.getElementById('save');
  const warning = document.getElementById('warning');

  const commonPasswords = new Set([
    '123456','password','123456789','12345678','12345','qwerty','abc123','password1','111111','1234567'
  ]);

  function scorePassword(s){
    let score = 0;
    if(!s) return 0;
    if(s.length >= 8) score += 1;
    if(/[a-z]/.test(s)) score += 1;
    if(/[A-Z]/.test(s)) score += 1;
    if(/[0-9]/.test(s)) score += 1;
    if(/[^A-Za-z0-9]/.test(s)) score += 1;
    // length bonus
    if(s.length >= 12) score += 1;
    return score; // 0..6
  }

  function updateUI(){
    const val = pw.value;
    const s = scorePassword(val);

    // meter width
    const pct = Math.min(100, Math.round((s/6)*100));
    meterBar.style.width = pct + '%';

    // color and text
    let label = 'Very weak';
    if(s <= 1){ meterBar.style.background = 'linear-gradient(90deg, var(--danger), var(--warning))'; label='Very weak' }
    else if(s <= 3){ meterBar.style.background = 'linear-gradient(90deg, var(--warning), var(--warning))'; label='Weak' }
    else if(s <= 4){ meterBar.style.background = 'linear-gradient(90deg, var(--warning), var(--success))'; label='Medium' }
    else { meterBar.style.background = 'linear-gradient(90deg, var(--success), #7ef5c7)'; label='Strong' }
    strengthText.textContent = label;

    // rule indicators
    const checks = {
      length: val.length >= 8,
      lower: /[a-z]/.test(val),
      upper: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      symbol: /[^A-Za-z0-9]/.test(val)
    };
    for(const li of rulesList.children){
      const r = li.dataset.rule;
      if(checks[r]) li.classList.add('ok'); else li.classList.remove('ok');
    }

    // breach/common password warning
    if(val && commonPasswords.has(val.toLowerCase())){
      warning.textContent = 'This password is commonly used and unsafe — choose a different one.';
    } else if(val && val.length > 0 && s <= 2){
      warning.textContent = 'Password is weak. Add length, uppercase and symbols.';
    } else {
      warning.textContent = '';
    }

    // live store raw into sessionStorage only for UX (but we won't persist raw in localStorage)
    sessionStorage.setItem('pw_preview', val ? '1' : '');
  }

  // show/hide toggle
  toggle.addEventListener('click', ()=>{
    const isPwd = pw.type === 'password';
    pw.type = isPwd ? 'text' : 'password';
    toggle.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
    toggle.classList.toggle('active');
    toggle.focus();
  });

  // real-time feedback
  pw.addEventListener('input', updateUI);
  pw.addEventListener('paste', ()=>setTimeout(updateUI,50));

  // password generator
  function generatePassword(length=16){
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>?';
    let out = '';
    const cryptoObj = window.crypto || window.msCrypto;
    const bytes = new Uint32Array(length);
    cryptoObj.getRandomValues(bytes);
    for(let i=0;i<length;i++){
      out += charset[bytes[i] % charset.length];
    }
    return out;
  }

  generateBtn.addEventListener('click', ()=>{
    const p = generatePassword(16);
    pw.value = p;
    updateUI();
    // highlight briefly
    pw.select();
  });

  // Store salted SHA-256 in localStorage
  async function savePassword(){
    const val = pw.value || '';
    if(!val){ alert('Enter or generate a password first'); return; }
    // add a simple random salt
    const salt = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const data = new Uint8Array(salt.length + enc.encode(val).length);
    data.set(salt, 0);
    data.set(enc.encode(val), salt.length);
    const hashBuf = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuf));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
    // store base64 salt + hash
    const saltB64 = btoa(String.fromCharCode(...salt));
    localStorage.setItem('pw_hash', JSON.stringify({salt: saltB64, hash: hashHex}));
    alert('Password hash saved to localStorage (one-way).');
  }

  saveBtn.addEventListener('click', savePassword);

  // initialize
  updateUI();
})();
