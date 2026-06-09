function parseMarkdownFormatting(text) {
    let html = text;

    // parse bold text markers
    html = html.replace(/\*\*(.*?)\*\*/g, '<span class="font-normal">$1</span>');

    // parse markdown hyperlinks
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    html = html.replace(linkRegex, (match, linkText, url) => {
        if (url.startsWith('tel:') || url.startsWith('mailto:')) {
            return `<a href="${url}" class="contact-link">${linkText}</a>`;
        } else {
            return `<a href="${url}" class="contact-link" target="_blank" rel="noopener noreferrer">${linkText}&thinsp;<span class="arrow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"><line x1="6" y1="18" x2="17" y2="7"></line><polyline points="9 6 18 6 18 15"></polyline></svg></span></a>`;
        }
    });

    return html;
}

function parseResumeMarkdown(mdText) {
    const lines = mdText.split(/\r?\n/);
    const resume = {
        name: '',
        contact: [],
        sections: []
    };

    let currentSection = null;
    let currentSubsection = null;

    // iterate and parse lines
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.startsWith('# ')) {
            resume.name = line.substring(2).trim();
            currentSection = { key: 'header', items: [] };
            continue;
        }

        if (line.startsWith('## ')) {
            const title = line.substring(3).trim();
            const key = title.toLowerCase();
            currentSection = { title, key, items: [] };
            resume.sections.push(currentSection);
            currentSubsection = null;
            continue;
        }

        if (line.startsWith('### ')) {
            const title = line.substring(4).trim();
            currentSubsection = {
                type: 'subsection',
                title: title,
                bullets: []
            };
            if (currentSection) {
                currentSection.items.push(currentSubsection);
            }
            continue;
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.substring(2).trim();
            if (currentSection && currentSection.key === 'header') {
                resume.contact.push(content);
            } else if (currentSubsection) {
                currentSubsection.bullets.push(content);
            } else if (currentSection) {
                currentSection.items.push({
                    type: 'list-item',
                    content: content
                });
            }
        }
    }

    return resume;
}
