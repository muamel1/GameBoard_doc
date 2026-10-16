// Loaded synchronously in <head> so the language is known before first paint.
(function () {
  const STORAGE_KEY = 'gameboard_lang';
  const SUPPORTED = ['ar', 'en'];
  const FALLBACK_LANG = 'en';
  // Language the static HTML is written in; no swap is needed when it matches.
  const MARKUP_LANG = 'en';

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(saved) !== -1 ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function getBrowserLanguage() {
    const langs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ''];
    for (let i = 0; i < langs.length; i++) {
      const base = String(langs[i]).toLowerCase().split('-')[0];
      if (SUPPORTED.indexOf(base) !== -1) return base;
    }
    return FALLBACK_LANG;
  }

  function detectLanguage() {
    return getSavedLanguage() || getBrowserLanguage();
  }

  window.GameBoardLang = {
    STORAGE_KEY: STORAGE_KEY,
    detectLanguage: detectLanguage
  };

  const lang = detectLanguage();
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Hide the page until i18n.js has swapped the text, so the markup language never flashes.
  if (lang !== MARKUP_LANG) {
    root.classList.add('i18n-pending');
    // Safety net: never leave the page hidden if the translation scripts fail.
    setTimeout(function () { root.classList.remove('i18n-pending'); }, 2000);
  }
})();
