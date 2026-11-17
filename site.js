// GoLive Musician's League — shared page behaviour (mobile drawer, copy button, footer year)
(function () {
    const toggleBtn = document.getElementById('gl-nav-toggle');
    const navLinks = document.getElementById('gl-nav-links');
    const backdrop = document.getElementById('gl-nav-backdrop');

    function setMenu(open) {
        navLinks.classList.toggle('open', open);
        toggleBtn.classList.toggle('open', open);
        backdrop.classList.toggle('open', open);
        toggleBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    toggleBtn && toggleBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    backdrop && backdrop.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    navLinks && navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(text);
            } catch (e) {
                const t = document.createElement('textarea');
                t.value = text; document.body.appendChild(t); t.select();
                try { document.execCommand('copy'); } catch (_) {}
                t.remove();
            }
            const old = btn.textContent;
            btn.textContent = 'Copied';
            setTimeout(() => { btn.textContent = old; }, 1600);
        });
    });

    const y = document.getElementById('gl-year');
    if (y) y.textContent = new Date().getFullYear();
})();

// Past shows: year / type filters + "show all"
(function () {
    const list = document.getElementById('gl-past-list');
    if (!list) return;
    const cards = Array.from(list.querySelectorAll('.gl-past-card'));
    const more = document.getElementById('gl-past-more');
    const empty = document.getElementById('gl-no-past');
    const LIMIT = 8;
    let year = 'all', kind = 'all', expanded = false;

    function render() {
        const match = cards.filter(c => (year === 'all' || c.dataset.year === year) && (kind === 'all' || c.dataset.kind === kind));
        const filtered = year !== 'all' || kind !== 'all';
        cards.forEach(c => { c.hidden = true; });
        match.forEach((c, i) => { c.hidden = !(expanded || filtered) && i >= LIMIT; });
        more.hidden = expanded || filtered || match.length <= LIMIT;
        empty.hidden = match.length > 0;
    }

    document.querySelectorAll('.gl-filters .gl-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.filterYear === 'all' && btn.dataset.filterKind === 'all') { year = 'all'; kind = 'all'; }
            else if (btn.dataset.filterYear) { year = (year === btn.dataset.filterYear) ? 'all' : btn.dataset.filterYear; }
            else if (btn.dataset.filterKind) { kind = (kind === btn.dataset.filterKind) ? 'all' : btn.dataset.filterKind; }
            document.querySelectorAll('.gl-filters .gl-filter-btn').forEach(b => {
                const isAll = b.dataset.filterYear === 'all' && b.dataset.filterKind === 'all';
                b.classList.toggle('active', isAll ? (year === 'all' && kind === 'all') : (b.dataset.filterYear === year || b.dataset.filterKind === kind));
            });
            render();
        });
    });
    more && more.addEventListener('click', () => { expanded = true; render(); });
    render();
})();
