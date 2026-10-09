
document.addEventListener("DOMContentLoaded", async () => {
    const { data: sessionData } = await window.sb.auth.getSession();
    const session = sessionData.session;

    if (!session) {
        window.location.replace("login.html");
        return;
    }

    const { data: profile } = await window.sb
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .maybeSingle();

    document.querySelector("#welcome").textContent =
        `Welcome, ${profile?.full_name || session.user.email}!`;

    const container = document.querySelector("#dashboard-announcements");

    const { data, error } = await window.sb
        .from("announcements")
        .select("title, content, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {
        container.textContent = "Unable to load announcements.";
    } else if (!data.length) {
        container.textContent = "No announcements yet.";
    } else {
        data.forEach((item) => {
            const card = document.createElement("article");
            card.className = "feature-card";

            const title = document.createElement("h3");
            title.textContent = item.title;

            const content = document.createElement("p");
            content.textContent = item.content;

            card.append(title, content);
            container.append(card);
        });
    }

    document.querySelector("#logout-button").addEventListener("click", async () => {
        const { error } = await window.sb.auth.signOut();

        if (error) {
            alert("Unable to log out. Please try again.");
            return;
        }

        window.location.replace("index.html");
    });
});
    