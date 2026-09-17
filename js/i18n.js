(function () {
  const STORAGE_KEY = 'gameboard_lang';
  const DEFAULT_LANG = 'ar';

  function getSavedLanguage() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setSavedLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
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

  function applyLanguage(lang) {
    const translations = getTranslations(lang);
    setSavedLanguage(lang);

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

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const key = element.getAttribute('data-i18n-aria');
      if (translations[key] !== undefined) {
        element.setAttribute('aria-label', translations[key]);
      }
    });
  }

  function toggleLanguage() {
    const currentLang = getSavedLanguage();
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLanguage(nextLang);
  }

  window.GameBoardI18n = {
    applyLanguage: applyLanguage,
    toggleLanguage: toggleLanguage,
    getSavedLanguage: getSavedLanguage,
    getTranslations: getTranslations
  };

  document.addEventListener('DOMContentLoaded', function () {
    const initialLang = getSavedLanguage();
    applyLanguage(initialLang);

    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleLanguage);
    }
  });
})();
