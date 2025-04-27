import i18n from "./libs/i18n.js";

const setLanguage = (lang) => {
  document.documentElement.lang = lang;

  // Update all elements with data-i18n attribute
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const translation = getNestedTranslation(i18n[lang], key);

    if (translation) {
      element.textContent = translation;
    }
  });

  // Update all elements with data-i18n-placeholder attribute
  const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    const translation = getNestedTranslation(i18n[lang], key);

    if (translation) {
      element.placeholder = translation;
    }
  });

  // Update all elements with data-i18n-alt attribute
  const alts = document.querySelectorAll("[data-i18n-alt]");
  alts.forEach((element) => {
    const key = element.getAttribute("data-i18n-alt");
    const translation = getNestedTranslation(i18n[lang], key);

    if (translation) {
      element.alt = translation;
    }
  });

  // Update meta tags
  updateMetaTags(lang);

  // Update current language display
  document.querySelector(".current-language").textContent = lang.toUpperCase();
};

// Helper function to get nested i18n
function getNestedTranslation(obj, path) {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key];
    } else {
      return null;
    }
  }

  return current;
}

// Function to update meta tags
function updateMetaTags(lang) {
  // Update title
  document.title = i18n[lang].meta.title;

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = i18n[lang].meta.description;
  }

  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.content = i18n[lang].meta.keywords;
  }

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );

  if (ogTitle) {
    ogTitle.content = i18n[lang].meta.og.title;
  }

  if (ogDescription) {
    ogDescription.content = i18n[lang].meta.og.description;
  }

  // Update Twitter Card tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]'
  );

  if (twitterTitle) {
    twitterTitle.content = i18n[lang].meta.twitter.title;
  }

  if (twitterDescription) {
    twitterDescription.content = i18n[lang].meta.twitter.description;
  }
}

