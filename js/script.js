// ============================================
// PORTFOLIO JAVASCRIPT
// Smooth UI, animations, network background,
// role slider, navigation, and scroll reveals
// ============================================

document.documentElement.classList.add("js-enabled");


// ============================================
// FOOTER YEAR
// ============================================

const yearElement = document.getElementById("year");




// ============================================
// MOBILE NAVIGATION
// ============================================

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu when a navigation link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.getElementById("nav");

function updateNavbar() {
  if (!navbar) return;

  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNavbar, {
  passive: true
});

updateNavbar();


// ============================================
// ACTIVE NAVIGATION LINK
// ============================================

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navigationLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");

        navigationLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isActive);
        });
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


// ============================================
// HERO PHOTO FALLBACK
// ============================================

const heroPhoto = document.querySelector(".hero-photo");
const heroInitials = document.querySelector(".hero-initials");

if (heroPhoto) {
  heroPhoto.addEventListener("error", () => {
    heroPhoto.style.display = "none";

    if (heroInitials) {
      heroInitials.style.display = "grid";
    }
  });
}


// ============================================
// NETWORK BACKGROUND ANIMATION
// ============================================


const canvas = document.getElementById("netCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let dpr = 1;

  let nodes = [];

  let animationFrame = null;
  let lastTime = 0;

  let mouse = {
    x: null,
    y: null,
    active: false
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


  // ==========================================
  // NETWORK SETTINGS
  // ==========================================

  const SETTINGS = {
    minNodes: 34,
    maxNodes: 76,

    // Connections
    maxLinkDistance: 145,
    maxLinksPerNode: 4,

    // Nodes
    nodeRadius: 2.8,

    // IMPORTANT:
    // This is the permanent base movement speed.
    baseSpeed: 0.16,

    // Prevent nodes from becoming too slow.
    minSpeed: 0.11,

    // Prevent excessive movement.
    maxSpeed: 0.36,

    // Gentle anti-clustering force.
    repulsionDistance: 65,
    repulsionStrength: 0.012,

    // Mouse interaction.
    mouseRadius: 150,
    mouseStrength: 0.025,

    // How strongly nodes return to their
    // natural movement speed.
    speedCorrection: 0.018
  };


  // ==========================================
  // RANDOM HELPER
  // ==========================================

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }


  // ==========================================
  // CREATE EVENLY DISTRIBUTED NODES
  // ==========================================

  function createNodes() {
    nodes = [];

    const area = width * height;

    let count = Math.round(area / 26000);

    count = Math.max(
      SETTINGS.minNodes,
      Math.min(
        SETTINGS.maxNodes,
        count
      )
    );


    /*
      Grid-based placement prevents the nodes
      from initially clustering together.
    */

    const columns = Math.ceil(
      Math.sqrt(count)
    );

    const rows = Math.ceil(
      count / columns
    );

    const cellWidth =
      width / columns;

    const cellHeight =
      height / rows;


    for (let row = 0; row < rows; row++) {
      for (
        let column = 0;
        column < columns;
        column++
      ) {
        if (nodes.length >= count) {
          break;
        }


        const paddingX =
          cellWidth * 0.18;

        const paddingY =
          cellHeight * 0.18;


        const x = random(
          column * cellWidth + paddingX,
          (column + 1) * cellWidth - paddingX
        );


        const y = random(
          row * cellHeight + paddingY,
          (row + 1) * cellHeight - paddingY
        );


        // Random movement direction
        const angle = random(
          0,
          Math.PI * 2
        );


        const speed = random(
          SETTINGS.minSpeed,
          SETTINGS.baseSpeed
        );


        nodes.push({
          x,
          y,

          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,

          radius: random(
            SETTINGS.nodeRadius * 0.8,
            SETTINGS.nodeRadius * 1.2
          ),

          phase: random(
            0,
            Math.PI * 2
          ),

          pulseSpeed: random(
            0.008,
            0.018
          )
        });
      }
    }
  }


  // ==========================================
  // RESIZE CANVAS
  // ==========================================

  function resizeCanvas() {
    dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    width = window.innerWidth;
    height = window.innerHeight;


    canvas.width =
      Math.floor(width * dpr);

    canvas.height =
      Math.floor(height * dpr);


    canvas.style.width =
      `${width}px`;

    canvas.style.height =
      `${height}px`;


    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    createNodes();

    // Redraw immediately after resize
    drawNetwork();
  }


  // ==========================================
  // MOUSE MOVEMENT
  // ==========================================

  window.addEventListener(
    "mousemove",
    (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    },
    { passive: true }
  );


  window.addEventListener(
    "mouseleave",
    () => {
      mouse.active = false;
    }
  );


  // ==========================================
  // LIMIT SPEED
  // ==========================================

  function limitSpeed(node) {
    const speed = Math.sqrt(
      node.vx * node.vx +
      node.vy * node.vy
    );


    if (speed === 0) {
      const angle = random(
        0,
        Math.PI * 2
      );

      node.vx =
        Math.cos(angle) *
        SETTINGS.baseSpeed;

      node.vy =
        Math.sin(angle) *
        SETTINGS.baseSpeed;

      return;
    }


    /*
      If a node becomes too slow,
      gently restore its speed.

      This is the key fix for the
      animation-stopping problem.
    */

    if (speed < SETTINGS.minSpeed) {
      const correction =
        (SETTINGS.minSpeed - speed) *
        SETTINGS.speedCorrection;

      node.vx +=
        (node.vx / speed) *
        correction;

      node.vy +=
        (node.vy / speed) *
        correction;
    }


    /*
      Prevent nodes from moving too fast.
    */

    const currentSpeed =
      Math.sqrt(
        node.vx * node.vx +
        node.vy * node.vy
      );


    if (
      currentSpeed >
      SETTINGS.maxSpeed
    ) {
      node.vx =
        (node.vx / currentSpeed) *
        SETTINGS.maxSpeed;

      node.vy =
        (node.vy / currentSpeed) *
        SETTINGS.maxSpeed;
    }
  }


  // ==========================================
  // UPDATE NODES
  // ==========================================

  function updateNodes(deltaTime) {

    /*
      Normalize movement to approximately
      60 FPS.

      This prevents the animation from
      becoming unusually slow or fast when
      the browser frame rate changes.
    */

    const frameScale =
      Math.min(
        deltaTime / 16.67,
        2
      );


    // ========================================
    // NODE-TO-NODE REPULSION
    // ========================================

    for (
      let i = 0;
      i < nodes.length;
      i++
    ) {
      const node = nodes[i];


      for (
        let j = i + 1;
        j < nodes.length;
        j++
      ) {
        const other = nodes[j];


        const dx =
          other.x - node.x;

        const dy =
          other.y - node.y;


        const distanceSquared =
          dx * dx +
          dy * dy;


        if (
          distanceSquared > 0 &&
          distanceSquared <
            SETTINGS.repulsionDistance *
            SETTINGS.repulsionDistance
        ) {

          const distance =
            Math.sqrt(
              distanceSquared
            );


          const force =
            (
              SETTINGS.repulsionDistance -
              distance
            ) /
            SETTINGS.repulsionDistance;


          const nx =
            dx / distance;

          const ny =
            dy / distance;


          /*
            Very gentle force.

            It prevents clustering without
            destroying the natural movement.
          */

          const push =
            force *
            SETTINGS.repulsionStrength *
            frameScale;


          node.vx -=
            nx * push;

          node.vy -=
            ny * push;


          other.vx +=
            nx * push;

          other.vy +=
            ny * push;
        }
      }
    }


    // ========================================
    // UPDATE EACH NODE
    // ========================================

    for (
      const node of nodes
    ) {

      // --------------------------------------
      // MOUSE INTERACTION
      // --------------------------------------

      if (
        mouse.active &&
        mouse.x !== null &&
        mouse.y !== null
      ) {

        const dx =
          node.x - mouse.x;

        const dy =
          node.y - mouse.y;


        const distanceSquared =
          dx * dx +
          dy * dy;


        if (
          distanceSquared > 0 &&
          distanceSquared <
            SETTINGS.mouseRadius *
            SETTINGS.mouseRadius
        ) {

          const distance =
            Math.sqrt(
              distanceSquared
            );


          const force =
            (
              SETTINGS.mouseRadius -
              distance
            ) /
            SETTINGS.mouseRadius;


          const nx =
            dx / distance;

          const ny =
            dy / distance;


          node.vx +=
            nx *
            force *
            SETTINGS.mouseStrength *
            frameScale;


          node.vy +=
            ny *
            force *
            SETTINGS.mouseStrength *
            frameScale;
        }
      }


      // --------------------------------------
      // KEEP MOVEMENT ALIVE
      // --------------------------------------

      limitSpeed(node);


      // --------------------------------------
      // MOVE NODE
      // --------------------------------------

      node.x +=
        node.vx *
        frameScale;

      node.y +=
        node.vy *
        frameScale;


      // --------------------------------------
      // WRAP AROUND SCREEN
      // --------------------------------------

      if (
        node.x < -25
      ) {
        node.x =
          width + 25;
      }


      if (
        node.x > width + 25
      ) {
        node.x = -25;
      }


      if (
        node.y < -25
      ) {
        node.y =
          height + 25;
      }


      if (
        node.y > height + 25
      ) {
        node.y = -25;
      }


      // --------------------------------------
      // NODE PULSE
      // --------------------------------------

      node.phase +=
        node.pulseSpeed *
        frameScale;
    }
  }


  // ==========================================
  // DRAW NETWORK
  // ==========================================

  function drawNetwork() {

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    // ========================================
    // DRAW CONNECTIONS
    // ========================================

    for (
      let i = 0;
      i < nodes.length;
      i++
    ) {

      const node =
        nodes[i];

      let linkCount = 0;


      for (
        let j = i + 1;
        j < nodes.length;
        j++
      ) {

        if (
          linkCount >=
          SETTINGS.maxLinksPerNode
        ) {
          break;
        }


        const other =
          nodes[j];


        const dx =
          other.x - node.x;

        const dy =
          other.y - node.y;


        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );


        if (
          distance <=
          SETTINGS.maxLinkDistance
        ) {

          const opacity =
            1 -
            distance /
              SETTINGS.maxLinkDistance;


          ctx.beginPath();

          ctx.moveTo(
            node.x,
            node.y
          );

          ctx.lineTo(
            other.x,
            other.y
          );


          ctx.strokeStyle =
            `rgba(47, 92, 255, ${
              opacity * 0.13
            })`;


          ctx.lineWidth = 1;

          ctx.stroke();


          linkCount++;
        }
      }
    }


    // ========================================
    // DRAW NODES
    // ========================================

    for (
      const node of nodes
    ) {

      const pulse =
        1 +
        Math.sin(
          node.phase
        ) *
        0.18;


      const radius =
        node.radius *
        pulse;


      // --------------------------------------
      // SOFT GLOW
      // --------------------------------------

      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        radius * 3.2,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        "rgba(20, 184, 166, 0.055)";


      ctx.fill();


      // --------------------------------------
      // MAIN NODE
      // --------------------------------------

      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        radius,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        "rgba(20, 184, 166, 0.55)";


      ctx.fill();
    }
  }


  // ==========================================
  // ANIMATION LOOP
  // ==========================================

  function animate(currentTime) {

    /*
      Stop duplicate animation loops.
      requestAnimationFrame automatically
      supplies the current timestamp.
    */

    if (
      prefersReducedMotion.matches
    ) {
      animationFrame = null;
      drawNetwork();
      return;
    }


    // First frame
    if (!lastTime) {
      lastTime = currentTime;
    }


    let deltaTime =
      currentTime - lastTime;


    /*
      Prevent a huge jump after the browser
      tab was inactive for a while.

      Example:
      User leaves tab for 30 minutes.
      We DON'T move the nodes thousands of
      pixels when they return.
    */

    deltaTime =
      Math.min(
        deltaTime,
        32
      );


    lastTime =
      currentTime;


    updateNodes(
      deltaTime
    );

    drawNetwork();


    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  // ==========================================
  // START ANIMATION
  // ==========================================

  function startAnimation() {

    if (
      prefersReducedMotion.matches
    ) {
      drawNetwork();
      return;
    }


    /*
      Don't accidentally create multiple
      requestAnimationFrame loops.
    */

    if (
      animationFrame !== null
    ) {
      return;
    }


    lastTime = 0;


    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  // ==========================================
  // STOP ANIMATION
  // ==========================================

  function stopAnimation() {

    if (
      animationFrame !== null
    ) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame = null;
    }

    lastTime = 0;
  }


  // ==========================================
  // INITIALIZE
  // ==========================================

  resizeCanvas();

  startAnimation();


  // ==========================================
  // RESIZE
  // ==========================================

  window.addEventListener(
    "resize",
    resizeCanvas,
    { passive: true }
  );


  // ==========================================
  // TAB VISIBILITY
  // ==========================================

  /*
    Browsers throttle animations heavily when
    a tab is in the background.

    When the user comes back to the website,
    explicitly restart the animation so it
    never remains in a stalled state.
  */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        stopAnimation();

      } else {

        startAnimation();
      }
    }
  );


  // ==========================================
  // REDUCED MOTION
  // ==========================================

  prefersReducedMotion.addEventListener(
    "change",
    () => {

      stopAnimation();


      if (
        prefersReducedMotion.matches
      ) {

        drawNetwork();

      } else {

        startAnimation();
      }
    }
  );
}


