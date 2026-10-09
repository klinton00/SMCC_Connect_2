
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector("#latest-announcements");

    const { data, error } = await window.sb
        .from("announcements")
        .select("id, title, content, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

    if (error) {
        container.textContent = "Announcements are temporarily unavailable.";
        return;
    }

    container.replaceChildren();

    if (!data.length) {
        container.textContent = "No announcements yet.";
        return;
    }

    data.forEach((item) => {
        const card = document.createElement("article");
        card.className = "feature-card";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const content = document.createElement("p");
        content.textContent = item.content;

        const date = document.createElement("small");
        date.textContent = new Date(item.created_at).toLocaleDateString();

        card.append(title, content, date);
        container.append(card);
    });
});
