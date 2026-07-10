function renderResume(resume) {
    const container = document.getElementById('resume-container');
    if (!container) return;

    container.innerHTML = '';

    const headerSection = document.createElement('section');
    headerSection.className = 'header-section';
    
    const nameH1 = document.createElement('h1');
    nameH1.textContent = resume.name;
    headerSection.appendChild(nameH1);

    const contactDiv = document.createElement('div');
    contactDiv.className = 'header-contacts';
    
    const contactLinksHtml = resume.contact.map(item => parseMarkdownFormatting(item)).join('<span class="contact-dot">•</span>');
    contactDiv.innerHTML = contactLinksHtml;
    headerSection.appendChild(contactDiv);
    container.appendChild(headerSection);

    resume.sections.forEach(section => {
        const secElement = document.createElement('section');
        
        const titleH2 = document.createElement('h2');
        titleH2.className = 'section-title';
        titleH2.textContent = section.title;
        secElement.appendChild(titleH2);

        if (section.key === 'experience' || section.key === 'projects') {
            section.items.forEach((item, index) => {
                if (item.type === 'subsection') {
                    const parts = item.title.split('|').map(p => p.trim());
                    const company = parts[0] ? parseMarkdownFormatting(parts[0]) : '';
                    const role = parts[1] ? parseMarkdownFormatting(parts[1]) : '';
                    const date = parts[2] ? parts[2] : '';

                    const headerClass = index === 0 ? 'entry-header' : 'entry-header mt-entry';

                    const entryHeader = document.createElement('div');
                    entryHeader.className = headerClass;
                    entryHeader.innerHTML = `
                        <div class="entry-title">
                            <h3>${company}</h3>
                             ${role ? ` <span class="entry-role">${role}</span>` : ''}
                        </div>
                        ${date ? `<div class="entry-date">${date}</div>` : ''}
                    `;
                    secElement.appendChild(entryHeader);

                    const bulletList = document.createElement('ul');
                    bulletList.className = 'bullet-list';
                    item.bullets.forEach(bullet => {
                        const li = document.createElement('li');
                        li.className = 'bullet-item';
                        li.innerHTML = parseMarkdownFormatting(bullet);
                        bulletList.appendChild(li);
                    });
                    secElement.appendChild(bulletList);
                }
            });
        } else if (section.key === 'achievements') {
            const list = document.createElement('ul');
            list.className = 'achievement-list';
            section.items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'achievement-item';
                li.innerHTML = parseMarkdownFormatting(item.content);
                list.appendChild(li);
            });
            secElement.appendChild(list);
        } else if (section.key === 'skills') {
            const listContainer = document.createElement('div');
            listContainer.className = 'skills-container';
            
            section.items.forEach(item => {
                const lineText = item.content;
                const match = lineText.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
                if (match) {
                    const skillTitle = match[1];
                    const skillItemsText = match[2];
                    const skillItems = skillItemsText.split('•').map(s => s.trim());

                    const skillRow = document.createElement('div');
                    skillRow.className = 'skill-row';
                    
                    const h3 = document.createElement('h3');
                    h3.className = 'skill-title';
                    h3.innerHTML = skillTitle;
                    skillRow.appendChild(h3);

                    const pipe = document.createElement('span');
                    pipe.className = 'pipe-sep';
                    pipe.innerHTML = '<svg viewBox="0 0 6 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"><line x1="3" y1="2" x2="3" y2="22"></line></svg>';
                    skillRow.appendChild(pipe);

                    const skillList = document.createElement('div');
                    skillList.className = 'skill-list';
                    
                    const itemsHtml = skillItems.map((sItem, idx) => {
                        const parsedItem = parseMarkdownFormatting(sItem);
                        const dot = idx < skillItems.length - 1 ? '<span class="skill-dot">•</span>' : '';
                        return `<span class="skill-item-text">${parsedItem}</span>${dot}`;
                    }).join('');
                    
                    skillList.innerHTML = itemsHtml;
                    skillRow.appendChild(skillList);
                    listContainer.appendChild(skillRow);
                }
            });
            secElement.appendChild(listContainer);
        } else if (section.key === 'education') {
            const listContainer = document.createElement('div');
            listContainer.className = 'education-container';

            section.items.forEach(item => {
                const parts = item.content.split('|').map(p => p.trim());
                const eduRow = document.createElement('div');
                eduRow.className = 'edu-row';

                const spansHtml = parts.map(part => {
                    const parsedPart = parseMarkdownFormatting(part);
                    return parsedPart.replace(/class="font-normal"/g, 'class="edu-bold"');
                }).join('<span class="pipe-sep"><svg viewBox="0 0 6 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"><line x1="3" y1="2" x2="3" y2="22"></line></svg></span>');

                eduRow.innerHTML = spansHtml;
                listContainer.appendChild(eduRow);
            });
            secElement.appendChild(listContainer);
        } else {
            section.items.forEach(item => {
                if (item.type === 'paragraph' || item.type === 'list-item') {
                    const p = document.createElement('p');
                    p.className = 'section-text';
                    p.innerHTML = parseMarkdownFormatting(item.content);
                    secElement.appendChild(p);
                }
            });
        }

        container.appendChild(secElement);
    });

    autoAdjustSpacing(container);
}