// ============================================
// HERO ROLE SLIDER
// ============================================

const roleSlider =
  document.getElementById("heroRoleSlider");

if (roleSlider) {
  const roles = Array.from(
    roleSlider.children
  );

  if (roles.length > 0) {
    /*
      Clone the first role and append it.

      This allows the slider to move upward
      continuously without an obvious jump.
    */

    const firstClone =
      roles[0].cloneNode(true);

    roleSlider.appendChild(firstClone);

    let currentIndex = 0;

    const roleHeight =
      roles[0].getBoundingClientRect().height;


    function moveRoleSlider() {
      currentIndex++;

      roleSlider.style.transform =
        `translateY(-${currentIndex * roleHeight}px)`;

      /*
        When the clone is reached, instantly reset
        to the original first item.

        Because the clone is visually identical,
        the reset looks seamless.
      */

      if (
        currentIndex === roles.length
      ) {
        setTimeout(() => {
          roleSlider.style.transition =
            "none";

          currentIndex = 0;

          roleSlider.style.transform =
            "translateY(0)";

          // Force browser reflow
          roleSlider.offsetHeight;

          roleSlider.style.transition =
            "";
        }, 650);
      }
    }


    // Every 4 seconds
    setInterval(
      moveRoleSlider,
      4000
    );


    // Recalculate height on resize
    window.addEventListener(
      "resize",
      () => {
        const newHeight =
          roles[0].getBoundingClientRect()
            .height;

        roleSlider.style.transform =
          `translateY(-${currentIndex * newHeight}px)`;
      }
    );
  }
}


// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

const revealElements = document.querySelectorAll(
  ".about-copy, " +
  ".about-panel, " +
  ".skill-group, " +
  ".project, " +
  ".achieve-card, " +
  ".contact-method"
);

if (revealElements.length) {
  revealElements.forEach(
    (element, index) => {
      element.classList.add("reveal");

      /*
        Alternate reveal direction slightly
        for a more polished layout.
      */

      if (index % 3 === 1) {
        element.classList.add(
          "reveal-left"
        );
      } else if (index % 3 === 2) {
        element.classList.add(
          "reveal-right"
        );
      }
    }
  );


  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
      }
    );


  revealElements.forEach(
    (element) => {
      revealObserver.observe(element);
    }
  );
}

// ============================================
// STAGGERED CHIP / ACHIEVEMENT ANIMATIONS
// ============================================

const chipItems = document.querySelectorAll(".chips li");
const achievementCards =
  document.querySelectorAll(".achieve-card");


// --------------------------------------------
// SKILL CHIPS
// --------------------------------------------

chipItems.forEach((item, index) => {
  item.classList.add("stagger-item");

  item.style.setProperty(
    "--delay",
    `${index * 45}ms`
  );
});


// --------------------------------------------
// ACHIEVEMENT CARDS
// --------------------------------------------

