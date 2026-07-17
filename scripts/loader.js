document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('resume-container');
    if (!container) return;

    await loadGoogleFonts();

    let res = await fetch('docs/resume.md');
    if (!res.ok) res = await fetch('docs/info.md');
    const mdText = await res.text();

    renderResume(parseResumeMarkdown(mdText));

    if (document.fonts) {
        await document.fonts.ready;
        autoAdjustSpacing(container);
    }
});

function loadGoogleFonts() {
    return new Promise((resolve) => {
        const rootStyles = getComputedStyle(document.documentElement);
        const primary = rootStyles.getPropertyValue('--font-primary');
        const secondary = rootStyles.getPropertyValue('--font-secondary');
        const families = [];
        const systemFonts = ['sans-serif', 'serif', 'monospace', 'arial', 'helvetica', 'times new roman', 'times', 'courier new', 'courier', 'verdana', 'georgia', 'palatino', 'garamond', 'bookman', 'comic sans ms', 'trebuchet ms', 'impact'];

        [primary, secondary].forEach(fontVar => {
            if (!fontVar) return;
            const fontName = fontVar.split(',')[0].replace(/['"]/g, '').trim();
            if (fontName && !systemFonts.includes(fontName.toLowerCase())) {
                families.push(`family=${fontName.replace(/\s+/g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700`);
            }
        });

        if (families.length > 0) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.id = 'dynamic-google-fonts';
            link.href = `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
            
            link.onload = () => resolve();
            link.onerror = () => {
                const fallback = families.map(f => {
                    const match = f.match(/family=[^:]+/);
                    return match ? match[0] : f;
                });
                link.href = `https://fonts.googleapis.com/css2?${fallback.join('&')}&display=swap`;
                link.onload = () => resolve();
                link.onerror = () => resolve();
            };
            document.head.appendChild(link);
        } else {
            resolve();
        }
    });
}
