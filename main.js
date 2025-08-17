document.addEventListener("DOMContentLoaded", () => {
  // Detect if running in in-app browser (Messenger, Zalo, etc.)
  function isInAppBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      userAgent.includes("fban") || // Facebook app
      userAgent.includes("fbav") || // Facebook app
      userAgent.includes("zalo") || // Zalo app
      userAgent.includes("messenger") || // Messenger
      userAgent.includes("instagram") || // Instagram
      userAgent.includes("line") || // LINE app
      userAgent.includes("micromessenger") || // WeChat
      (window.navigator.standalone === false &&
        /iphone|ipad|ipod/.test(userAgent)) // iOS in-app browser
    );
  }

  // Performance settings based on browser type
  const isInApp = isInAppBrowser();
  const performanceMode = isInApp ? "low" : "normal";

  console.log(
    `Running in ${
      isInApp ? "in-app" : "regular"
    } browser, using ${performanceMode} performance mode`
  );

  // Music handling
  const backgroundMusic = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  let isMusicPlaying = false;
  let hasTriedAutoplay = false;

  // Function to play music
  function playMusic() {
    if (backgroundMusic && !isMusicPlaying) {
      backgroundMusic.muted = false; // Unmute when playing
      backgroundMusic.volume = 0.3; // Set volume to 30%
      backgroundMusic
        .play()
        .then(() => {
          isMusicPlaying = true;
          musicToggle.textContent = "🔊";
          musicToggle.classList.remove("muted");
          console.log("Music started playing");
        })
        .catch((error) => {
          console.log("Autoplay prevented:", error);
          // If autoplay is blocked, show a message or handle it gracefully
          musicToggle.textContent = "🔇";
          musicToggle.classList.add("muted");
          isMusicPlaying = false;
        });
    }
  }

  // Function to toggle music
  function toggleMusic() {
    if (backgroundMusic) {
      if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        musicToggle.textContent = "🔇";
        musicToggle.classList.add("muted");
      } else {
        playMusic();
      }
    }
  }

  // Add click event to music toggle button
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the explosion effect
    toggleMusic();
  });

  // Aggressive autoplay attempts
  function attemptAutoplay() {
    if (!hasTriedAutoplay && !isMusicPlaying) {
      hasTriedAutoplay = true;
      playMusic();
    }
  }

  // Try multiple autoplay strategies
  setTimeout(attemptAutoplay, 100);
  setTimeout(attemptAutoplay, 500);
  setTimeout(attemptAutoplay, 1000);

  // Force trigger after 2 seconds if music hasn't started
  setTimeout(() => {
    if (!isMusicPlaying) {
      console.log("Force triggering music after 2 seconds");
      playMusic();
    }
  }, 2000);

  // Enhanced first user interaction handler
  let hasUserInteracted = false;
  function handleFirstInteraction() {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      console.log("First user interaction detected");
      // Force play music immediately on first interaction
      if (!isMusicPlaying) {
        playMusic();
      }
      // Remove event listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("mousemove", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
    }
  }

  // Add multiple event listeners for first user interaction
  document.addEventListener("click", handleFirstInteraction, { once: true });
  document.addEventListener("keydown", handleFirstInteraction, { once: true });
  document.addEventListener("touchstart", handleFirstInteraction, {
    once: true,
  });
  document.addEventListener("mousemove", handleFirstInteraction, {
    once: true,
  });
  document.addEventListener("scroll", handleFirstInteraction, { once: true });

  // Try to play when page becomes visible
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !isMusicPlaying) {
      playMusic();
    }
  });

  // Try to play when window gains focus
  window.addEventListener("focus", () => {
    if (!isMusicPlaying) {
      playMusic();
    }
  });

  /**
   * Hàm để lấy và giải mã các tham số từ URL
   * @param name - Tên tham số cần lấy (text, text1, text2, loopText, message, instructions, music)
   * @returns Giá trị của tham số sau khi giải mã hoặc giá trị gốc từ URL
   */
  function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);

    // Kiểm tra nếu có tham số c (encoded content)
    const encodedContent = urlParams.get("c");
    if (encodedContent) {
      try {
        // Giải mã base64 đã được URL-safe
        const base64 = encodedContent.replace(/-/g, "+").replace(/_/g, "/");
        const decodedString = decodeURIComponent(escape(atob(base64)));
        const content = JSON.parse(decodedString);

        // Kiểm tra và trả về giá trị tương ứng
        if (name === "text" && content.text) return content.text;
        if (name === "text1" && content.text1) return content.text1;
        if (name === "text2" && content.text2) return content.text2;
        if (name === "loopText" && content.loopText) return content.loopText;
        if (name === "message" && content.message) return content.message;
        if (name === "instructions" && content.instructions)
          return content.instructions;
        if (name === "music" && content.music) return content.music;
      } catch (e) {
        console.error("Lỗi khi giải mã Base64:", e);
      }
    }

    // Nếu không có tham số c hoặc có lỗi, vẫn sử dụng params thông thường
    return urlParams.get(name);
  }

  /**
   * Hàm lấy toàn bộ nội dung đã được mã hóa
   * @returns Object chứa toàn bộ nội dung đã giải mã hoặc null nếu có lỗi
   */
  function getEncodedContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedContent = urlParams.get("c");

    if (encodedContent) {
      try {
        const base64 = encodedContent.replace(/-/g, "+").replace(/_/g, "/");
        const decodedString = decodeURIComponent(escape(atob(base64)));
        return JSON.parse(decodedString);
      } catch (e) {
        console.error("Lỗi khi giải mã nội dung:", e);
        return null;
      }
    }

    return null;
  }

  // Lấy message từ URL parameters, fallback về text mặc định
  const message =
    getUrlParameter("message") ||
    getUrlParameter("text") ||
    getUrlParameter("loopText") ||
    "Phạm Thị Cẩm Vân";

    

  console.log("Message from URL:", message); // Debug log

  // Check if message is "custom" and replace with birthday message
  let finalMessage = message;
  if (message && message.toLowerCase() === "custom") {
    finalMessage = "Happy birthday to my sister🎂 Em yêu chị❤️";

    // Update background music for custom birthday message
    if (backgroundMusic) {
      backgroundMusic.src =
        "https://cdn.shopify.com/s/files/1/0757/9700/4572/files/Nhac-Chuong-At-My-Worst-Pink-Sweats.mp3?v=1748637095";
      backgroundMusic.load(); // Reload the audio with new source
      console.log("Background music updated for birthday message");
    }
  }

  console.log("Final message:", finalMessage); // Debug log

  // Update background music based on URL parameter
  const musicUrl = getUrlParameter("music");
  if (musicUrl && backgroundMusic) {
    // Decode the music URL if it's encoded
    let decodedMusicUrl;
    try {
      decodedMusicUrl = decodeURIComponent(musicUrl);
    } catch (e) {
      console.log("Music URL decode failed, using original:", e);
      decodedMusicUrl = musicUrl;
    }

    backgroundMusic.src = decodedMusicUrl;
    backgroundMusic.load(); // Reload the audio with new source
    console.log(
      "Background music updated from URL parameter:",
      decodedMusicUrl
    );
  }

  const fallingTextContainer = document.querySelector(
    ".falling-text-container"
  );
  const heartsContainer = document.querySelector(".hearts-container");

  // Color transition after 10 seconds with smooth effect
  setTimeout(() => {
    // Update color arrays for new falling text
    window.isAfterTransition = true;

    // Smooth background transition from pink to black
    document.body.style.transition = "background 3s ease-in-out";
    document.body.style.background = "#000000"; // Change to black

    // Update existing falling text colors with smooth transition to bright white
    const existingTexts = document.querySelectorAll(".falling-text");
    existingTexts.forEach((textElement) => {
      // Add smooth transition
      textElement.style.transition =
        "color 2s ease-in-out, text-shadow 2s ease-in-out, filter 2s ease-in-out, font-weight 2s ease-in-out";
      textElement.style.color = "#ffffff"; // Change to white
      textElement.style.textShadow = `
        0 0 15px rgba(255, 255, 255, 1),
        0 0 30px rgba(255, 255, 255, 0.8),
        0 0 45px rgba(255, 255, 255, 0.6),
        0 0 60px rgba(255, 255, 255, 0.4)
      `;
      textElement.style.filter = "brightness(1.6) contrast(1.8)";
      textElement.style.fontWeight = "900";
      textElement.style.webkitTextStroke = "0.5px rgba(255, 255, 255, 0.3)"; // Add text stroke
      textElement.style.fontFamily = "Dancing Script, cursive";
    });

    console.log(
      "Smooth transition from pink to black background with bright white neon text!"
    ); // Debug log
  }, 10000); // 10 seconds

  // Create falling text
  function createFallingText() {
    const textElement = document.createElement("div");
    textElement.classList.add("falling-text");
    textElement.textContent = finalMessage;

    // Random horizontal position - adjust for mobile to prevent overflow
    const isMobile = window.innerWidth <= 768;

    // Check if text is long and should wrap
    const isLongText = finalMessage.length > 30; // Text longer than 30 chars can wrap

    // Calculate positioning based on device
    let startX;
    let shouldHideText = false;

    if (isMobile) {
      // For mobile, use safe positioning with margins
      const safeMargin = window.innerWidth * 0.1; // 10% margin on each side
      const availableWidth = window.innerWidth - safeMargin * 2;
      startX = safeMargin + Math.random() * availableWidth;

      // Check if text would overflow screen boundaries
      if (isLongText) {
        // For long text, check if it would fit within screen bounds when wrapped
        const estimatedLines = Math.ceil(finalMessage.length / 25); // Rough estimate: 25 chars per line
        const lineHeight = 1.3; // Line height multiplier
        const fontSize = 1.4; // Average font size in rem
        const estimatedHeight = estimatedLines * fontSize * lineHeight * 16; // Convert rem to px

        // If text would be too tall or positioned too close to edges, hide it
        if (
          estimatedHeight > window.innerHeight * 0.3 ||
          startX < window.innerWidth * 0.15 ||
          startX > window.innerWidth * 0.85
        ) {
          shouldHideText = true;
        }
      }
    } else {
      // For desktop, use the better calculation
      const textMaxWidth = window.innerWidth * 0.9;
      const margin = (window.innerWidth - textMaxWidth) / 2;
      const availableWidth = window.innerWidth - margin * 2;
      startX = margin + Math.random() * availableWidth;
    }

    // If text should be hidden, don't create it
    if (shouldHideText) {
      return; // Exit early, don't create this text element
    }

    // Add long-text class if text is long
    if (isLongText) {
      textElement.classList.add("long-text");
    }

    // Optimized animation duration based on performance mode
    let duration;
    if (performanceMode === "low") {
      // Slower, simpler animations for in-app browsers
      duration = Math.random() * 2 + 6; // 6-8 seconds (even slower)
    } else {
      // Normal speed for regular browsers
      duration = Math.random() * 3 + 5; // 5-8 seconds
    }

    // Random colors for variety - changes after 10 seconds
    let colors;
    if (window.isAfterTransition) {
      // Only white colors after transition (on black background)
      colors = [
        "#ffffff", // Pure white
        "#ffffff", // Pure white
        "#ffffff", // Pure white
        "#ffffff", // Pure white
        "#ffffff", // Pure white
        "#ffffff", // Pure white (all white)
      ];
    } else {
      // White colors for pink background
      colors = [
        "#ffffff", // Pure white
        "#f8f8ff", // Ghost white
        "#fffafa", // Snow white
        "#ffffff", // Pure white
        "#f0f0f0", // Light gray
        "#ffffff", // Pure white (repeated for higher chance)
      ];
    }
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Smart font sizing
    let fontSize;
    if (isMobile) {
      if (isLongText) {
        // For long text, use smaller font size
        fontSize = Math.random() * 0.3 + 1.1; // 1.1-1.4rem for long text
      } else {
        // For normal text, use normal mobile font size
        fontSize = Math.random() * 0.4 + 1.2; // 1.2-1.6rem for normal text
      }
    } else {
      // Desktop: use normal random sizing
      fontSize = Math.random() * 1.5 + 1.8; // 1.8-3.3rem for desktop
    }

    // Random rotation - reduced for performance mode
    const rotation =
      performanceMode === "low"
        ? Math.random() * 10 - 5 // -5 to 5 degrees for in-app
        : Math.random() * 20 - 10; // -10 to 10 degrees for normal

    // Position the text element - always use translateX(-50%) for proper centering
    textElement.style.left = `${startX}px`;
    textElement.style.transform = `translateX(-50%) rotate(${rotation}deg)`;

    textElement.style.top = `-300px`; // Start higher to accommodate multi-line text
    textElement.style.color = color;
    textElement.style.fontSize = `${fontSize}rem`;
    textElement.style.animationDuration = `${duration}s`;

    // Force extra bold font weight for all text
    textElement.style.fontWeight = "900";
    textElement.style.fontFamily = "Dancing Script, cursive";

    // Add text stroke for extra boldness on black background
    if (window.isAfterTransition) {
      textElement.style.webkitTextStroke = "0.5px rgba(255, 255, 255, 0.3)";
    }

    // Set text display properties based on length
    if (isLongText) {
      // Allow wrapping for long text
      textElement.style.whiteSpace = "normal";
      textElement.style.wordWrap = "break-word";
      textElement.style.wordBreak = "break-word";
      textElement.style.maxWidth = isMobile ? "80vw" : "60vw";
      textElement.style.overflow = "hidden"; // Hide overflow
    } else {
      // Force single line for short text
      textElement.style.whiteSpace = "nowrap";
      textElement.style.overflow = "hidden";
      textElement.style.textOverflow = "ellipsis";
      textElement.style.maxWidth = isMobile ? "90vw" : "80vw";
    }

    // Optimized glow effects based on performance mode
    if (window.isAfterTransition) {
      if (performanceMode === "low") {
        // Simplified glow for better performance
        textElement.style.textShadow = `
          0 0 20px rgba(255, 255, 255, 1),
          0 0 40px rgba(255, 255, 255, 0.6),
          0 0 80px rgba(255, 255, 255, 0.3)
        `;
        textElement.style.filter = "brightness(2.0) contrast(2.0)";
      } else {
        // Full glow effect for regular browsers
        textElement.style.textShadow = `
          0 0 10px rgba(255, 255, 255, 1),
          0 0 20px rgba(255, 255, 255, 1),
          0 0 30px rgba(255, 255, 255, 0.9),
          0 0 40px rgba(255, 255, 255, 0.8),
          0 0 60px rgba(255, 255, 255, 0.6),
          0 0 80px rgba(255, 255, 255, 0.4),
          0 0 120px rgba(255, 255, 255, 0.3),
          0 0 160px rgba(255, 255, 255, 0.2),
          0 0 200px rgba(255, 255, 255, 0.1)
        `;
        textElement.style.filter =
          "brightness(3.5) contrast(4.0) saturate(1.2)";
      }

      textElement.style.fontWeight = "900";
      textElement.style.webkitTextStroke = "1px rgba(255, 255, 255, 0.8)";
      textElement.style.dropShadow = "0 0 20px rgba(255, 255, 255, 0.8)";

      // Simplified entrance effect for performance
      if (performanceMode === "low") {
        // No transition for in-app browsers
        textElement.style.opacity = "1";
      } else {
        // Smooth entrance effect for regular browsers
        textElement.style.transition = "opacity 0.5s ease-in-out";
        textElement.style.opacity = "0";
        setTimeout(() => {
          textElement.style.opacity = "1";
        }, 100);
      }
    }

    // Remove animation delay to prevent glitchy appearance
    textElement.style.animationDelay = `0s`;

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      fallingTextContainer.appendChild(textElement);
    });

    // Remove text after animation completes
    setTimeout(() => {
      if (textElement.parentNode) {
        textElement.remove();
      }
    }, (duration + 1) * 1000);
  }

  // Create explosion effect when clicking
  function createExplosion(x, y) {
    const isMobile = window.innerWidth <= 768;
    const numberOfTexts = isMobile ? 5 : 8; // Fewer texts on mobile

    for (let i = 0; i < numberOfTexts; i++) {
      const explosionText = document.createElement("div");
      explosionText.classList.add("explosion-text");
      explosionText.textContent = finalMessage;

      // Create bouncing up effect with slight horizontal spread
      const horizontalOffset = (Math.random() - 0.5) * (isMobile ? 100 : 200); // Less spread on mobile
      const bounceHeight =
        Math.random() * (isMobile ? 100 : 150) + (isMobile ? 80 : 100); // Lower bounce on mobile
      const delay = i * (isMobile ? 150 : 100); // Slower stagger on mobile

      // Random colors
      const colors = [
        "#ff526f",
        "#ff7a8a",
        "#ff9a9e",
        "#fecfef",
        "#ffb3ba",
        "#ffffff",
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Random size - responsive (adjusted for mobile)
      let fontSize;
      if (isMobile) {
        fontSize = Math.random() * 0.4 + 1.2; // 1.2-1.6rem for mobile (reduced further)
      } else {
        fontSize = Math.random() * 1.5 + 1.8; // 1.8-3.3rem for desktop
      }

      explosionText.style.position = "absolute";
      explosionText.style.left = `${x}px`;
      explosionText.style.top = `${y}px`;
      explosionText.style.color = color;
      explosionText.style.fontSize = `${fontSize}rem`;
      explosionText.style.fontWeight = "bold";
      explosionText.style.fontFamily = "Dancing Script, cursive";
      explosionText.style.textShadow =
        "0 0 15px rgba(255, 255, 255, 1), 0 2px 8px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 82, 111, 0.6)";
      explosionText.style.filter =
        "brightness(1.2) contrast(1.2) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))";
      explosionText.style.whiteSpace = "normal";
      explosionText.style.wordWrap = "break-word";
      explosionText.style.wordBreak = "break-word";
      explosionText.style.maxWidth = isMobile ? "80vw" : "60vw";
      explosionText.style.textAlign = "center";
      explosionText.style.pointerEvents = "none";
      explosionText.style.zIndex = "100";
      explosionText.style.transform = isMobile
        ? "translate(-50%, -50%) scale(0)"
        : "scale(0) translateY(0px)";
      explosionText.style.opacity = "0";
      explosionText.style.transformOrigin = "center bottom";

      fallingTextContainer.appendChild(explosionText);

      // Create bouncing animation with CSS keyframes
      const animationName = `bounce-${Date.now()}-${i}`;
      const keyframes = isMobile
        ? `
          @keyframes ${animationName} {
              0% {
                  transform: translate(-50%, -50%) scale(0) translateY(0px) translateX(0px);
                  opacity: 0;
              }
              20% {
                  transform: translate(-50%, -50%) scale(1.3) translateY(-${
                    bounceHeight * 0.8
                  }px) translateX(${horizontalOffset * 0.3}px);
                  opacity: 1;
              }
              40% {
                  transform: translate(-50%, -50%) scale(1.1) translateY(-${bounceHeight}px) translateX(${
            horizontalOffset * 0.6
          }px);
                  opacity: 1;
              }
              60% {
                  transform: translate(-50%, -50%) scale(1.2) translateY(-${
                    bounceHeight * 0.7
                  }px) translateX(${horizontalOffset * 0.8}px);
                  opacity: 1;
              }
              80% {
                  transform: translate(-50%, -50%) scale(1) translateY(-${
                    bounceHeight * 0.3
                  }px) translateX(${horizontalOffset}px);
                  opacity: 0.8;
              }
              100% {
                  transform: translate(-50%, -50%) scale(0.8) translateY(20px) translateX(${horizontalOffset}px);
                  opacity: 0;
              }
          }
      `
        : `
          @keyframes ${animationName} {
              0% {
                  transform: scale(0) translateY(0px) translateX(0px);
                  opacity: 0;
              }
              20% {
                  transform: scale(1.3) translateY(-${
                    bounceHeight * 0.8
                  }px) translateX(${horizontalOffset * 0.3}px);
                  opacity: 1;
              }
              40% {
                  transform: scale(1.1) translateY(-${bounceHeight}px) translateX(${
            horizontalOffset * 0.6
          }px);
                  opacity: 1;
              }
              60% {
                  transform: scale(1.2) translateY(-${
                    bounceHeight * 0.7
                  }px) translateX(${horizontalOffset * 0.8}px);
                  opacity: 1;
              }
              80% {
                  transform: scale(1) translateY(-${
                    bounceHeight * 0.3
                  }px) translateX(${horizontalOffset}px);
                  opacity: 0.8;
              }
              100% {
                  transform: scale(0.8) translateY(20px) translateX(${horizontalOffset}px);
                  opacity: 0;
              }
          }
      `;

      // Add keyframes to document
      const style = document.createElement("style");
      style.textContent = keyframes;
      document.head.appendChild(style);

      // Apply animation with delay
      setTimeout(() => {
        explosionText.style.animation = `${animationName} 2s ease-out forwards`;
      }, delay);

      // Remove element and style
      setTimeout(() => {
        if (explosionText.parentNode) {
          explosionText.remove();
        }
        if (style.parentNode) {
          style.remove();
        }
      }, 2500 + delay);
    }

    // Create heart bounce effect
    createHeartBounce(x, y);
  }

  // Create heart bounce effect
  function createHeartBounce(x, y) {
    const isMobile = window.innerWidth <= 768;
    const numberOfHearts = 6;

    for (let i = 0; i < numberOfHearts; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "💖";

      const horizontalOffset = (Math.random() - 0.5) * 150;
      const bounceHeight = Math.random() * 100 + 80;
      const delay = i * 150;

      heart.style.position = "absolute";
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = `${Math.random() * 20 + 25}px`;
      heart.style.zIndex = "99";
      heart.style.transform = isMobile
        ? "translate(-50%, -50%) scale(0)"
        : "scale(0)";
      heart.style.opacity = "0";
      heart.style.pointerEvents = "none";
      heart.style.textShadow =
        "0 0 10px rgba(255, 82, 111, 1), 0 0 20px rgba(255, 82, 111, 0.8), 0 0 40px rgba(255, 82, 111, 0.6), 0 2px 4px rgba(0, 0, 0, 0.7)";
      heart.style.filter =
        "brightness(1.3) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5))";

      fallingTextContainer.appendChild(heart);

      // Create heart bounce animation
      const heartAnimationName = `heartBounce-${Date.now()}-${i}`;
      const heartKeyframes = isMobile
        ? `
          @keyframes ${heartAnimationName} {
              0% {
                  transform: translate(-50%, -50%) scale(0) translateY(0px) translateX(0px);
                  opacity: 0;
              }
              30% {
                  transform: translate(-50%, -50%) scale(1.5) translateY(-${bounceHeight}px) translateX(${
            horizontalOffset * 0.5
          }px);
                  opacity: 1;
              }
              60% {
                  transform: translate(-50%, -50%) scale(1.2) translateY(-${
                    bounceHeight * 0.6
                  }px) translateX(${horizontalOffset * 0.8}px);
                  opacity: 1;
              }
              100% {
                  transform: translate(-50%, -50%) scale(0.5) translateY(10px) translateX(${horizontalOffset}px);
                  opacity: 0;
              }
          }
      `
        : `
          @keyframes ${heartAnimationName} {
              0% {
                  transform: scale(0) translateY(0px) translateX(0px);
                  opacity: 0;
              }
              30% {
                  transform: scale(1.5) translateY(-${bounceHeight}px) translateX(${
            horizontalOffset * 0.5
          }px);
                  opacity: 1;
              }
              60% {
                  transform: scale(1.2) translateY(-${
                    bounceHeight * 0.6
                  }px) translateX(${horizontalOffset * 0.8}px);
                  opacity: 1;
              }
              100% {
                  transform: scale(0.5) translateY(10px) translateX(${horizontalOffset}px);
                  opacity: 0;
              }
          }
      `;

      const heartStyle = document.createElement("style");
      heartStyle.textContent = heartKeyframes;
      document.head.appendChild(heartStyle);

      setTimeout(() => {
        heart.style.animation = `${heartAnimationName} 1.8s ease-out forwards`;
      }, delay);

      setTimeout(() => {
        if (heart.parentNode) {
          heart.remove();
        }
        if (heartStyle.parentNode) {
          heartStyle.remove();
        }
      }, 2300 + delay);
    }
  }

  // Add click event listener
  document.addEventListener("click", (e) => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: Use center position but keep explosion effect
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      createExplosion(centerX, centerY);
    } else {
      // Desktop: Keep original explosion at click position
      createExplosion(e.clientX, e.clientY);
    }
  });

  // Create random hearts
  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");

    // Random position
    const startPositionX = Math.random() * window.innerWidth;

    // Random size
    const size = Math.random() * 25 + 15;

    // Random animation duration
    const duration = Math.random() * 3 + 4;

    // Random colors for variety
    const colors = ["#ff526f", "#ff7a8a", "#ff9a9e", "#fecfef", "#ffb3ba"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${startPositionX}px`;
    heart.style.backgroundColor = color;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;

    heartsContainer.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
      if (heart.parentNode) {
        heart.remove();
      }
    }, (duration + 2) * 1000);
  }

  // Create sparkles
  function createSparkle() {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;

    heartsContainer.appendChild(sparkle);

    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.remove();
      }
    }, 2000);
  }

  // Create floating particles
  function createParticle() {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    const startPositionX = Math.random() * window.innerWidth;
    const duration = Math.random() * 2 + 3;

    particle.style.left = `${startPositionX}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 1}s`;

    heartsContainer.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, (duration + 1) * 1000);
  }

  // Create falling text continuously - OPTIMIZED FOR PERFORMANCE
  const isMobile = window.innerWidth <= 768;

  // Adjust intervals based on performance mode
  let textInterval, heartInterval, sparkleInterval, particleInterval;
  let initialTexts, initialHearts, initialSparkles, initialParticles;

  if (performanceMode === "low") {
    // Reduced frequency for in-app browsers
    textInterval = isMobile ? 1200 : 1000; // Much slower text creation
    heartInterval = isMobile ? 1500 : 1200; // Slower hearts
    sparkleInterval = isMobile ? 800 : 600; // Slower sparkles
    particleInterval = isMobile ? 1000 : 800; // Slower particles

    // Fewer initial elements
    initialTexts = isMobile ? 6 : 8; // Much fewer initial texts
    initialHearts = isMobile ? 8 : 12; // Fewer hearts
    initialSparkles = isMobile ? 15 : 20; // Fewer sparkles
    initialParticles = isMobile ? 12 : 16; // Fewer particles
  } else {
    // Normal frequency for regular browsers
    textInterval = isMobile ? 500 : 400; // Original frequency
    heartInterval = isMobile ? 600 : 500; // Original frequency
    sparkleInterval = isMobile ? 300 : 200; // Original frequency
    particleInterval = isMobile ? 250 : 200; // Original frequency

    // Original initial elements
    initialTexts = isMobile ? 12 : 16; // Original amount
    initialHearts = isMobile ? 18 : 25; // Original amount
    initialSparkles = isMobile ? 30 : 40; // Original amount
    initialParticles = isMobile ? 25 : 35; // Original amount
  }

  console.log(
    `Performance mode: ${performanceMode}, Text interval: ${textInterval}ms`
  );

  // Throttle function to prevent excessive calls
  let lastTextCreate = 0;
  function throttledCreateFallingText() {
    const now = Date.now();
    if (now - lastTextCreate >= textInterval) {
      lastTextCreate = now;
      createFallingText();
    }
  }

  // Use throttled version with setInterval
  setInterval(throttledCreateFallingText, textInterval);

  // Create hearts at regular intervals
  setInterval(createHeart, heartInterval);

  // Create sparkles at regular intervals
  setInterval(createSparkle, sparkleInterval);

  // Create particles at regular intervals
  setInterval(createParticle, particleInterval);

  // Create initial falling texts with staggered timing
  for (let i = 0; i < initialTexts; i++) {
    setTimeout(() => {
      createFallingText();
    }, i * (performanceMode === "low" ? 300 : 150)); // Slower for in-app
  }

  // Create initial hearts with staggered timing
  for (let i = 0; i < initialHearts; i++) {
    setTimeout(() => {
      createHeart();
    }, i * (performanceMode === "low" ? 400 : 200)); // Slower for in-app
  }

  // Create initial sparkles with staggered timing
  for (let i = 0; i < initialSparkles; i++) {
    setTimeout(() => {
      createSparkle();
    }, i * (performanceMode === "low" ? 120 : 60)); // Slower for in-app
  }

  // Create initial particles with staggered timing
  for (let i = 0; i < initialParticles; i++) {
    setTimeout(() => {
      createParticle();
    }, i * (performanceMode === "low" ? 150 : 80)); // Slower for in-app
  }

  // Add page visibility handling to pause/resume animations when tab is hidden
  let isPageVisible = true;
  let animationIntervals = [];

  function pauseAnimations() {
    if (performanceMode === "low" && !isPageVisible) {
      // Pause non-essential animations when page is not visible in in-app browsers
      clearInterval(sparkleInterval);
      clearInterval(particleInterval);
      console.log("Paused non-essential animations for performance");
    }
  }

  function resumeAnimations() {
    if (performanceMode === "low" && isPageVisible) {
      // Resume animations when page becomes visible
      setInterval(createSparkle, sparkleInterval);
      setInterval(createParticle, particleInterval);
      console.log("Resumed animations");
    }
  }

  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) {
      resumeAnimations();
    } else {
      pauseAnimations();
    }
  });
});