// Get the button by ID
const signUpBtn = document.getElementById('signUpBtn');

// Only run this if the button exists on the current page
if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
        // Redirect to your signup.html file
        window.location.href = 'SignUp.html';
    });
}