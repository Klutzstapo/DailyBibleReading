document.addEventListener('DOMContentLoaded', () => {
    const currentDateElement = document.getElementById('current-date');
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    currentDateElement.textContent = formattedDate;

    fetch('bible_readings.csv')
        .then(response => response.text())
        .then(data => {
            const readings = parseCSV(data);
            const todayReadings = readings.find(row => row.date === formattedDate);
            if (todayReadings) {
                fetchBibleVerse('torah', todayReadings.torah);
                fetchBibleVerse('history', todayReadings.history);
                fetchBibleVerse('prophets', todayReadings.prophets);
                fetchBibleVerse('proverbs', todayReadings.proverbs);
                fetchBibleVerse('psalms', todayReadings.psalms);
                fetchBibleVerse('gospel', todayReadings.gospel);
                fetchBibleVerse('epistles', todayReadings.epistles);
                fetchBibleVerse('revelation', todayReadings.revelation);
            }
        });
});

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim().toLowerCase()] = values[index].trim();
        });
        return row;
    });
}

function fetchBibleVerse(boxId, reference) {
    const apiKey = 'b730d029f8d85da0dc693dbfa3a9e88e'; // Replace with your API.Bible key
    const apiUrl = `https://api.scripture.api.bible/v1/bibles/YOUR_BIBLE_ID/passages/${reference}?content-type=text`;

    fetch(apiUrl, {
        headers: {
            'api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const verseText = data.data.content;
        document.querySelector(`#${boxId} .verse`).innerHTML = verseText;
    })
    .catch(error => console.error('Error fetching Bible verse:', error));
}
