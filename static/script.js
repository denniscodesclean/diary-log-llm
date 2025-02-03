// Wait for the DOM content to be loaded
document.addEventListener('DOMContentLoaded', function () {
    // Form for landing page (username entry)
    const usernameForm = document.getElementById('username-form');
    usernameForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        if (username) {
            // Hide landing page and show the main page
            document.querySelector('.landing-page').style.display = 'none';
            document.querySelector('.main-page').style.display = 'flex';
        } else {
            alert('Please enter a valid username.');
        }
    });

    // Back to landing page button
    document.getElementById('back-to-landing').addEventListener('click', function() {
        document.querySelector('.main-page').style.display = 'none';
        document.querySelector('.landing-page').style.display = 'flex';
    });

    // Handling form submission on the main page
    const form = document.getElementById('diary-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const userId = document.getElementById('user-id').value;
        const logDate = document.getElementById('log-date').value;
        const themeEntry = document.getElementById('theme-entry').value;
        const studyTime = document.getElementById('study-time').value;
        const diaryEntry = document.getElementById('diary-entry').value;

        const formData = {
            userId : userId,
            logDate: logDate,
            themeEntry: themeEntry,
            studyTime: studyTime,
            diaryEntry: diaryEntry
        };

        try {
            const response = await fetch('https://sbci9hda6b.execute-api.us-east-2.amazonaws.com/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Diary logged, keep it going!');
                form.reset();
            } else {
                alert('Failed to log diary entry.');
            }
        } catch (error) {
            alert('Error submitting form.');
        }
    });

    // Tab functionality for Past Entries and LLM Analysis
    document.getElementById('past-entries-tab').addEventListener('click', function() {
        document.getElementById('past-entries').classList.add('active');
        document.getElementById('llm-analysis').classList.remove('active');
    });

    document.getElementById('llm-analysis-tab').addEventListener('click', function() {
        document.getElementById('llm-analysis').classList.add('active');
        document.getElementById('past-entries').classList.remove('active');
    });
});
