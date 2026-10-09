
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#register-form");
    const loginForm = document.querySelector("#login-form");
    const message = document.querySelector("#form-message");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fullName = document.querySelector("#full_name").value.trim();
            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password").value;

            message.textContent = "Creating account...";

            const { data, error } = await window.sb.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName }
                }
            });

            if (error) {
                message.textContent = error.message;
                return;
            }

            if (data.session) {
                window.location.href = "dashboard.html";
            } else {
                message.textContent =
                    "Account created. Check your email to confirm your account, then log in.";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password").value;

            message.textContent = "Logging in...";

            const { error } = await window.sb.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                message.textContent = "Login failed. Check your credentials and try again.";
                return;
            }

            window.location.href = "dashboard.html";
        });
    }
});
