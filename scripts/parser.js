function parseMarkdownFormatting(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-normal">$1</span>');
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return html.replace(linkRegex, (match, linkText, url) => {
        if (url.startsWith('tel:')) {
            return `<a href="${url}" class="contact-link">${linkText}</a>`;
        }
        const isEmail = url.startsWith('mailto:') || (url.includes('@') && !url.includes('://'));
        const targetUrl = isEmail ? (url.startsWith('mailto:') ? url : `mailto:${url}`) : url;
        return `<a href="${targetUrl}" class="contact-link" target="_blank" rel="noopener noreferrer">${linkText}&thinsp;<span class="arrow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><line x1="6" y1="18" x2="17" y2="7"></line><polyline points="9 6 18 6 18 15"></polyline></svg></span></a>`;
    });
}

function parseResumeMarkdown(mdText) {
    const lines = mdText.split(/\r?\n/);
    const resume = { name: '', contact: [], sections: [] };
    let currentSection = null;
    let currentSubsection = null;

    function parseAttributes(lineText) {
        const attrMatch = lineText.match(/(.*?)\s*\{\s*([^{}]+)\s*\}\s*$/);
        if (attrMatch) {
            const title = attrMatch[1].trim();
            const classes = [];
            let id = '';
            attrMatch[2].split(/\s+/).forEach(item => {
                item = item.trim();
                if (item.startsWith('.')) classes.push(item.substring(1));
                else if (item.startsWith('#')) id = item.substring(1);
                else classes.push(item);
            });
            return { title, classes, id };
        }
        return { title: lineText, classes: [], id: '' };
    }

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.match(/^---+$/)) {
            if (currentSection && currentSection.key !== 'header') {
                currentSection.items.push({ type: 'divider' });
            }
            continue;
        }

        if (line.startsWith('# ')) {
            resume.name = line.substring(2).trim();
            currentSection = { key: 'header', items: [], classes: [], id: '' };
        } else if (line.startsWith('## ')) {
            const parsed = parseAttributes(line.substring(3).trim());
            currentSection = { title: parsed.title, key: parsed.title.toLowerCase(), classes: parsed.classes, id: parsed.id, items: [] };
            resume.sections.push(currentSection);
            currentSubsection = null;
        } else if (line.startsWith('### ')) {
            const parsed = parseAttributes(line.substring(4).trim());
            currentSubsection = { type: 'subsection', title: parsed.title, classes: parsed.classes, id: parsed.id, bullets: [] };
            if (currentSection) currentSection.items.push(currentSubsection);
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.substring(2).trim();
            if (currentSection?.key === 'header') {
                resume.contact.push(content);
            } else if (currentSubsection) {
                currentSubsection.bullets.push(content);
            } else if (currentSection) {
                currentSection.items.push({ type: 'list-item', content });
            }
        } else {
            if (currentSection && currentSection.key !== 'header') {
                currentSection.items.push({ type: 'paragraph', content: line });
            }
        }
    }
    return resume;
}
