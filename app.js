document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.querySelector('.btn-login');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get values
            const empId = document.getElementById('empId').value;
            const password = document.getElementById('password').value;

            // Simple validation
            if (empId && password) {
                // Change button state to simulate secure server connection
                const originalText = submitBtn.innerText;
                submitBtn.innerText = "Authenticating...";
                submitBtn.style.backgroundColor = "#1B5E20"; // Turns green during auth
                submitBtn.disabled = true;

                // Simulate network request and redirect
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000); 

            } else {
                alert("Please enter both your Employee ID and password.");
            }
        });
    }
});