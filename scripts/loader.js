document.addEventListener('DOMContentLoaded', () => {
    fetch('docs/resume.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch docs/resume.md');
            }
            return response.text();
        })
        .catch(error => {
            // fallback if fetch fails
            console.warn('docs/resume.md not found or failed to load. Falling back to docs/info.md...', error);
            return fetch('docs/info.md')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch both docs/resume.md and docs/info.md');
                    }
                    return response.text();
                });
        })
        .then(mdText => {
            const resumeData = parseResumeMarkdown(mdText);
            renderResume(resumeData);
        })
        .catch(error => {
            console.error('Error loading resume:', error);
            document.getElementById('resume-container').innerHTML = `
                <div style="text-align: center; color: #888; padding: 20px 0; font-size: 13px;">
                    Could not load resume.
                </div>
            `;
        });
});
