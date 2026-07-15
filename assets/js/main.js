(function () {
  "use strict";

  /* ---------- header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("mainNav");
  hamburger.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mainNav.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- theme toggle (dark mode) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const savedTheme = window.__theme || null;
  let currentTheme = savedTheme || "light";
  const applyTheme = (t) => {
    currentTheme = t;
    if (t === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-pressed", "false");
    }
  };
  applyTheme(currentTheme);
  themeToggle.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });

  /* ---------- accessibility text-size toggle ---------- */
  const a11yToggle = document.getElementById("a11yToggle");
  let largeText = false;
  a11yToggle.addEventListener("click", () => {
    largeText = !largeText;
    root.style.setProperty("--text-scale", largeText ? "1.15" : "1");
    a11yToggle.setAttribute("aria-pressed", String(largeText));
  });

  /* ---------- animated counters on scroll ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- reveal-on-scroll for cards ---------- */
  const revealTargets = document.querySelectorAll(
    ".dept-card, .journal-card, .doctor-card"
  );
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity .6s ease, transform .6s ease";
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    revealObserver.observe(el);
  });

  /* ---------- interactive body map ---------- */
  const deptInfo = {
    cardiology: {
      name: "Cardiology & Vascular",
      desc: "Chest pain, palpitations, blood pressure concerns, and long-term heart care, from first ECG to full recovery.",
    },
    neuro: {
      name: "Neurology",
      desc: "Headaches, migraines, dizziness, and long-term care for stroke recovery and nerve conditions.",
    },
    orthopedics: {
      name: "Orthopedics",
      desc: "Shoulder, arm, and joint pain — sports injuries, fractures, and post-surgical rehab.",
    },
    "ortho-leg": {
      name: "Orthopedics — Lower Body",
      desc: "Hip, knee, and leg pain, from sprains to joint replacement recovery.",
    },
    gastro: {
      name: "Gastroenterology",
      desc: "Digestive discomfort, reflux, and abdominal concerns — from routine screening to surgery.",
    },
  };

  const bmParts = document.querySelectorAll(".bm-part");
  const bmName = document.getElementById("bmDeptName");
  const bmDesc = document.getElementById("bmDeptDesc");

  const setActiveDept = (key) => {
    const info = deptInfo[key];
    if (!info) return;
    bmName.textContent = info.name;
    bmDesc.textContent = info.desc;
    bmParts.forEach((p) =>
      p.classList.toggle("is-active", p.getAttribute("data-dept") === key)
    );
    document.querySelectorAll("[data-dept-card]").forEach((card) => {
      card.style.borderColor =
        card.getAttribute("data-dept-card") === key ? "var(--coral)" : "";
    });
  };

  bmParts.forEach((part) => {
    part.addEventListener("click", () => setActiveDept(part.getAttribute("data-dept")));
    part.addEventListener("mouseenter", () => setActiveDept(part.getAttribute("data-dept")));
  });

  document.querySelectorAll("[data-dept-card]").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-dept-card");
      if (deptInfo[key]) setActiveDept(key);
      document.querySelector(".body-map").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* ---------- doctor carousel ---------- */
  const track = document.getElementById("doctorTrack");
  const prevBtn = document.getElementById("docPrev");
  const nextBtn = document.getElementById("docNext");
  let docIndex = 0;

  const getCardStep = () => {
    const card = track.querySelector(".doctor-card");
    if (!card) return 280;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "22");
    return card.getBoundingClientRect().width + gap;
  };

  const updateCarousel = () => {
    const step = getCardStep();
    track.style.transform = `translateX(-${docIndex * step}px)`;
  };

  const maxIndex = () => {
    const visible = Math.floor(track.parentElement.clientWidth / getCardStep());
    return Math.max(track.children.length - visible, 0);
  };

  nextBtn.addEventListener("click", () => {
    docIndex = Math.min(docIndex + 1, maxIndex());
    updateCarousel();
  });
  prevBtn.addEventListener("click", () => {
    docIndex = Math.max(docIndex - 1, 0);
    updateCarousel();
  });
  window.addEventListener("resize", updateCarousel);

  /* ---------- testimonial rotator ---------- */
  const slides = document.querySelectorAll(".story-slide");
  const dotsWrap = document.getElementById("storyDots");
  let storyIndex = 0;
  let storyTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goToStory(i));
    dotsWrap.appendChild(dot);
  });

  function goToStory(i) {
    slides[storyIndex].classList.remove("is-active");
    dotsWrap.children[storyIndex].classList.remove("is-active");
    storyIndex = i;
    slides[storyIndex].classList.add("is-active");
    dotsWrap.children[storyIndex].classList.add("is-active");
    resetStoryTimer();
  }

  function resetStoryTimer() {
    clearInterval(storyTimer);
    storyTimer = setInterval(() => {
      goToStory((storyIndex + 1) % slides.length);
    }, 5500);
  }
  resetStoryTimer();

  /* ---------- multi-step appointment form ---------- */
  const form = document.getElementById("bookForm");
  const steps = Array.from(form.querySelectorAll("[data-step-panel]"));
  const dots = Array.from(form.querySelectorAll(".step-dot"));
  const successPanel = document.getElementById("bookSuccess");
  let currentStep = 1;

  const showStep = (n) => {
    steps.forEach((panel) => {
      panel.classList.toggle("is-active", Number(panel.dataset.stepPanel) === n);
    });
    dots.forEach((dot) => {
      const dn = Number(dot.dataset.step);
      dot.classList.toggle("is-active", dn === n);
      dot.classList.toggle("is-done", dn < n);
    });
    currentStep = n;
  };

  const validateStep = (panel) => {
    let valid = true;
    const fields = panel.querySelectorAll("input[required], select[required]");
    fields.forEach((field) => {
      const errorEl = field.parentElement.querySelector(".field-error");
      let msg = "";
      if (!field.value.trim()) {
        msg = "This field is required.";
      } else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
        msg = "Enter a valid email address.";
      } else if (field.type === "tel" && field.value.replace(/\D/g, "").length < 7) {
        msg = "Enter a valid phone number.";
      }
      field.classList.toggle("is-invalid", !!msg);
      if (errorEl) errorEl.textContent = msg;
      if (msg) valid = false;
    });
    return valid;
  };

  form.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = steps[currentStep - 1];
      if (validateStep(panel)) showStep(currentStep + 1);
    });
  });
  form.querySelectorAll("[data-prev]").forEach((btn) => {
    btn.addEventListener("click", () => showStep(currentStep - 1));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lastPanel = steps[steps.length - 1];
    if (!validateStep(lastPanel)) return;

    const data = new FormData(form);
    const name = data.get("fullName") || "there";
    const dept = data.get("department") || "your selected department";
    document.getElementById(
      "bookSuccessDetail"
    ).textContent = `Thanks, ${name}. Your visit to ${dept} is being confirmed — a message is on its way to your email.`;

    form.classList.add("is-success");
    successPanel.classList.add("is-active");
  });

  document.getElementById("bookAnother").addEventListener("click", () => {
    form.reset();
    form.classList.remove("is-success");
    successPanel.classList.remove("is-active");
    form.querySelectorAll(".is-invalid").forEach((f) => f.classList.remove("is-invalid"));
    form.querySelectorAll(".field-error").forEach((f) => (f.textContent = ""));
    showStep(1);
  });

  /* ---------- newsletter form (demo only) ---------- */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterNote = document.getElementById("newsletterNote");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterNote.textContent = "Subscribed. Welcome to the journal.";
    newsletterForm.reset();
  });

  /* ---------- set min date on booking date field to today ---------- */
  const dateField = form.querySelector('input[name="date"]');
  if (dateField) {
    const today = new Date().toISOString().split("T")[0];
    dateField.setAttribute("min", today);
  }

  /* ---------- real-time hospital clock ---------- */
  const clockDate = document.getElementById("liveClockDate");
  const clockTime = document.getElementById("liveClockTime");
  const clockStatus = document.getElementById("liveClockStatus");

  const OPD_OPEN_HOUR = 7;   // 7am
  const OPD_CLOSE_HOUR = 20; // 8pm

  const tickClock = () => {
    const now = new Date();
    clockDate.textContent = now.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    clockTime.textContent = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const hour = now.getHours();
    const opdOpen = hour >= OPD_OPEN_HOUR && hour < OPD_CLOSE_HOUR;
    clockStatus.textContent = opdOpen ? "OPD Open" : "OPD Closed \u00B7 ER Open 24/7";
    clockStatus.classList.toggle("is-closed", !opdOpen);
  };
  if (clockDate && clockTime && clockStatus) {
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* ---------- interactive floor directory ---------- */
  const floorInfo = {
    5: {
      name: "Administration & Records",
      facilities: ["Patient records & billing", "HR & hospital administration", "Conference & training rooms"],
      hours: "Open Mon\u2013Sat, 9am\u20136pm",
    },
    4: {
      name: "Maternity & NICU",
      facilities: ["Labour & delivery suites", "NICU & postnatal care", "Lactation support room"],
      hours: "Visiting hours: 10am\u20138pm daily",
    },
    3: {
      name: "Orthopedics & Physiotherapy",
      facilities: ["Joint & fracture clinic", "Physiotherapy & rehab gym", "X-ray & imaging"],
      hours: "Open Mon\u2013Sat, 8am\u20137pm",
    },
    2: {
      name: "Cardiology & Neurology",
      facilities: ["ECG & echo lab", "Cath lab", "Neurology consult rooms"],
      hours: "Open Mon\u2013Sat, 8am\u20137pm",
    },
    1: {
      name: "Pediatrics & Gastroenterology",
      facilities: ["Pediatric OPD & play area", "Vaccination room", "Endoscopy suite"],
      hours: "Open Mon\u2013Sat, 8am\u20137pm",
    },
    0: {
      name: "Emergency, Reception & Pharmacy",
      facilities: ["Emergency & trauma bay", "Main reception & billing counter", "24-hour pharmacy"],
      hours: "Open 24 hours, every day",
    },
  };

  const floorRows = document.querySelectorAll(".floor-row");
  const floorPanelEyebrow = document.getElementById("floorPanelEyebrow");
  const floorPanelTitle = document.getElementById("floorPanelTitle");
  const floorPanelFacilities = document.getElementById("floorPanelFacilities");
  const floorPanelHours = document.getElementById("floorPanelHours");

  const showFloor = (key) => {
    const info = floorInfo[key];
    if (!info) return;
    const label = key === "0" ? "Ground floor" : "Floor " + key;
    floorPanelEyebrow.textContent = label;
    floorPanelTitle.textContent = info.name;
    floorPanelFacilities.innerHTML = info.facilities.map((f) => `<li>${f}</li>`).join("");
    floorPanelHours.textContent = info.hours;
    floorRows.forEach((row) => {
      const active = row.getAttribute("data-floor") === key;
      row.classList.toggle("is-active", active);
      row.setAttribute("aria-selected", String(active));
    });
  };

  floorRows.forEach((row) => {
    row.addEventListener("click", () => showFloor(row.getAttribute("data-floor")));
  });

  /* ---------- floating live status widget ---------- */
  const floatingStatus = document.getElementById("floatingStatus");
  const floatingStatusTitle = document.getElementById("floatingStatusTitle");
  const floatingStatusSub = document.getElementById("floatingStatusSub");
  const floatingStatusClose = document.getElementById("floatingStatusClose");

  if (floatingStatus) {
    let secondsAgo = 0;
    const refreshWait = () => {
      const wait = 6 + Math.floor(Math.random() * 9); // 6-14 min, feels "live"
      floatingStatusTitle.textContent = `ER wait time: ${wait} min`;
      secondsAgo = 0;
      floatingStatusSub.textContent = "Updated just now";
    };
    refreshWait();

    setInterval(() => {
      secondsAgo += 1;
      floatingStatusSub.textContent =
        secondsAgo < 60 ? `Updated ${secondsAgo}s ago` : "Updated a minute ago";
    }, 1000);

    setInterval(refreshWait, 25000);

    floatingStatusClose.addEventListener("click", () => {
      floatingStatus.classList.add("is-hidden");
    });
  }

  /* ---------- quote of the day (random on each page load) ---------- */
  const quotes = [
    { text: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
    { text: "The good physician treats the disease; the great physician treats the patient who has the disease.", author: "Sir William Osler" },
    { text: "Health is not valued until sickness comes.", author: "Thomas Fuller" },
    { text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" },
    { text: "Nothing so gladdens the human heart as compassion shown in a moment of need.", author: "Unknown" },
    { text: "Care, given well, is remembered longer than a diagnosis.", author: "Sneharaksha Hospital" },
    { text: "The best doctor gives the least medicine.", author: "Benjamin Franklin" },
    { text: "In every patient we are called to see something of ourselves.", author: "Unknown" },
  ];

  const qotdText = document.getElementById("qotdText");
  const qotdAuthor = document.getElementById("qotdAuthor");
  if (qotdText && qotdAuthor) {
    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    qotdText.textContent = `\u201C${pick.text}\u201D`;
    qotdAuthor.textContent = `\u2014 ${pick.author}`;
  }
})();
