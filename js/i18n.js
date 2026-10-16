(function () {
  const STORAGE_KEY = 'gameboard_lang';
  const DEFAULT_LANG = 'en';

  // Saved choice first, then the browser's language (see lang-detect.js).
  function getSavedLanguage() {
    if (window.GameBoardLang) {
      return window.GameBoardLang.detectLanguage();
    }
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setSavedLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function getTranslations(lang) {
    if (window.GameBoardTranslations && window.GameBoardTranslations[lang]) {
      return window.GameBoardTranslations[lang];
    }
    if (window.GameBoardTranslations && window.GameBoardTranslations[DEFAULT_LANG]) {
      return window.GameBoardTranslations[DEFAULT_LANG];
    }
    return {};
  }

  // Only persist when the user picks a language, so an auto-detected one keeps following the browser.
  function applyLanguage(lang, persist) {
    const translations = getTranslations(lang);
    if (persist) {
      setSavedLanguage(lang);
    }

    const htmlElement = document.documentElement;
    htmlElement.lang = lang;
    htmlElement.dir = translations['dir'] || (lang === 'ar' ? 'rtl' : 'ltr');

    const metaTitle = document.getElementById('meta-title');
    if (metaTitle && translations['meta-title']) {
      metaTitle.innerText = translations['meta-title'];
      document.title = translations['meta-title'];
    }

    const metaDesc = document.getElementById('meta-desc');
    if (metaDesc && translations['meta-desc']) {
      metaDesc.setAttribute('content', translations['meta-desc']);
    }

    const langBtnText = document.getElementById('lang-btn-text');
    if (langBtnText && translations['lang-btn-text']) {
      langBtnText.innerText = translations['lang-btn-text'];
    }

    const langToggleBtn = document.getElementById('lang-toggle-btn');
    if (langToggleBtn && translations['lang-btn-aria']) {
      langToggleBtn.setAttribute('aria-label', translations['lang-btn-aria']);
      langToggleBtn.setAttribute('title', translations['lang-btn-aria']);
    }

    const downloadLink = document.getElementById('download-link');
    if (downloadLink && translations['download-btn-title']) {
      downloadLink.setAttribute('title', translations['download-btn-title']);
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (translations[key] !== undefined) {
        if (key === 'footer-contact') {
          element.innerHTML = translations[key];
        } else {
          element.innerText = translations[key];
        }
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const key = element.getAttribute('data-i18n-title');
      if (translations[key] !== undefined) {
        element.setAttribute('title', translations[key]);
      }
    });

    document.querySelectorAll('[data-i18n-href]').forEach((element) => {
      const key = element.getAttribute('data-i18n-href');
      if (translations[key] !== undefined) {
        element.setAttribute('href', translations[key]);
        element.setAttribute('hreflang', lang);
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const key = element.getAttribute('data-i18n-aria');
      if (translations[key] !== undefined) {
        element.setAttribute('aria-label', translations[key]);
      }
    });
  }

  function toggleLanguage() {
    const currentLang = document.documentElement.lang;
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLanguage(nextLang, true);
  }

  window.GameBoardI18n = {
    applyLanguage: applyLanguage,
    toggleLanguage: toggleLanguage,
    getSavedLanguage: getSavedLanguage,
    getTranslations: getTranslations
  };

  function init() {
    applyLanguage(getSavedLanguage(), false);
    document.documentElement.classList.remove('i18n-pending');

    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleLanguage);
    }
  }

  // Loaded at the end of <body>, so every element above is already parsed: apply right away
  // instead of waiting for DOMContentLoaded, which keeps the hidden-page window as short as possible.
  init();
})();
