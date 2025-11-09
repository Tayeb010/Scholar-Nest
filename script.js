// Reveal-on-scroll, counters, mobile nav, noise background + typing
(function () {
  const ready = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);

  ready(() => {
    console.log("AssignFinity script loaded"); // quick check in browser console

    // Reveal engine
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("is-in"));
    }

    // Counters
    const counters = Array.from(document.querySelectorAll(".num"));
    const startCounter = (el) => {
      const to = parseInt(el.dataset.count || "0", 10);
      let cur = 0;
      const step = Math.max(1, Math.round(to / 80));
      const tick = () => {
        cur += step;
        if (cur >= to) {
          el.textContent = to;
        } else {
          el.textContent = cur;
          requestAnimationFrame(tick);
        }
      };
      tick();
    };

    if ("IntersectionObserver" in window) {
      const io2 = new IntersectionObserver(
        (ents) => {
          ents.forEach((e) => {
            if (e.isIntersecting) {
              startCounter(e.target);
              io2.unobserve(e.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => io2.observe(el));
    } else {
      counters.forEach(startCounter);
    }

    // === Typing effect for hero title ===
    // expects:
    // <h1 class="hero-title">
    //   <span id="type-line-1"></span><br>
    //   <span id="type-line-2" class="stroke"></span>
    // </h1>
    const line1El = document.getElementById("type-line-1");
    const line2El = document.getElementById("type-line-2");

    if (line1El && line2El) {
      const text1 = "Assignment Assistance";
      const text2 = "You Can Trust";
      const speed = 70; // ms per character

      const typeText = (el, text, cb) => {
        el.textContent = "";
        el.classList.add("typing-caret");
        let i = 0;

        const step = () => {
          if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(step, speed);
          } else {
            el.classList.remove("typing-caret");
            if (typeof cb === "function") cb();
          }
        };

        step();
      };

      // Start typing when page loads
      typeText(line1El, text1, () => {
        typeText(line2El, text2);
      });
    } else {
      console.warn("Typing elements not found (check IDs type-line-1 / type-line-2).");
    }

    // Mobile nav
    const burger = document.querySelector(".hamburger");
    const links = document.querySelector(".nav-links");
    if (burger && links) {
      burger.addEventListener("click", () => {
        const shown = getComputedStyle(links).display !== "none";
        links.style.display = shown ? "none" : "flex";
      });
    }

    // Footer year
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // Noise canvas
    const canvas = document.getElementById("noise");
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", resize);
      resize();

      (function render() {
        const { width: w, height: h } = canvas;
        const img = ctx.createImageData(w, h);
        const data = img.data;

        for (let i = 0; i < data.length; i += 4) {
          const n = (Math.random() * 255) | 0;
          data[i] = data[i + 1] = data[i + 2] = n;
          data[i + 3] = 18; // subtle grain
        }

        ctx.putImageData(img, 0, 0);
        requestAnimationFrame(render);
      })();
    }
  });
})();
