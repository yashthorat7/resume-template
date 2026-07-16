function autoAdjustSpacing(container) {
    const page = container.closest('.page-content');
    if (!page) return;
    const root = document.documentElement;
    const achItems = container.querySelectorAll('.achievement-item');
    const bulletLists = container.querySelectorAll('.bullet-list');

    bulletLists.forEach(list => {
        const items = list.querySelectorAll('.bullet-item');
        if (items.length > 0) items[items.length - 1].style.marginBottom = '0';
    });
    if (achItems.length > 0) achItems[achItems.length - 1].style.marginBottom = '0';

    function getSpacingForScale(scale) {
        if (scale <= 1.0) {
            return {
                lineHeight: 1.2 * scale,
                sectionGap: 2.0 * scale,
                afterTitle: 1.0 * scale,
                entryGap: 1.0 * scale,
                bulletGap: 0.5 * scale,
                bulletTop: 0.4 * scale,
                skillRowGap: 0.3 * scale,
                eduRowGap: 0.3 * scale,
                achievementGap: 0.3 * scale
            };
        }
        return {
            lineHeight: 1.2,
            sectionGap: Math.min(2.0 * scale, 5.0),
            afterTitle: Math.min(1.0 * scale, 2.0),
            entryGap: Math.min(1.0 * scale, 2.0),
            bulletGap: Math.min(0.5 * scale, 1.2),
            bulletTop: Math.min(0.4 * scale, 1.0),
            skillRowGap: Math.min(0.3 * scale, 0.8),
            eduRowGap: Math.min(0.3 * scale, 0.8),
            achievementGap: Math.min(0.3 * scale, 0.8)
        };
    }

    applySpacing(root, getSpacingForScale(1.0));
    void page.offsetHeight;
    const pageHeight = page.clientHeight;

    page.style.height = 'auto';
    page.style.overflow = 'visible';
    void page.offsetHeight;
    const baselineHeight = page.offsetHeight;

    let low = baselineHeight > pageHeight ? 0.0 : 1.0;
    let high = baselineHeight > pageHeight ? 1.0 : 10.0;
    let optimalScale = low;

    for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        applySpacing(root, getSpacingForScale(mid));
        if (page.offsetHeight > pageHeight) {
            high = mid;
        } else {
            optimalScale = mid;
            low = mid;
        }
    }

    page.style.height = '';
    page.style.overflow = '';
    applySpacing(root, getSpacingForScale(optimalScale));
}

function applySpacing(root, s) {
    root.style.setProperty('--line-height-base', s.lineHeight);
    root.style.setProperty('--spacing-section-gap', s.sectionGap + 'mm');
    root.style.setProperty('--spacing-after-title', s.afterTitle + 'mm');
    root.style.setProperty('--spacing-entry-gap', s.entryGap + 'mm');
    root.style.setProperty('--spacing-bullet-gap', s.bulletGap + 'mm');
    root.style.setProperty('--spacing-bullet-top', s.bulletTop + 'mm');
    root.style.setProperty('--spacing-skill-row-gap', s.skillRowGap + 'mm');
    root.style.setProperty('--spacing-edu-row-gap', s.eduRowGap + 'mm');
    root.style.setProperty('--spacing-achievement-gap', s.achievementGap + 'mm');
}
