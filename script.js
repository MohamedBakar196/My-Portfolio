// AOS + Bootstrap tooltips + theme toggle + smooth scroll + back-to-top

function initAOS() {
  if (!window.AOS) return;
  AOS.init({
    duration: 650,
    once: true,
    offset: 80,
    easing: "ease-out-cubic",
  });
}

function initTooltips() {
  if (!window.bootstrap) return;
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
}

function getPreferredTheme() {
  const stored = (() => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  })();
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    const isDark = theme === "dark";
    btn.setAttribute("aria-pressed", String(isDark));
    btn.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i><span>Light</span>'
      : '<i class="fa-solid fa-moon"></i><span>Dark</span>';
  }
}

function setTheme(theme) {
  applyTheme(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
}

function initThemeToggle() {
  applyTheme(getPreferredTheme());
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initNavbarScrolled() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add("navbar-scrolled");
    else navbar.classList.remove("navbar-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initBackToTop() {
  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  const onScroll = () => {
    if (window.scrollY > 500) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function preventPlaceholderLinks() {
  document.querySelectorAll('a[data-placeholder="true"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}

// Simple contact form validation + Formspree/EmailJS hook
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = document.getElementById("contactStatus");

  // TODO: replace with your real endpoint (Formspree or custom API)
  // Example (Formspree): "https://formspree.io/f/xxxxxxx"
  const CONTACT_ENDPOINT = "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const messageInput = form.querySelector("#message");

    const setValidity = (input, condition) => {
      if (!condition) {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    };

    setValidity(nameInput, nameInput.value.trim().length >= 2);
    setValidity(
      emailInput,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
    );
    setValidity(messageInput, messageInput.value.trim().length >= 10);

    if (!isValid) {
      if (statusEl) {
        statusEl.textContent = "Please fix the highlighted fields.";
      }
      return;
    }

    if (!CONTACT_ENDPOINT) {
      if (statusEl) {
        statusEl.textContent =
          "Form is ready. Connect it by adding your Formspree / EmailJS endpoint in script.js.";
      }
      return;
    }

    if (statusEl) {
      statusEl.textContent = "Sending...";
    }

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        form.reset();
        if (statusEl) {
          statusEl.textContent = "Message sent successfully. Thank you!";
        }
      } else {
        if (statusEl) {
          statusEl.textContent =
            "Something went wrong. Please try again later or use email directly.";
        }
      }
    } catch {
      if (statusEl) {
        statusEl.textContent =
          "Network error. Please try again later or use email directly.";
      }
    }
  });
}

// Simple tracking for CV downloads (console only)
function initCvTracking() {
  const cvLinks = document.querySelectorAll(".cv-download");
  if (!cvLinks.length) return;

  cvLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Replace with real analytics/event tracking if needed
      // eslint-disable-next-line no-console
      console.log("CV downloaded");
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initTooltips();
  initThemeToggle();
  initSmoothScroll();
  initNavbarScrolled();
  initBackToTop();
  preventPlaceholderLinks();
  initContactForm();
  initCvTracking();
});

