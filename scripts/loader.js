document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('resume-container');
    if (!container) return;

    try {
        let mdText;
        try {
            const res = await fetch('docs/resume.md');
            if (!res.ok) throw new Error();
            mdText = await res.text();
        } catch {
            const res = await fetch('docs/info.md');
            if (!res.ok) throw new Error();
            mdText = await res.text();
        }

        const resumeData = parseResumeMarkdown(mdText);
        renderResume(resumeData);
    } catch (error) {
        console.error('Error loading resume:', error);
        container.innerHTML = `
            <div style="text-align: center; color: #888; padding: 20px 0; font-size: 13px;">
                Could not load resume.
            </div>
        `;
    }
});
