/* EmbedChat — drop-in AI chat widget.
 *
 * Usage on any website:
 *   <script
 *     src="https://YOUR-DEPLOY.vercel.app/widget.js"
 *     data-endpoint="https://YOUR-DEPLOY.vercel.app/api/widget-chat"
 *     data-site="https://the-site-to-answer-about.com"
 *     data-title="Ask us anything"
 *     data-accent="#2e6b4e"
 *     defer></script>
 */
(function () {
  var script = document.currentScript;
  if (!script) return;

  var ENDPOINT = script.dataset.endpoint;
  var SITE = script.dataset.site || window.location.origin;
  var TITLE = script.dataset.title || "Ask us anything";
  var ACCENT = script.dataset.accent || "#2e6b4e";
  if (!ENDPOINT) {
    console.error("[EmbedChat] data-endpoint is required.");
    return;
  }

  var history = [];
  var open = false;
  var busy = false;

  /* ---------- styles ---------- */
  var css =
    ".ec-btn{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;border:none;" +
    "background:" + ACCENT + ";color:#fff;font-size:24px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);z-index:99998}" +
    ".ec-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}" +
    ".ec-panel{position:fixed;bottom:88px;right:20px;width:340px;max-width:calc(100vw - 32px);height:460px;max-height:70vh;" +
    "background:#fff;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.28);display:none;flex-direction:column;" +
    "overflow:hidden;z-index:99999;font-family:system-ui,sans-serif;font-size:14px;color:#1f2421}" +
    ".ec-panel.ec-open{display:flex}" +
    ".ec-head{background:" + ACCENT + ";color:#fff;padding:12px 16px;font-weight:600}" +
    ".ec-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
    ".ec-m{max-width:85%;padding:8px 12px;border-radius:10px;line-height:1.45;white-space:pre-wrap}" +
    ".ec-m-user{align-self:flex-end;background:" + ACCENT + ";color:#fff;border-bottom-right-radius:3px}" +
    ".ec-m-bot{align-self:flex-start;background:#f0efe9;border-bottom-left-radius:3px}" +
    ".ec-m-err{align-self:flex-start;background:#f6e8e5;color:#8c2f23}" +
    ".ec-form{display:flex;gap:8px;padding:10px;border-top:1px solid #e5e3da}" +
    ".ec-in{flex:1;border:1px solid #d9d6ca;border-radius:8px;padding:9px 12px;font:inherit}" +
    ".ec-send{border:none;border-radius:8px;background:" + ACCENT + ";color:#fff;padding:0 14px;font:inherit;cursor:pointer}" +
    ".ec-send:disabled{opacity:.5;cursor:not-allowed}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- DOM ---------- */
  var btn = document.createElement("button");
  btn.className = "ec-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.textContent = "💬";

  var panel = document.createElement("div");
  panel.className = "ec-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", TITLE);

  var head = document.createElement("div");
  head.className = "ec-head";
  head.textContent = TITLE;

  var msgs = document.createElement("div");
  msgs.className = "ec-msgs";

  var form = document.createElement("div");
  form.className = "ec-form";
  var input = document.createElement("input");
  input.className = "ec-in";
  input.placeholder = "Type a question…";
  input.setAttribute("aria-label", "Your question");
  var send = document.createElement("button");
  send.className = "ec-send";
  send.textContent = "Send";

  form.appendChild(input);
  form.appendChild(send);
  panel.appendChild(head);
  panel.appendChild(msgs);
  panel.appendChild(form);
  document.body.appendChild(btn);
  document.body.appendChild(panel);

  function addMsg(text, cls) {
    var m = document.createElement("div");
    m.className = "ec-m " + cls;
    m.textContent = text;
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    return m;
  }

  addMsg("Hi! Ask me anything about this site.", "ec-m-bot");

  btn.addEventListener("click", function () {
    open = !open;
    panel.classList.toggle("ec-open", open);
    btn.setAttribute("aria-label", open ? "Close chat" : "Open chat");
    if (open) input.focus();
  });

  function ask() {
    var q = input.value.trim();
    if (!q || busy) return;
    busy = true;
    send.disabled = true;
    input.value = "";
    addMsg(q, "ec-m-user");
    var thinking = addMsg("…", "ec-m-bot");

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, site: SITE, history: history.slice(-6) }),
    })
      .then(function (r) {
        return r.json().then(function (d) {
          if (!r.ok) throw new Error(d.error || "Request failed");
          return d;
        });
      })
      .then(function (d) {
        thinking.textContent = d.answer;
        history.push({ role: "user", content: q });
        history.push({ role: "assistant", content: d.answer });
      })
      .catch(function (e) {
        thinking.className = "ec-m ec-m-err";
        thinking.textContent = e.message || "Something went wrong.";
      })
      .finally(function () {
        busy = false;
        send.disabled = false;
        msgs.scrollTop = msgs.scrollHeight;
      });
  }

  send.addEventListener("click", ask);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") ask();
  });
})();
