// Wait for the DOM content to be loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get the form element by its ID
    const form = document.getElementById('diary-form');

    // Add event listener to handle the form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const userId = document.getElementById('user-id').value;
        const logDate = document.getElementById('log-date').value;
        const themeEntry = document.getElementById('theme-entry').value;
        const studyTime = document.getElementById('study-time').value;
        const diaryEntry = document.getElementById('diary-entry').value;

        // Prepare the data object to send in the POST request
        const formData = {
            "userId" : userId,
            "logDate": logDate,
            "themeEntry": themeEntry,
            "studyTime": studyTime,
            "diaryEntry": diaryEntry
        };

        try {
            const response = await fetch('https://sbci9hda6b.execute-api.us-east-2.amazonaws.com/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        
            console.log('Response:', response); // Log response for debugging
        
            if (response.ok) {
                const result = await response.json();
                console.log('Result:', result);
                alert('Diary entry logged successfully!');
                form.reset();
            } else {
                console.error('Error response:', response);
                alert('Failed to log diary entry. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error); // Log detailed error
            alert('An error occurred while submitting the form.');
        }
        
    });
});
