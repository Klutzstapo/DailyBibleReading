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
                fetchBibleChapter('torah', todayReadings.torah);
                fetchBibleChapter('history', todayReadings.history);
                fetchBibleChapter('prophets', todayReadings.prophets);
                fetchBibleChapter('proverbs', todayReadings.proverbs);
                fetchBibleChapter('psalms', todayReadings.psalms);
                fetchBibleChapter('gospel', todayReadings.gospel);
                fetchBibleChapter('epistles', todayReadings.epistles);
                fetchBibleChapter('revelation', todayReadings.revelation);
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

function fetchBibleChapter(boxId, reference) {
    const apiKey = 'b730d029f8d85da0dc693dbfa3a9e88e'; // Replace with your API.Bible key
    const bibleId = 'de4e12af7f28f599-01'; // Replace with the specific Bible version ID
    const apiUrl = `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${reference}`;

    fetch(apiUrl, {
        headers: {
            'api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const chapterText = data.data.content;
        document.querySelector(`#${boxId} .verse`).innerHTML = chapterText;
    })
    .catch(error => console.error('Error fetching Bible chapter:', error));
}
