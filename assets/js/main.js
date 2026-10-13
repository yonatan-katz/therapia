/* ============================================================
   Hanna Katz, RCC — behaviour
   ============================================================ */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  /* ---- Year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- External links from config ---- */
  if (cfg.linkedinUrl) {
    ["linkedinLink", "linkedinLinkFooter"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = cfg.linkedinUrl;
    });
  }
  if (cfg.contactEmail) {
    var row = document.getElementById("contactEmailRow");
    var link = document.getElementById("contactEmailLink");
    if (row && link) {
      link.href = "mailto:" + cfg.contactEmail;
      row.hidden = false;
    }
  }

  /* ---- Book-online buttons ---- */
  var bookBtns = document.querySelectorAll("[data-book]");
  bookBtns.forEach(function (btn) {
    if (cfg.janeBookingUrl) {
      btn.href = cfg.janeBookingUrl;
      btn.target = "_blank";
      btn.rel = "noopener";
    } else {
      // No Jane URL yet → send people to the contact form with a gentle note.
      btn.href = "#contact";
      btn.addEventListener("click", function () {
        var status = document.getElementById("formStatus");
        if (status) {
          status.textContent = "Online booking is opening soon — send a message below and Hanna will be in touch.";
          status.className = "form-status is-ok";
        }
      });
    }
  });

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  }

  /* ---- Nav shadow on scroll ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Intro video ---- */
  var video = document.getElementById("introVideo");
  var playBtn = document.getElementById("videoPlay");
  var card = video ? video.closest(".video-card") : null;
  if (video && playBtn && card) {
    playBtn.addEventListener("click", function () {
      video.play();
    });
    video.addEventListener("play", function () { card.classList.add("is-playing"); });
    video.addEventListener("pause", function () { card.classList.remove("is-playing"); });
    video.addEventListener("ended", function () { card.classList.remove("is-playing"); });
  }

  /* ---- Scroll reveal ---- */
  var revealTargets = document.querySelectorAll(
    ".section__head, .card, .step, .cred-list li, .chips, .hero__copy, .hero__art, .about__media, .about__copy, .contact__form, .faq details"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Contact form ---- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        preferred_language: form.preferred_language.value,
        message: form.message.value.trim(),
      };

      // Option A: Formspree (or compatible) endpoint
      if (cfg.formEndpoint) {
        submitBtn.disabled = true;
        status.textContent = "Sending…";
        status.className = "form-status";
        fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then(function (res) {
            if (res.ok) {
              form.reset();
              status.textContent = "Thank you — your message has been sent. Hanna will be in touch soon.";
              status.className = "form-status is-ok";
            } else {
              throw new Error("bad status");
            }
          })
          .catch(function () {
            status.textContent = "Something went wrong sending the form. Please try again, or email directly.";
            status.className = "form-status is-err";
          })
          .finally(function () { submitBtn.disabled = false; });
        return;
      }

      // Option B: mailto fallback
      if (cfg.contactEmail) {
        var subject = encodeURIComponent("Counselling enquiry from " + data.name);
        var body = encodeURIComponent(
          "Name: " + data.name + "\n" +
          "Email: " + data.email + "\n" +
          "Preferred language: " + data.preferred_language + "\n\n" +
          data.message
        );
        window.location.href = "mailto:" + cfg.contactEmail + "?subject=" + subject + "&body=" + body;
        status.textContent = "Opening your email app…";
        status.className = "form-status is-ok";
        return;
      }

      // Option C: nothing configured yet
      status.textContent = "This form isn’t connected yet. Please reach out via LinkedIn for now.";
      status.className = "form-status is-err";
    });
  }
})();
