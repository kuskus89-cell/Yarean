//For login form submission (if you have a login form in your welcoming.html)
// Select form
const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Form submitted");
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop page refresh

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    // Simple validation
    if (email === "" || password === "") {
        message.style.color = "red";
        message.textContent = "Please fill in all fields.";
        return;
    }

    // Fake stored user (for demo)
    const storedEmail = "admin@gmail.com";
    const storedPassword = "123456";

    if (email === storedEmail && password === storedPassword) {
        message.style.color = "green";
        message.textContent = "Login successful! Redirecting...";

        // Save login status
        localStorage.setItem("isLoggedIn", "true");

        setTimeout(() => {
            window.location.href = "index.html"; // redirect to homepage
        }, 1500);
    } else {
        message.style.color = "red";
        message.textContent = "Invalid email or password.";
    }
});