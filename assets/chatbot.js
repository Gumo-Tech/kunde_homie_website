(function () {
  var WORKER_URL = 'https://homie-chatbot.gustavboye1994.workers.dev/chat';

  // Resolve the booking page relative to wherever this script itself was
  // loaded from, so the link works regardless of subfolder depth or domain
  // (GitHub Pages project subpath today, homie.nu root later).
  var scriptEl = document.currentScript;
  var SITE_ROOT = scriptEl ? scriptEl.src.replace(/assets\/chatbot\.js.*$/, '') : './';
  var BOOKING_URL = SITE_ROOT + 'booking-widget.html';

  var style = document.createElement('style');
  style.textContent = [
    '.hc-bubble{position:fixed;right:22px;bottom:22px;z-index:400;background:var(--blue,#2563EB);color:#fff;border:none;border-radius:999px;padding:0 20px;height:54px;display:flex;align-items:center;gap:9px;font-family:inherit;font-size:0.9rem;font-weight:700;cursor:pointer;box-shadow:0 12px 30px rgba(37,99,235,0.4);transition:transform 0.18s;}',
    '.hc-bubble:hover{transform:translateY(-2px);}',
    '.hc-bubble svg{width:20px;height:20px;flex-shrink:0;}',
    '.hc-panel{position:fixed;right:22px;bottom:88px;z-index:400;width:min(360px,calc(100vw - 32px));height:min(480px,calc(100vh - 140px));background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(23,32,45,0.25);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity 0.18s,transform 0.18s;}',
    '.hc-panel.hc-open{opacity:1;transform:translateY(0);pointer-events:auto;}',
    '.hc-head{background:var(--navy,#1B2B3A);color:#fff;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
    '.hc-head strong{font-size:0.92rem;}',
    '.hc-head span{font-size:0.72rem;color:rgba(255,255,255,0.65);display:block;margin-top:2px;}',
    '.hc-close{background:none;border:none;color:#fff;opacity:0.7;cursor:pointer;font-size:1.2rem;line-height:1;padding:4px;}',
    '.hc-close:hover{opacity:1;}',
    '.hc-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:var(--bg,#F8FAFC);}',
    '.hc-msg{max-width:85%;padding:9px 13px;border-radius:12px;font-size:0.85rem;line-height:1.55;}',
    '.hc-msg.user{align-self:flex-end;background:var(--blue,#2563EB);color:#fff;border-bottom-right-radius:4px;}',
    '.hc-msg.bot{align-self:flex-start;background:#fff;color:var(--text,#374557);border:1px solid var(--border,#E2E8F0);border-bottom-left-radius:4px;}',
    '.hc-msg.typing{color:var(--muted,#6B7A8D);font-style:italic;}',
    '.hc-form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--border,#E2E8F0);flex-shrink:0;background:#fff;}',
    '.hc-input{flex:1;border:1px solid var(--border,#E2E8F0);border-radius:10px;padding:9px 12px;font-size:0.85rem;font-family:inherit;resize:none;height:38px;}',
    '.hc-send{background:var(--blue,#2563EB);color:#fff;border:none;border-radius:10px;width:38px;height:38px;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
    '.hc-send:disabled{opacity:0.5;cursor:default;}',
    '.hc-link-btn{align-self:flex-start;display:inline-flex;align-items:center;gap:6px;background:var(--navy,#1B2B3A);color:#fff;border-radius:10px;padding:9px 14px;font-size:0.83rem;font-weight:700;text-decoration:none;}',
    '.hc-link-btn:hover{opacity:0.9;}',
    '@media (max-width:480px){.hc-bubble{right:14px;bottom:14px;padding:0 16px;height:48px;font-size:0.82rem;}.hc-panel{right:14px;left:14px;width:auto;bottom:76px;}}'
  ].join('');
  document.head.appendChild(style);

  var bubble = document.createElement('button');
  bubble.className = 'hc-bubble';
  bubble.type = 'button';
  bubble.setAttribute('aria-label', 'Spørg en Homie');
  bubble.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Spørg en Homie</span>';

  var panel = document.createElement('div');
  panel.className = 'hc-panel';
  panel.innerHTML =
    '<div class="hc-head"><div><strong>Spørg en Homie</strong><span>Svarer ud fra info på siden</span></div><button type="button" class="hc-close" aria-label="Luk">&times;</button></div>' +
    '<div class="hc-msgs" id="hcMsgs"></div>' +
    '<form class="hc-form" id="hcForm">' +
    '<textarea class="hc-input" id="hcInput" placeholder="Skriv dit spørgsmål…" rows="1"></textarea>' +
    '<button class="hc-send" type="submit" aria-label="Send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg></button>' +
    '</form>';

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector('#hcMsgs');
  var formEl = panel.querySelector('#hcForm');
  var inputEl = panel.querySelector('#hcInput');
  var sendBtn = panel.querySelector('.hc-send');
  var closeBtn = panel.querySelector('.hc-close');

  var history = [];
  var greeted = false;

  function addMsg(role, text) {
    var el = document.createElement('div');
    el.className = 'hc-msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }

  function addLinkMsg(url, label) {
    var a = document.createElement('a');
    a.className = 'hc-link-btn';
    a.href = url;
    a.textContent = label;
    msgsEl.appendChild(a);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return a;
  }

  function openPanel() {
    panel.classList.add('hc-open');
    if (!greeted) {
      greeted = true;
      addMsg('bot', 'Hej! Jeg er Homies chatbot. Spørg mig om ydelser, priser eller Nordisk Sildeben – jeg svarer ud fra info på siden.');
    }
    inputEl.focus();
  }

  bubble.addEventListener('click', function () {
    panel.classList.contains('hc-open') ? panel.classList.remove('hc-open') : openPanel();
  });
  closeBtn.addEventListener('click', function () {
    panel.classList.remove('hc-open');
  });

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = inputEl.value.trim();
    if (!text) return;

    addMsg('user', text);
    history.push({ role: 'user', content: text });
    inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.disabled = true;

    var typingEl = addMsg('bot', 'Skriver…');
    typingEl.classList.add('typing');

    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        typingEl.remove();
        var reply = data.reply || 'Beklager, noget gik galt. Ring på 70 40 42 56.';
        addMsg('bot', reply);
        history.push({ role: 'assistant', content: reply });
        if (data.action === 'booking') {
          if (Array.isArray(data.suggestedSlots) && data.suggestedSlots.length && data.postcode) {
            // One button per time the bot found — each opens the booking page with
            // that postcode and time already filled in, so nothing has to be retyped.
            data.suggestedSlots.forEach(function (slot) {
              var params = '?postcode=' + encodeURIComponent(data.postcode)
                + '&date=' + encodeURIComponent(slot.date)
                + '&time=' + encodeURIComponent(slot.time);
              addLinkMsg(BOOKING_URL + params, 'Book ' + slot.day + ' d. ' + slot.date + ' kl. ' + slot.time + ' →');
            });
          } else {
            addLinkMsg(BOOKING_URL, 'Gå til booking →');
          }
        }
      })
      .catch(function () {
        typingEl.remove();
        addMsg('bot', 'Kunne ikke få svar lige nu — ring endelig på 70 40 42 56.');
      })
      .finally(function () {
        inputEl.disabled = false;
        sendBtn.disabled = false;
        inputEl.focus();
      });
  });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formEl.requestSubmit();
    }
  });
})();
