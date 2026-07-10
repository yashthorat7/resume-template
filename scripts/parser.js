function parseMarkdownFormatting(text) {
    let html = text;

    html = html.replace(/\*\*(.*?)\*\*/g, '<span class="font-normal">$1</span>');

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    html = html.replace(linkRegex, (match, linkText, url) => {
        if (url.startsWith('tel:')) {
            return `<a href="${url}" class="contact-link">${linkText}</a>`;
        }
        const isEmail = url.startsWith('mailto:') || (url.includes('@') && !url.includes('://'));
        if (isEmail) {
            const email = url.startsWith('mailto:') ? url.substring(7) : url;
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
            return `<a href="${gmailUrl}" class="contact-link" target="_blank" rel="noopener noreferrer">${linkText}&thinsp;<span class="arrow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"><line x1="6" y1="18" x2="17" y2="7"></line><polyline points="9 6 18 6 18 15"></polyline></svg></span></a>`;
        }
        return `<a href="${url}" class="contact-link" target="_blank" rel="noopener noreferrer">${linkText}&thinsp;<span class="arrow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"><line x1="6" y1="18" x2="17" y2="7"></line><polyline points="9 6 18 6 18 15"></polyline></svg></span></a>`;
    });

    return html;
}

function parseResumeMarkdown(mdText) {
    const lines = mdText.split(/\r?\n/);
    const resume = { name: '', contact: [], sections: [] };

    let currentSection = null;
    let currentSubsection = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.startsWith('# ')) {
            resume.name = line.substring(2).trim();
            currentSection = { key: 'header', items: [] };
        } else if (line.startsWith('## ')) {
            const title = line.substring(3).trim();
            currentSection = { title, key: title.toLowerCase(), items: [] };
            resume.sections.push(currentSection);
            currentSubsection = null;
        } else if (line.startsWith('### ')) {
            currentSubsection = {
                type: 'subsection',
                title: line.substring(4).trim(),
                bullets: []
            };
            if (currentSection) currentSection.items.push(currentSubsection);
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.substring(2).trim();
            if (currentSection?.key === 'header') {
                resume.contact.push(content);
            } else if (currentSubsection) {
                currentSubsection.bullets.push(content);
            } else if (currentSection) {
                currentSection.items.push({
                    type: 'list-item',
                    content
                });
            }
        } else {
            if (currentSection && currentSection.key !== 'header') {
                currentSection.items.push({
                    type: 'paragraph',
                    content: line
                });
            }
        }
    }

    return resume;
}
