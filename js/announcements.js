
document.addEventListener("DOMContentLoaded", async () => {
    const list = document.querySelector("#announcements-list");

    const { data: sessionData } = await window.sb.auth.getSession();

    if (!sessionData.session) {
        window.location.replace("login.html");
        return;
    }

    const { data, error } = await window.sb
        .from("announcements")
        .select("id, title, content, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        list.textContent = "Unable to load announcements.";
        return;
    }

    list.replaceChildren();

    if (!data.length) {
        list.textContent = "There are no announcements yet.";
        return;
    }

    data.forEach((item) => {
        const article = document.createElement("article");
        article.className = "feature-card";

        const title = document.createElement("h2");
        title.textContent = item.title;

        const content = document.createElement("p");
        content.textContent = item.content;

        const date = document.createElement("small");
        date.textContent = new Date(item.created_at).toLocaleString();

        article.append(title, content, date);
        list.append(article);
    });
});
