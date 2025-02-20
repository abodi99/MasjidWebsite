document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('language-selector'); // Language dropdown
    const translatedElements = document.querySelectorAll('[data-i18n]'); // All elements with data-i18n attribute
    let currentLanguage = localStorage.getItem('lang') || 'sv'; // Default to English, or user preference

    // Function to fetch language data
    async function fetchTranslations(lang) {
        try {
            const response = await fetch(`../lang/${lang}.json`); // Adjust path if needed
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Could not load language file:', error);
            return {}; // Return empty object in case of error
        }
    }

    // Function to translate the page
    async function translatePage(lang) {
        const translations = await fetchTranslations(lang);
        translatedElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            } else {
                console.warn(`Translation key "${key}" not found in ${lang}.json`);
            }
        });
    }

    // Initialize language and translate on page load
    translatePage(currentLanguage);
    if (langSelector) {
        langSelector.value = currentLanguage; // Set dropdown to current language
    }

    // Language selector event listener (if you have a dropdown)
    if (langSelector) {
        langSelector.addEventListener('change', (event) => {
            const selectedLang = event.target.value;
            currentLanguage = selectedLang;
            localStorage.setItem('lang', selectedLang); // Store user preference
            translatePage(selectedLang);
        });
    }
});
