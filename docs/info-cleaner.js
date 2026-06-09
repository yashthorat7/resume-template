// removes any credentials from the info.md file (ai generated file)

const fs = require('fs');
const path = require('path');

function main() {
    const infoPath = path.join(__dirname, 'info.md');

    if (!fs.existsSync(infoPath)) {
        console.error(`Error: Could not find '${infoPath}'`);
        process.exit(1);
    }

    console.log(`Reading ${infoPath}...`);
    let content = fs.readFileSync(infoPath, 'utf8');

    let cleaned = content.replace(/tel:\+?\d+/g, 'tel:+910000000000');
    cleaned = cleaned.replace(/\+91\d{10}/g, '+910000000000');
    cleaned = cleaned.replace(/\b[6-9]\d{9}\b/g, '0000000000');

    cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'dummyemail@gmail.com');

    cleaned = cleaned.replace(/https:\/\/[^\s)\]]+/g, 'https://github.com/yashthorat7');

    let inEducation = false;
    const lines = cleaned.split('\n');
    const processedLines = lines.map(line => {
        if (line.startsWith('## Education')) {
            inEducation = true;
        } else if (inEducation && line.startsWith('##')) {
            inEducation = false;
        }

        if (inEducation) {
            line = line.replace(/CGPA\s*[-:]\s*\d+(?:\.\d+)?/gi, 'CGPA - 0.0');
            line = line.replace(/\d+(?:\.\d+)?%/g, '00%');
        }
        return line;
    });
    cleaned = processedLines.join('\n');

    fs.writeFileSync(infoPath, cleaned, 'utf8');

    console.log("🧹 Successfully cleaned info.md! 📞 📧 🔗 🎓");
}

main();
