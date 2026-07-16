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
    contactDiv.innerHTML = resume.contact.map(item => parseMarkdownFormatting(item)).join('<span class="contact-dot">•</span>');
    headerSection.appendChild(contactDiv);
    container.appendChild(headerSection);

    resume.sections.forEach(section => {
        const secElement = document.createElement('section');
        if (section.id) secElement.id = section.id;
        if (section.classes) section.classes.forEach(c => secElement.classList.add(c));
        
        const titleH2 = document.createElement('h2');
        titleH2.className = 'section-title';
        titleH2.textContent = section.title;
        secElement.appendChild(titleH2);

        const layout = getSectionLayout(section);

        if (layout === 'experience') {
            section.items.forEach((item, index) => {
                if (item.type === 'subsection') {
                    const parts = item.title.split('|').map(p => p.trim());
                    const company = parts[0] ? parseMarkdownFormatting(parts[0]) : '';
                    const role = parts[1] ? parseMarkdownFormatting(parts[1]) : '';
                    const date = parts[2] ? parts[2] : '';
                    const headerClass = index === 0 ? 'entry-header' : 'entry-header mt-entry';

                    const entryHeader = document.createElement('div');
                    entryHeader.className = headerClass;
                    if (item.id) entryHeader.id = item.id;
                    if (item.classes) item.classes.forEach(c => entryHeader.classList.add(c));
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
                } else if (item.type === 'divider') {
                    const hr = document.createElement('hr');
                    hr.className = 'section-divider';
                    secElement.appendChild(hr);
                } else if (item.type === 'paragraph') {
                    const p = document.createElement('p');
                    p.className = 'section-text';
                    p.innerHTML = parseMarkdownFormatting(item.content);
                    secElement.appendChild(p);
                }
            });
        } else if (layout === 'skills') {
            const listContainer = document.createElement('div');
            listContainer.className = 'skills-container';
            if (section.classes) section.classes.forEach(c => listContainer.classList.add(c));
            
            section.items.forEach(item => {
                if (item.type === 'list-item') {
                    const match = item.content.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
                    if (match) {
                        const skillRow = document.createElement('div');
                        skillRow.className = 'skill-row';
                        
                        const h3 = document.createElement('h3');
                        h3.className = 'skill-title';
                        h3.innerHTML = match[1];
                        skillRow.appendChild(h3);

                        const pipe = document.createElement('span');
                        pipe.className = 'pipe-sep';
                        pipe.innerHTML = '<svg viewBox="0 0 6 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><line x1="3" y1="2" x2="3" y2="22"></line></svg>';
                        skillRow.appendChild(pipe);

                        const skillList = document.createElement('div');
                        skillList.className = 'skill-list';
                        skillList.innerHTML = match[2].split('•').map((sItem, idx, arr) => {
                            return `<span class="skill-item-text">${parseMarkdownFormatting(sItem.trim())}</span>${idx < arr.length - 1 ? '<span class="skill-dot">•</span>' : ''}`;
                        }).join('');
                        
                        skillRow.appendChild(skillList);
                        listContainer.appendChild(skillRow);
                    } else {
                        const p = document.createElement('p');
                        p.className = 'section-text';
                        p.innerHTML = parseMarkdownFormatting(item.content);
                        listContainer.appendChild(p);
                    }
                } else if (item.type === 'divider') {
                    const hr = document.createElement('hr');
                    hr.className = 'section-divider';
                    listContainer.appendChild(hr);
                } else if (item.type === 'paragraph') {
                    const p = document.createElement('p');
                    p.className = 'section-text';
                    p.innerHTML = parseMarkdownFormatting(item.content);
                    listContainer.appendChild(p);
                }
            });
            secElement.appendChild(listContainer);
        } else if (layout === 'education') {
            const listContainer = document.createElement('div');
            listContainer.className = 'education-container';
            if (section.classes) section.classes.forEach(c => listContainer.classList.add(c));

            section.items.forEach(item => {
                if (item.type === 'list-item') {
                    const parts = item.content.split('|').map(p => p.trim());
                    const eduRow = document.createElement('div');
                    eduRow.className = 'edu-row';
                    eduRow.innerHTML = parts.map((part, idx) => {
                        const parsed = parseMarkdownFormatting(part);
                        return idx === 0 ? `<span class="edu-title">${parsed}</span>` : parsed.replace(/class="font-normal"/g, 'class="edu-bold"');
                    }).join('<span class="pipe-sep"><svg viewBox="0 0 6 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><line x1="3" y1="2" x2="3" y2="22"></line></svg></span>');
                    listContainer.appendChild(eduRow);
                } else if (item.type === 'divider') {
                    const hr = document.createElement('hr');
                    hr.className = 'section-divider';
                    listContainer.appendChild(hr);
                } else if (item.type === 'paragraph') {
                    const p = document.createElement('p');
                    p.className = 'section-text';
                    p.innerHTML = parseMarkdownFormatting(item.content);
                    listContainer.appendChild(p);
                }
            });
            secElement.appendChild(listContainer);
        } else if (layout === 'achievements') {
            const list = document.createElement('ul');
            list.className = 'achievement-list';
            if (section.classes) section.classes.forEach(c => list.classList.add(c));

            section.items.forEach(item => {
                if (item.type === 'list-item') {
                    const li = document.createElement('li');
                    li.className = 'achievement-item';
                    li.innerHTML = parseMarkdownFormatting(item.content);
                    list.appendChild(li);
                } else if (item.type === 'divider') {
                    const hr = document.createElement('hr');
                    hr.className = 'section-divider';
                    list.appendChild(hr);
                } else if (item.type === 'paragraph') {
                    const li = document.createElement('li');
                    li.className = 'achievement-item';
                    li.style.listStyleType = 'none';
                    li.innerHTML = parseMarkdownFormatting(item.content);
                    list.appendChild(li);
                }
            });
            secElement.appendChild(list);
        } else {
            let bulletList = null;
            section.items.forEach(item => {
                if (item.type === 'list-item') {
                    if (!bulletList) {
                        bulletList = document.createElement('ul');
                        bulletList.className = 'bullet-list';
                        if (section.classes) section.classes.forEach(c => bulletList.classList.add(c));
                        secElement.appendChild(bulletList);
                    }
                    const li = document.createElement('li');
                    li.className = 'bullet-item';
                    li.innerHTML = parseMarkdownFormatting(item.content);
                    bulletList.appendChild(li);
                } else {
                    bulletList = null;
                    if (item.type === 'paragraph') {
                        const p = document.createElement('p');
                        p.className = 'section-text';
                        p.innerHTML = parseMarkdownFormatting(item.content);
                        secElement.appendChild(p);
                    } else if (item.type === 'divider') {
                        const hr = document.createElement('hr');
                        hr.className = 'section-divider';
                        secElement.appendChild(hr);
                    }
                }
            });
        }

        container.appendChild(secElement);
    });

    autoAdjustSpacing(container);
}

function getSectionLayout(section) {
    if (section.classes) {
        if (section.classes.includes('experience') || section.classes.includes('projects') || section.classes.includes('experience-layout')) return 'experience';
        if (section.classes.includes('skills') || section.classes.includes('skills-layout')) return 'skills';
        if (section.classes.includes('education') || section.classes.includes('edu') || section.classes.includes('edu-layout')) return 'education';
        if (section.classes.includes('achievements') || section.classes.includes('list-layout')) return 'achievements';
    }

    if (section.items.some(item => item.type === 'subsection')) return 'experience';
    if (section.items.some(item => item.type === 'list-item' && item.content.match(/^\*\*(.*?)\*\*:\s*(.*•.*|.*)$/) && item.content.includes('•'))) return 'skills';
    if (section.items.some(item => item.type === 'list-item' && item.content.includes('|'))) return 'education';

    if (section.key === 'experience' || section.key === 'projects') return 'experience';
    if (section.key === 'skills' || section.key === 'technical skills') return 'skills';
    if (section.key === 'education') return 'education';
    if (section.key === 'achievements') return 'achievements';
    return 'default';
}
