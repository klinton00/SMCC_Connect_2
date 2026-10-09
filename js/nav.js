document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("#logout-button");

    if (!button || !window.sb) return;

    button.addEventListener("click", async () => {
        const { error } = await window.sb.auth.signOut();

        if (error) {
            alert("Unable to log out. Please try again.");
            return;
        }

        window.location.replace("index.html");
    });
});
