const statusEl = document.getElementById("status");
const releaseTagEl = document.getElementById("release-tag");
const bookmarkletLink = document.getElementById("bookmarklet");
const resetBookmarkletLink = document.getElementById("reset-bookmarklet");
const toggleFingerprintEl = document.getElementById("toggle-fingerprint");
const resetFingerprintEl = document.getElementById("reset-fingerprint");
const copyButton = document.getElementById("copy");
const RELEASE_VERSION = "v1.2.0";

function buildBookmarkletSource(mode = "toggle") {
  const isReset = mode === "reset";
  const bookmarklet = `
    (function () {
      var w = window;
      var d = document;
      var k = "__night_switch_enabled__";
      var s = "__night_switch_style__";
      var b = "__night_switch_button__";
      var t = "__night_switch_toast__";
      var r = "__night_switch_root__";
      var u = w.location.hostname || "this site";
      var buttonLabel = "NS";
      var buttonTitle = "Night Switch is on. Click to turn it off.";
      var storageWarningShown = false;
      var styleWarningShown = false;
      var cspWatcherInstalled = false;

      function warnStorageBlocked() {
        if (storageWarningShown) return;
        storageWarningShown = true;
        toast("Night Switch can run here, but this browser blocked saved state.");
      }

      function warnStyleBlocked() {
        if (styleWarningShown) return;
        styleWarningShown = true;
        toast("Night Switch could not fully apply here because this site blocked part of the styling.");
      }

      function readSavedState() {
        try {
          return { ok: true, value: w.localStorage.getItem(k) };
        } catch (err) {
          return { ok: false, value: null };
        }
      }

      function writeSavedState(value) {
        try {
          w.localStorage.setItem(k, value);
          return true;
        } catch (err) {
          warnStorageBlocked();
          return false;
        }
      }

      function removeSavedState() {
        try {
          w.localStorage.removeItem(k);
          return true;
        } catch (err) {
          return false;
        }
      }

      function siteProfileForHost(host) {
        if (!host) return "";
        if (
          host === "docs.google.com" ||
          host === "drive.google.com" ||
          host === "mail.google.com" ||
          host === "calendar.google.com" ||
          host === "sheets.google.com" ||
          host === "slides.google.com" ||
          host === "github.com" ||
          host === "gist.github.com" ||
          host === "www.youtube.com" ||
          host === "studio.youtube.com" ||
          host === "notion.so" ||
          host.endsWith(".notion.site")
        ) {
          return "gentle";
        }
        return "";
      }

      function installSecurityPolicyWatcher() {
        if (cspWatcherInstalled || !d.addEventListener) return;
        cspWatcherInstalled = true;
        d.addEventListener(
          "securitypolicyviolation",
          function (event) {
            var directive = String(event.violatedDirective || event.effectiveDirective || "").toLowerCase();
            if (
              directive.indexOf("style-src") !== -1 ||
              directive.indexOf("style-src-elem") !== -1 ||
              directive.indexOf("style-src-attr") !== -1
            ) {
              warnStyleBlocked();
            }
          },
          true
        );
      }

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
        var profile = siteProfileForHost(u);
        if (profile) return profile;
        if (luminance > 176) return "bright";
        return "gentle";
      }

      function ensureStyle() {
        var e = d.getElementById(s);
        if (e) return;

        installSecurityPolicyWatcher();
        var mode = modeForPage();
        e = d.createElement("style");
        e.id = s;
        if (mode === "dark") {
          e.textContent =
            "html{color-scheme:dark!important}" +
            "body{color-scheme:dark!important}" +
            "input,textarea,select,button{color-scheme:dark!important}";
        } else if (mode === "gentle") {
          e.textContent =
            "html{background:#0b0f14!important;color-scheme:dark!important}" +
            "body{background:#0b0f14!important;color:#e8edf7!important}" +
            "a{color:#8ab4f8!important}" +
            "img,video,picture,canvas,svg,iframe{filter:brightness(.94) contrast(.98) saturate(.96)!important}" +
            "input,textarea,select,button{color-scheme:dark!important;background-color:rgba(255,255,255,.04)!important;color:#e8edf7!important}" +
            "::selection{background:rgba(120,242,174,.28)!important;color:#fff!important}";
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
        try {
          d.documentElement.appendChild(e);
        } catch (err) {
          warnStyleBlocked();
          return false;
        }
        return true;
      }

      function ensureUiRoot() {
        var host = d.getElementById(r);
        if (!host) {
          host = d.createElement("div");
          host.id = r;
          host.style.cssText =
            "all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647";
          (d.body || d.documentElement).appendChild(host);
        }

        if (host.shadowRoot) return host.shadowRoot;
        if (host.attachShadow) return host.attachShadow({ mode: "open" });
        return host;
      }

      function removeElement(id) {
        var el = d.getElementById(id);
        if (el) el.remove();
      }

      function ensureButton() {
        var root = ensureUiRoot();
        var n = root.querySelector ? root.querySelector("#" + b) : d.getElementById(b);
        if (n) return;

        n = d.createElement("button");
        n.id = b;
        n.type = "button";
        n.textContent = buttonLabel + " On";
        n.title = buttonTitle;
        n.setAttribute("aria-label", buttonTitle);
        n.style.cssText =
          "pointer-events:auto;position:fixed;top:12px;right:12px;padding:8px 11px;border:1px solid rgba(120,242,174,.24);border-radius:999px;background:rgba(11,15,20,.8);color:#dfffea;font:600 11px/1.1 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 6px 16px rgba(0,0,0,.22);cursor:pointer;backdrop-filter:blur(8px);opacity:.82";
        n.onclick = toggle;
        root.appendChild(n);
      }

      function turnOn() {
        var applied = ensureStyle();
        ensureButton();
        if (!applied) return;
      }

      function turnOff() {
        removeElement(s);
        removeElement(t);
        removeElement(b);
        removeElement(r);
      }

      function toast(m) {
        var root = ensureUiRoot();
        var e = root.querySelector ? root.querySelector("#" + t) : d.getElementById(t);
        if (!e) {
          e = d.createElement("div");
          e.id = t;
          e.style.cssText =
            "pointer-events:none;position:fixed;z-index:2147483647;left:50%;bottom:16px;transform:translateX(-50%);padding:7px 11px;border-radius:999px;background:rgba(11,15,20,.88);color:#eff3ff;font:600 11px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.08);opacity:.92";
          root.appendChild(e);
        }
        e.textContent = m;
        clearTimeout(e.__timer);
        e.__timer = setTimeout(function () {
          if (e) e.remove();
        }, 1600);
      }

      var savedState = readSavedState();
      var enabled = savedState.value === "1";

      function toggle() {
        enabled = !enabled;
        if (enabled) {
          writeSavedState("1");
          turnOn();
          if (!savedState.ok) warnStorageBlocked();
          toast("Night Switch on for " + u);
        } else {
          writeSavedState("0");
          turnOff();
          if (!savedState.ok) warnStorageBlocked();
          toast("Night Switch off for " + u);
        }
      }

      function resetNow() {
        removeSavedState();
        turnOff();
      }

      if (${isReset ? "true" : "false"}) {
        resetNow();
      } else if (enabled) {
        turnOn();
        toast("Night Switch on for " + u);
      } else {
        toggle();
      }
    })();
  `;

  return `javascript:${bookmarklet.replace(/\n\s*/g, "")}`;
}

