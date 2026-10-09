
document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector("#profile-form");
    const nameInput = document.querySelector("#full_name");
    const status = document.querySelector("#profile-status");

    const { data: sessionData } = await window.sb.auth.getSession();
    const session = sessionData.session;

    if (!session) {
        window.location.replace("login.html");
        return;
    }

    document.querySelector("#profile-email").textContent =
        session.user.email || "";

    document.querySelector("#profile-id").textContent = session.user.id;

    const { data: profile, error } = await window.sb
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .maybeSingle();

    if (error) {
        status.textContent = "Unable to load your profile.";
        return;
    }

    nameInput.value = profile?.full_name || "";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fullName = nameInput.value.trim();

        if (!fullName) {
            status.textContent = "Please enter your name.";
            return;
        }

        status.textContent = "Saving...";

        const { error: updateError } = await window.sb
            .from("profiles")
            .update({ full_name: fullName })
            .eq("id", session.user.id);

        if (updateError) {
            status.textContent = "Unable to save changes.";
            return;
        }

        status.textContent = "Profile updated successfully.";
    });
});
