const statusEl = document.getElementById("status");
const bookmarkletLink = document.getElementById("bookmarklet");
const copyButton = document.getElementById("copy");

function buildBookmarkletSource() {
  const bookmarklet = `
    (function () {
      var w = window;
      var d = document;
      var k = "__night_switch_enabled__";
      var s = "__night_switch_style__";
      var b = "__night_switch_button__";
      var t = "__night_switch_toast__";
      var u = w.location.hostname || "this site";
      var buttonLabel = "NS";
      var buttonTitle = "Night Switch is on. Click to turn it off.";

      function luminanceFromColor(value) {
        if (!value) return 255;
        var m = String(value).match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/i);
        if (!m) return 255;
        var r = Number(m[1]);
        var g = Number(m[2]);
        var b = Number(m[3]);
        var a = m[4] === undefined ? 1 : Number(m[4]);
        if (a === 0) return 255;
        return (r * 299 + g * 587 + b * 114) / 1000;
      }

      function pageBrightness() {
        var htmlBg = w.getComputedStyle(d.documentElement).backgroundColor;
        var bodyBg = d.body ? w.getComputedStyle(d.body).backgroundColor : "rgb(255, 255, 255)";
        return Math.min(luminanceFromColor(htmlBg), luminanceFromColor(bodyBg));
      }

      function visiblePageBrightness() {
        var samples = [];
        var body = d.body;
        var bodyChildren = body && body.children ? Array.prototype.slice.call(body.children) : [];
        var limit = Math.min(bodyChildren.length, 24);
        var viewportWidth = w.innerWidth || 0;
        var viewportHeight = w.innerHeight || 0;

        samples.push(pageBrightness());

        for (var i = 0; i < limit; i++) {
          var node = bodyChildren[i];
          if (!node || !node.getBoundingClientRect) continue;

          var rect = node.getBoundingClientRect();
          if (!rect || rect.width < 40 || rect.height < 40) continue;
          if (rect.right <= 0 || rect.bottom <= 0 || rect.left >= viewportWidth || rect.top >= viewportHeight) continue;

          var bg = w.getComputedStyle(node).backgroundColor;
          samples.push(luminanceFromColor(bg));
        }

        if (!samples.length) return 255;

        var total = 0;
        for (var j = 0; j < samples.length; j++) {
          total += samples[j];
        }
        return total / samples.length;
      }

      function modeForPage() {
        var luminance = visiblePageBrightness();
        if (luminance < 82) return "dark";
        if (luminance > 176) return "bright";
        return "mixed";
      }

      function ensureStyle() {
        var e = d.getElementById(s);
        if (e) return;

        var mode = modeForPage();
        e = d.createElement("style");
        e.id = s;
        if (mode === "dark") {
          e.textContent =
            "html{color-scheme:dark!important}" +
            "body{color-scheme:dark!important}" +
            "input,textarea,select,button{color-scheme:dark!important}";
        } else {
          e.textContent =
            "html{background:#0b0f14!important;color-scheme:dark!important}" +
            "body{background:#0b0f14!important;color:#e8edf7!important}" +
            "body *{background:transparent!important;background-image:none!important;border-color:rgba(255,255,255,.16)!important;color:inherit!important;box-shadow:none!important}" +
            "a{color:#8ab4f8!important}" +
            "img,video,picture,canvas,svg,iframe{filter:brightness(.92) contrast(.96) saturate(.95)!important}" +
            "input,textarea,select,button{color-scheme:dark!important;background-color:rgba(255,255,255,.04)!important;color:#e8edf7!important}" +
            "::selection{background:rgba(120,242,174,.28)!important;color:#fff!important}";
        }
        d.documentElement.appendChild(e);
      }

      function ensureButton() {
        var n = d.getElementById(b);
        if (n) return;

        n = d.createElement("button");
        n.id = b;
        n.textContent = buttonLabel + " On";
        n.title = buttonTitle;
        n.setAttribute("aria-label", buttonTitle);
        n.style.cssText =
          "position:fixed;z-index:2147483647;top:12px;right:12px;padding:8px 11px;border:1px solid rgba(120,242,174,.24);border-radius:999px;background:rgba(11,15,20,.8);color:#dfffea;font:600 11px/1.1 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 6px 16px rgba(0,0,0,.22);cursor:pointer;backdrop-filter:blur(8px);opacity:.82";
        n.onclick = toggle;
        d.body.appendChild(n);
      }

      function turnOn() {
        ensureStyle();
        ensureButton();
      }

      function turnOff() {
        var e = d.getElementById(s);
        var n = d.getElementById(b);
        if (e) e.remove();
        if (n) n.remove();
      }

      function toast(m) {
        var e = d.getElementById(t);
        if (!e) {
          e = d.createElement("div");
          e.id = t;
          e.style.cssText =
            "position:fixed;z-index:2147483647;left:50%;bottom:16px;transform:translateX(-50%);padding:7px 11px;border-radius:999px;background:rgba(11,15,20,.88);color:#eff3ff;font:600 11px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.08);opacity:.92";
          d.body.appendChild(e);
        }
        e.textContent = m;
        clearTimeout(e.__timer);
        e.__timer = setTimeout(function () {
          if (e) e.remove();
        }, 1600);
      }

      function toggle() {
        var enabled = w.localStorage.getItem(k) === "1";
        if (enabled) {
          w.localStorage.setItem(k, "0");
          turnOff();
          toast("Night Switch off for " + u);
        } else {
          w.localStorage.setItem(k, "1");
          turnOn();
          toast("Night Switch on for " + u);
        }
      }

      if (w.localStorage.getItem(k) === "1") {
        turnOn();
        toast("Night Switch on for " + u);
      } else {
        toggle();
      }
    })();
  `;

  return `javascript:${bookmarklet.replace(/\n\s*/g, "")}`;
}

function updateBookmarkletHref() {
  const source = buildBookmarkletSource();
  bookmarkletLink.href = source;
  bookmarkletLink.setAttribute("draggable", "true");
  bookmarkletLink.setAttribute("aria-label", "Drag this bookmarklet to your bookmarks bar");
  return source;
}

async function copyBookmarklet() {
  const source = updateBookmarkletHref();
  try {
    await navigator.clipboard.writeText(source);
    statusEl.textContent = "Bookmarklet code copied. You can paste it into a bookmark URL field.";
  } catch {
    statusEl.textContent = "Copy was blocked. You can still drag the green button to your bookmarks bar.";
  }
}

bookmarkletLink.addEventListener("click", (event) => {
  event.preventDefault();
  statusEl.textContent = "Drag this green button to your bookmarks bar, then click it on any site.";
});

copyButton.addEventListener("click", copyBookmarklet);

updateBookmarkletHref();