function configureBookmarkletLink(link, source, label) {
  link.href = source;
  link.setAttribute("draggable", "true");
  link.setAttribute("aria-label", label);
  return source;
}

function fingerprintSource(source) {
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fp-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function updateBookmarkletHref() {
  return configureBookmarkletLink(
    bookmarkletLink,
    buildBookmarkletSource("toggle"),
    "Drag this bookmarklet to your bookmarks bar",
  );
}

function updateResetBookmarkletHref() {
  return configureBookmarkletLink(
    resetBookmarkletLink,
    buildBookmarkletSource("reset"),
    "Drag this reset bookmarklet to your bookmarks bar",
  );
}

function updateSourceMetadata() {
  const toggleSource = updateBookmarkletHref();
  const resetSource = updateResetBookmarkletHref();

  if (releaseTagEl) {
    releaseTagEl.textContent = `Release ${RELEASE_VERSION}`;
  }

  if (toggleFingerprintEl) {
    toggleFingerprintEl.textContent = `Toggle fingerprint: ${fingerprintSource(toggleSource)}`;
  }

  if (resetFingerprintEl) {
    resetFingerprintEl.textContent = `Reset fingerprint: ${fingerprintSource(resetSource)}`;
  }
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

resetBookmarkletLink.addEventListener("click", (event) => {
  event.preventDefault();
  statusEl.textContent = "Drag the gray reset button to your bookmarks bar if you need an escape hatch.";
});

copyButton.addEventListener("click", copyBookmarklet);

updateSourceMetadata();