achievementCards.forEach((card, index) => {
  card.classList.add("stagger-item");

  card.style.setProperty(
    "--delay",
    `${index * 100}ms`
  );
});


// --------------------------------------------
// STAGGER OBSERVER
// --------------------------------------------

const staggerElements = [
  ...chipItems,
  ...achievementCards
];


if (staggerElements.length) {
  const staggerObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -30px 0px"
    }
  );


  staggerElements.forEach((element) => {
    staggerObserver.observe(element);
  });
}

// ============================================
// SMOOTH ANCHOR SCROLL
// ============================================

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        const navHeight =
          navbar
            ? navbar.offsetHeight
            : 0;

        const targetPosition =
          target.getBoundingClientRect()
            .top +
          window.scrollY -
          navHeight -
          18;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    );
  });


// ============================================
// BUTTON / CARD MICRO-INTERACTION
// ============================================

const interactiveElements =
  document.querySelectorAll(
    ".btn, .project, .skill-group, .achieve-card, .contact-method"
  );

interactiveElements.forEach(
  (element) => {
    element.addEventListener(
      "pointermove",
      (event) => {
        /*
          Small mouse-position variables can be
          used by CSS for subtle hover effects.
        */

        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        element.style.setProperty(
          "--mouse-x",
          `${x}px`
        );

        element.style.setProperty(
          "--mouse-y",
          `${y}px`
        );
      }
    );
  }
);


// ============================================
// PAGE LOAD
// ============================================

window.addEventListener(
  "load",
  () => {
    document.body.classList.add(
      "page-loaded"
    );
  }
);