// Mobile menu toggle with improved accessibility
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileMenuLinks = mobileMenu
    ? mobileMenu.querySelectorAll(".nav__link")
    : [];
  const mobileMenuButtons = mobileMenu
    ? mobileMenu.querySelectorAll("button")
    : [];

  const languageToggle = document.getElementById("language-toggle");
  const languageDropdown = document.getElementById("language-dropdown");
  const languageOptions = document.querySelectorAll(".language-option");

  // Obtener el idioma actual
  const currentLang =
    new URLSearchParams(window.location.search).get("lang") ||
    localStorage.getItem("language") ||
    "en";
  setLanguage(currentLang);

  // Marcar la opción de idioma activa

  languageOptions.forEach((option) => {
    const optionLang = option.getAttribute("data-lang");
    if (optionLang === currentLang) {
      option.classList.add("language-option--active");
      option.setAttribute("aria-current", "true");
    }
  });

  // Añadir clase para animación al mostrar el menú
  languageToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isExpanded =
      languageDropdown.getAttribute("aria-expanded") === "true";

    if (!isExpanded) {
      languageDropdown.classList.add("language-dropdown--show");
      languageDropdown.animate(
        [
          { opacity: 0, transform: "translateY(-10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 200,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      languageDropdown.setAttribute("aria-expanded", "true");
    } else {
      // Remove class for hiding the dropdown
      const animationLanguageDropwdown = languageDropdown.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-10px)" },
        ],
        {
          duration: 200,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      animationLanguageDropwdown.addEventListener("finish", () => {
        languageDropdown.classList.remove("language-dropdown--show");
      });
      languageDropdown.setAttribute("aria-expanded", "false");
    }
  });

  // Soporte para navegación con teclado en el menú desplegable
  languageToggle.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      languageToggle.setAttribute("aria-expanded", "true");
      languageDropdown.setAttribute("aria-hidden", "false");
      languageDropdown.classList.add("language-dropdown--show");

      // Enfocar la primera opción
      languageOptions[0].focus();
    }
  });

  languageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const selectedLang = option.getAttribute("data-lang");
      window.history.pushState(
        { lang: selectedLang },
        "",
        window.location.pathname + "?lang=" + selectedLang
      );

      setLanguage(selectedLang);
      localStorage.setItem("language", selectedLang);

      // Actualizar la opción activa
      languageOptions.forEach((opt) => {
        opt.classList.remove("language-option--active");
        opt.removeAttribute("aria-current");
      });

      option.classList.add("language-option--active");
      option.setAttribute("aria-current", "true");

      // Cerrar el menú desplegable
      languageToggle.setAttribute("aria-expanded", "false");
      languageDropdown.setAttribute("aria-hidden", "true");
    });
  });

  // Navegación con teclado entre opciones
  languageOptions.forEach((option, index) => {
    option.addEventListener("keydown", function (e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (index < languageOptions.length - 1) {
            languageOptions[index + 1].focus();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (index > 0) {
            languageOptions[index - 1].focus();
          } else {
            languageToggle.focus();
          }
          break;
        case "Escape":
          e.preventDefault();
          languageToggle.setAttribute("aria-expanded", "false");
          languageDropdown.setAttribute("aria-hidden", "true");
          languageDropdown.classList.remove("language-dropdown--show");
          languageToggle.focus();
          break;
      }
    });
  });

  // Function to manage focus trap in mobile menu
  const setupFocusTrap = (menu) => {
    const focusableElements = menu.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="email"], input[type="submit"]'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    // Set initial tabindex for all focusable elements
    focusableElements.forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });

    return {
      activate: function () {
        // Enable tabindex for all focusable elements
        focusableElements.forEach((el) => {
          el.setAttribute("tabindex", "0");
        });
        // Focus first element
        setTimeout(() => {
          firstFocusableElement.focus();
        }, 100);
      },
      deactivate: function () {
        // Disable tabindex for all focusable elements
        focusableElements.forEach((el) => {
          el.setAttribute("tabindex", "-1");
        });
      },
      handleKeyDown: function (e) {
        const isTabPressed = e.key === "Tab" || e.keyCode === 9;
        const isEscapePressed = e.key === "Escape" || e.keyCode === 27;

        // Close menu on Escape key
        if (isEscapePressed) {
          closeMenu();
          return;
        }

        if (!isTabPressed) {
          return;
        }

        // Handle tab navigation to keep focus trapped in modal
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      },
    };
  };

  // Initialize focus trap if mobile menu exists
  const focusTrap = mobileMenu ? setupFocusTrap(mobileMenu) : null;

  const openMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("nav--mobile--active");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuIcon.classList.add("icon--hidden");
    closeIcon.classList.remove("icon--hidden");

    // Enable focus trap
    if (focusTrap) {
      focusTrap.activate();
      // Add event listener for keyboard navigation
      document.addEventListener("keydown", focusTrap.handleKeyDown);
    }
  };

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("nav--mobile--active");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuIcon.classList.remove("icon--hidden");
    closeIcon.classList.add("icon--hidden");

    // Disable focus trap
    if (focusTrap) {
      focusTrap.deactivate();
      // Remove event listener for keyboard navigation
      document.removeEventListener("keydown", focusTrap.handleKeyDown);
    }

    // Return focus to menu toggle
    menuToggle.focus();
  };

  if (menuToggle && mobileMenu && menuIcon && closeIcon) {
    menuToggle.addEventListener("click", function () {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close mobile menu when clicking on buttons (like login/register)
    mobileMenuButtons.forEach((button) => {
      button.addEventListener("click", closeMenu);
    });
  }

  // Set current year in footer
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Enhanced form validation with accessibility
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const formStatus = document.getElementById("form-status");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic form validation
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      let isValid = true;

      // Reset form status
      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status sr-only";
      }

      // Validate name
      if (!nameInput.value.trim()) {
        showError(nameInput, "Por favor ingresa tu nombre");
        isValid = false;
      } else {
        removeError(nameInput);
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        showError(emailInput, "Por favor ingresa un correo electrónico válido");
        isValid = false;
      } else {
        removeError(emailInput);
      }

      // Validate message
      if (!messageInput.value.trim()) {
        showError(messageInput, "Por favor ingresa tu mensaje");
        isValid = false;
      } else {
        removeError(messageInput);
      }

      // If form is valid, submit it
      if (isValid) {
        // Here you would typically send the form data to your server
        // For demonstration, we'll just show a success message
        showFormSuccess();
        contactForm.reset();

        // Focus on first field after form submission
        nameInput.focus();
      } else {
        // Announce validation errors to screen readers
        if (formStatus) {
          formStatus.textContent =
            "Hay errores en el formulario. Por favor, revisa los campos marcados.";
          formStatus.className = "form-status";
          formStatus.classList.remove("sr-only");
        }

        // Focus the first invalid field
        const firstInvalidField = contactForm.querySelector(
          ".form-group__input--error, .form-group__textarea--error"
        );
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      }
    });

    function showError(input, message) {
      const errorId = `${input.id}-error`;
      const errorElement = document.getElementById(errorId);

      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove("sr-only");
      }

      input.classList.add("form-group__input--error");
      input.setAttribute("aria-invalid", "true");
      input.style.borderColor = "#e53e3e";
    }

    function removeError(input) {
      const errorId = `${input.id}-error`;
      const errorElement = document.getElementById(errorId);

      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.add("sr-only");
      }

      input.classList.remove("form-group__input--error");
      input.removeAttribute("aria-invalid");
      input.style.borderColor = "";
    }

    function showFormSuccess() {
      if (formStatus) {
        formStatus.textContent = i18n[currentLang].sucessForm.description;
        formStatus.className = "form-status form-success";
        formStatus.classList.remove("sr-only");
      } else {
        const successMessage = document.createElement("div");
        successMessage.className = "form-success";
        successMessage.setAttribute("role", "status");
        successMessage.setAttribute("aria-live", "polite");
        successMessage.textContent = i18n[currentLang].sucessForm.description;
        successMessage.style.backgroundColor = "#c6f6d5";
        successMessage.style.color = "#22543d";
        successMessage.style.padding = "1rem";
        successMessage.style.borderRadius = "0.375rem";
        successMessage.style.marginTop = "1rem";

        contactForm.parentNode.insertBefore(
          successMessage,
          contactForm.nextSibling
        );

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    }

    // Add input event listeners for real-time validation feedback
    const formInputs = contactForm.querySelectorAll("input, textarea");
    formInputs.forEach((input) => {
      input.addEventListener("input", function () {
        if (this.hasAttribute("aria-invalid")) {
          // Re-validate on input
          if (this.id === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value.trim() && emailRegex.test(this.value)) {
              removeError(this);
            }
          } else if (this.value.trim()) {
            removeError(this);
          }
        }
      });
    });
  }

  // Skip link functionality
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.setAttribute("tabindex", "-1");
        targetElement.focus();

        // Remove tabindex after blur to avoid leaving unnecessary tabindex
        targetElement.addEventListener("blur", function onBlur() {
          targetElement.removeAttribute("tabindex");
          targetElement.removeEventListener("blur", onBlur);
        });
      }
    });
  }

  // Lazy load images that are below the fold
  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }
});
