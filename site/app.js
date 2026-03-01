document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('mainNav');
    const modeToggle = document.getElementById('modeToggle');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const nav = document.querySelector('.top-nav');

    const setSeniorMode = (enabled) => {
        document.body.classList.toggle('senior-mode', enabled);
        modeToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        modeToggle.textContent = enabled ? '长辈模式：开' : '长辈模式：关';
        localStorage.setItem('senior_mode_enabled', enabled ? '1' : '0');
    };

    const cachedSeniorMode = localStorage.getItem('senior_mode_enabled') === '1';
    setSeniorMode(cachedSeniorMode);

    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            const enabled = !document.body.classList.contains('senior-mode');
            setSeniorMode(enabled);
        });
    }

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            tabButtons.forEach((current) => {
                current.classList.remove('active');
                current.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach((panel) => panel.classList.remove('active'));

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) {
                return;
            }

            event.preventDefault();
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight - 14;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    accordionHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const active = item.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach((accordionItem) => {
                accordionItem.classList.remove('active');
            });

            if (!active) {
                item.classList.add('active');
            }
        });
    });

    copyButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const value = button.dataset.copy || '';
            if (!value) {
                return;
            }

            try {
                await navigator.clipboard.writeText(value);
                const previousText = button.textContent;
                button.textContent = '✓ 已复制';
                button.style.background = '#059669';
                setTimeout(() => {
                    button.textContent = previousText;
                    button.style.background = '';
                }, 1800);
            } catch {
                button.textContent = '复制失败，请手动复制';
                setTimeout(() => {
                    button.textContent = '复制话术';
                }, 1800);
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (!nav) {
            return;
        }

        nav.style.boxShadow = window.scrollY > 10
            ? '0 6px 18px rgba(15, 23, 42, 0.12)'
            : '0 2px 10px rgba(15, 23, 42, 0.06)';
    });
});
