/* ADRIFT_OS v420.69 :: Shared Retro System Utilities */
(function () {
    // 1. Seamless continuous news-reel ticker builder (gap-free at any screen width)
    function initNewsReels() {
        var tracks = document.querySelectorAll(".reel-track");
        tracks.forEach(function (track) {
            if (!track.dataset.reelHtml) {
                var firstCopy = track.querySelector(".reel-copy");
                if (!firstCopy) return;
                track.dataset.reelHtml = firstCopy.innerHTML;
            }

            var isComet = !!track.closest(".comet-reel");
            var pxPerSec = isComet ? 52 : 72;
            var viewport = track.parentElement;
            var viewWidth = Math.max(viewport ? viewport.clientWidth : window.innerWidth, window.innerWidth || 1280);

            // Measure one copy accurately
            track.textContent = "";
            var probe = document.createElement("span");
            probe.className = "reel-copy";
            probe.innerHTML = track.dataset.reelHtml;
            track.appendChild(probe);

            var unitWidth = Math.ceil(probe.getBoundingClientRect().width) || 600;
            var copiesPerGroup = Math.max(2, Math.ceil((viewWidth + unitWidth) / unitWidth));

            function buildGroup(isClone) {
                var grp = document.createElement("div");
                grp.className = "reel-group";
                if (isClone) grp.setAttribute("aria-hidden", "true");
                for (var i = 0; i < copiesPerGroup; i++) {
                    var sp = document.createElement("span");
                    sp.className = "reel-copy";
                    if (i > 0) sp.setAttribute("aria-hidden", "true");
                    sp.innerHTML = track.dataset.reelHtml;
                    grp.appendChild(sp);
                }
                return grp;
            }

            track.textContent = "";
            var groupA = buildGroup(false);
            var groupB = buildGroup(true);
            track.appendChild(groupA);
            track.appendChild(groupB);

            var groupWidth = unitWidth * copiesPerGroup;
            var duration = Math.max(10, groupWidth / pxPerSec);
            track.style.setProperty("--reel-duration", duration.toFixed(2) + "s");
        });
    }

    initNewsReels();
    var reelResizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(reelResizeTimer);
        reelResizeTimer = setTimeout(initNewsReels, 180);
    });

    // 2. CRT scanline preference (default ON for authentic VGA feel)
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

    // 3. Live UTC System Clock
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

    // 4. Keyboard hotkeys for C:\SYS\MENU.EXE when not typing in an input
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
