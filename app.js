document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.querySelector('.btn-login');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if(email && password) {
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Authenticating...";
            submitBtn.style.backgroundColor = "#1B5E20"; 
            submitBtn.disabled = true;

            setTimeout(() => {
                console.log("Authentication successful for:", email);
                // Redirects to dashboard in the same folder
                window.location.href = "dashboard.html";
            }, 1000); 

        } else {
            alert("Please enter both email and password.");
        }
    });

});