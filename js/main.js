(function () {
  "use strict";

  var NAV_BREAKPOINT = 1400;

  var body = document.body;
  var toggle = document.querySelector(".header__toggle");
  var nav = document.querySelector(".header__nav");
  var overlay = document.querySelector(".nav-overlay");
  var chromeElements = document.querySelectorAll("[data-site-chrome]");

  function setMenuOpen(isOpen) {
    if (!toggle || !nav || !overlay) return;

    toggle.classList.toggle("is-active", isOpen);
    nav.classList.toggle("is-open", isOpen);
    overlay.classList.toggle("is-visible", isOpen);
    body.classList.toggle("is-nav-open", isOpen);

    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    overlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
    nav.setAttribute("aria-hidden", window.innerWidth <= NAV_BREAKPOINT ? (isOpen ? "false" : "true") : "false");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function updateChromeHeight() {
    var total = 0;

    chromeElements.forEach(function (el) {
      total += el.getBoundingClientRect().height;
    });

    if (total > 0) {
      document.documentElement.style.setProperty("--site-chrome-height", total + "px");
    }
  }

  if (toggle && nav && overlay) {
    toggle.addEventListener("click", function () {
      var isOpen = !nav.classList.contains("is-open");
      setMenuOpen(isOpen);
    });

    overlay.addEventListener("click", closeMenu);

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > NAV_BREAKPOINT) {
        closeMenu();
      }
      updateChromeHeight();
    });

    if (window.innerWidth > NAV_BREAKPOINT) {
      nav.setAttribute("aria-hidden", "false");
    } else {
      nav.setAttribute("aria-hidden", "true");
    }
  }

  updateChromeHeight();
  window.addEventListener("load", updateChromeHeight);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateChromeHeight).catch(function () {});
  }

  if (typeof ResizeObserver !== "undefined" && chromeElements.length) {
    var observer = new ResizeObserver(function () {
      updateChromeHeight();
    });

    chromeElements.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
