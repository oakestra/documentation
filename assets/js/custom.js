// Put your custom JS code here

// CUSTOM THEME TOGGLE LOGIC
(function() {
    const light_mode_colors = ["#000000", "#000000", "#000000", "#798F00", "#868887", "#135E9C", "#3C8400", "#2421A9", "#F2920D"]
    const dark_mode_colors =  ["#CED9E2", "#CED9E2", "#CED9E2", "#FFE45F", "#868887", "#508DC0", "#78E77F", "#8482DD", "#FFBC5F"]

    function syncTheme() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const color_palette = currentTheme === "light" ? light_mode_colors : dark_mode_colors
        Array.from({ length: 9 }).forEach((_, i) => {
            document.documentElement.style.setProperty(`--terminal-r${i}-fill`, color_palette[i]);
        });
    }

    // Initial sync
    syncTheme();

    // Listen for theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
            syncTheme();
        }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-bs-theme']
    });
})();


const DROPDOWN_DEBUG = true;

document.addEventListener('click', (event) => {
    const toggle = document.getElementById('doks-versions');
    if (!toggle) return;
    
    const menu = toggle.nextElementSibling;
    if (!menu || !menu.classList.contains('dropdown-menu')) return;
    
    if (toggle.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        
        const isOpen = menu.classList.contains('show');
        if (isOpen) {
            menu.classList.remove('show');
            toggle.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            menu.classList.add('show');
            toggle.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
        }
        return;
    }
    
    if (!menu.contains(event.target) && menu.classList.contains('show')) {
        menu.classList.remove('show');
        toggle.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
    }
});