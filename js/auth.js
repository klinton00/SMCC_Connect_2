document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#register-form");
    const loginForm = document.querySelector("#login-form");
    const message = document.querySelector("#form-message");

    if (!window.sb) {
        console.error("Supabase client is missing. Check supabase.js.");
        if (message) {
            message.textContent = "Connection error. Please refresh the page.";
        }
        return;
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fullName = document.querySelector("#full_name").value.trim();
            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password").value;

            message.textContent = "Creating account...";

            try {
                const { data, error } = await window.sb.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName }
                    }
                });

                if (error) throw error;

                if (data.session) {
                    window.location.href = "dashboard.html";
                } else {
                    message.textContent =
                        "Account created. Check your email to confirm your account, then log in.";
                }
            } catch (error) {
                message.textContent = error.message || "Registration failed.";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password").value;

            message.textContent = "Logging in...";

            try {
                const { error } = await window.sb.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                window.location.href = "dashboard.html";
            } catch (error) {
                message.textContent = error.message || "Login failed.";
            }
        });
    }
});