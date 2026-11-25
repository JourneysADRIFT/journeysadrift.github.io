/* ADRIFT_OS v420.69 :: Shared Retro System Utilities */
(function () {
    // 1. CRT scanline preference (default ON for authentic VGA feel)
    var crtKey = "adrift_crt_mode";
    var savedCrt = null;
    try { savedCrt = window.localStorage.getItem(crtKey); } catch (e) {}
    var crtEnabled = savedCrt !== "off";

    function applyCrt() {
        document.body.classList.toggle("crt-on", crtEnabled);
        var btn = document.getElementById("crt-toggle-btn");
        if (btn) {
            btn.textContent = crtEnabled ? "[CRT SCANLINES: ON]" : "[CRT SCANLINES: OFF]";
        }
    }

    applyCrt();

    var crtBtn = document.getElementById("crt-toggle-btn");
    if (crtBtn) {
        crtBtn.addEventListener("click", function () {
            crtEnabled = !crtEnabled;
            try { window.localStorage.setItem(crtKey, crtEnabled ? "on" : "off"); } catch (e) {}
            applyCrt();
        });
    }

    // 2. Live UTC System Clock
    var clockEl = document.getElementById("sys-utc-clock");
    if (clockEl) {
        function pad(n) { return n < 10 ? "0" + n : String(n); }
        function tick() {
            var d = new Date();
            clockEl.textContent =
                pad(d.getUTCHours()) + ":" +
                pad(d.getUTCMinutes()) + ":" +
                pad(d.getUTCSeconds()) + " UTC";
        }
        tick();
        setInterval(tick, 1000);
    }

    // 3. Keyboard hotkeys for C:\SYS\MENU.EXE when not typing in an input
    var hotkeys = {
        h: "index.html",
        a: "about.html",
        m: "manifesto.html",
        g: "oracle.html",
        c: "credits.html",
        p: "supporters.html",
        w: "wallpapers.html"
    };

    document.addEventListener("keydown", function (ev) {
        if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
        var tag = (ev.target && ev.target.tagName) ? ev.target.tagName.toLowerCase() : "";
        if (tag === "input" || tag === "textarea" || tag === "select" || (ev.target && ev.target.isContentEditable)) {
            return;
        }
        var dest = hotkeys[(ev.key || "").toLowerCase()];
        if (dest) {
            var cur = window.location.pathname.split("/").pop() || "index.html";
            if (cur !== dest) {
                window.location.href = dest;
            }
        }
    });
})();
