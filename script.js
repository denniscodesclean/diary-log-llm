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
            userId : userId,
            logDate: logDate,
            themeEntry: themeEntry,
            studyTime: studyTime,
            diaryEntry: diaryEntry
        };

        // Add console.log to check the formData before sending
        console.log('Form data being sent:', formData);


        try {
            // Send the form data to the API Gateway using a POST request
            const response = await fetch('https://sbci9hda6b.execute-api.us-east-2.amazonaws.com/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Ensure data is sent as JSON
                },
                body: JSON.stringify(formData) // Convert form data to JSON string
            });

            // Check if the response was successful
            if (response.ok) {
                alert('Diary logged, keep it going!');
                form.reset(); // Optionally reset the form after successful submission
            } else {
                alert('Failed to log diary entry. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form.');
        }
    });
});
