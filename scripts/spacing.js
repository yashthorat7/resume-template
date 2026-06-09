function autoAdjustSpacing(container) {
    const page = container.closest('.page-content');
    if (!page) return;

    const root = document.documentElement;

    const baselines = {
        sectionGap:      2.0,
        afterTitle:      1.0,
        entryGap:        1.5,
        bulletGap:       0.5,
        bulletTop:       0.4,
        skillRowGap:     0.3,
        eduRowGap:       0.6,
        achievementGap:  0.3,
        lineHeight:      1.2,
    };

    const sections    = container.querySelectorAll('section');
    const sectionGaps = Math.max(sections.length - 1, 0);
    const titles      = container.querySelectorAll('.section-title');
    const entries     = container.querySelectorAll('.entry-header.mt-entry');
    const bullets     = container.querySelectorAll('.bullet-item');
    const skillRows   = container.querySelectorAll('.skill-row');
    const eduRows     = container.querySelectorAll('.edu-row');
    const achItems    = container.querySelectorAll('.achievement-item');
    const bulletLists = container.querySelectorAll('.bullet-list');

    // remove last item margins
    bulletLists.forEach(list => {
        const items = list.querySelectorAll('.bullet-item');
        if (items.length > 0) {
            items[items.length - 1].style.marginBottom = '0';
        }
    });

    if (achItems.length > 0) {
        achItems[achItems.length - 1].style.marginBottom = '0';
    }

    applySpacing(root, baselines);
    void page.offsetHeight;

    const pageHeight = page.clientHeight;
    const pxPerMm = pageHeight / (297 - 17);

    page.style.height = 'auto';
    page.style.overflow = 'visible';
    void page.offsetHeight;

    const naturalHeight = page.offsetHeight;

    page.style.height = '';
    page.style.overflow = '';

    // calculate remaining page space
    let surplusMm = (pageHeight - naturalHeight) / pxPerMm;

    if (surplusMm < 0) return;

    const contributors = [
        { key: 'sectionGap',     count: sectionGaps,                              weight: 6,   min: 2.0, max: 12 },
        { key: 'entryGap',       count: entries.length,                            weight: 4,   min: 1.5, max: 7 },
        { key: 'bulletGap',      count: Math.max(bullets.length - bulletLists.length, 0), weight: 2,   min: 0.5, max: 3.5 },
        { key: 'afterTitle',     count: titles.length,                             weight: 2,   min: 1.0, max: 4 },
        { key: 'bulletTop',      count: bulletLists.length,                        weight: 1.5, min: 0.4, max: 3 },
        { key: 'skillRowGap',    count: Math.max(skillRows.length - 1, 0),         weight: 1,   min: 0.3, max: 2.5 },
        { key: 'eduRowGap',      count: Math.max(eduRows.length - 1, 0),           weight: 1,   min: 0.6, max: 3 },
        { key: 'achievementGap', count: Math.max(achItems.length - 1, 0),          weight: 1,   min: 0.3, max: 2 },
    ];

    const adjusted = { ...baselines };

    let activeContributors = contributors.filter(c => c.count > 0);
    const maxPasses = 8;

    // distribute spacing to elements
    for (let pass = 0; pass < maxPasses; pass++) {
        if (surplusMm < 0.05 || activeContributors.length === 0) break;

        const totalWeighted = activeContributors.reduce((s, c) => s + c.count * c.weight, 0);
        if (totalWeighted === 0) break;

        const mmPerUnit = surplusMm / totalWeighted;
        let consumed = 0;
        const stillActive = [];

        activeContributors.forEach(c => {
            const delta = mmPerUnit * c.weight;
            let newVal = adjusted[c.key] + delta;

            if (newVal >= c.max) {
                consumed += (c.max - adjusted[c.key]) * c.count;
                adjusted[c.key] = c.max;
            } else if (newVal <= c.min) {
                consumed += (c.min - adjusted[c.key]) * c.count;
                adjusted[c.key] = c.min;
            } else {
                consumed += delta * c.count;
                adjusted[c.key] = Math.round(newVal * 100) / 100;
                stillActive.push(c);
            }
        });

        surplusMm -= consumed;
        activeContributors = stillActive;
    }

    applySpacing(root, adjusted);
}

function applySpacing(root, s) {
    root.style.setProperty('--line-height-base',        s.lineHeight);
    root.style.setProperty('--spacing-section-gap',      s.sectionGap + 'mm');
    root.style.setProperty('--spacing-after-title',      s.afterTitle + 'mm');
    root.style.setProperty('--spacing-entry-gap',        s.entryGap + 'mm');
    root.style.setProperty('--spacing-bullet-gap',       s.bulletGap + 'mm');
    root.style.setProperty('--spacing-bullet-top',       s.bulletTop + 'mm');
    root.style.setProperty('--spacing-skill-row-gap',    s.skillRowGap + 'mm');
    root.style.setProperty('--spacing-edu-row-gap',      s.eduRowGap + 'mm');
    root.style.setProperty('--spacing-achievement-gap',  s.achievementGap + 'mm');
}
