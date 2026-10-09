
document.addEventListener("DOMContentLoaded", async () => {
    const list = document.querySelector("#messages-list");
    const form = document.querySelector("#message-form");
    const status = document.querySelector("#message-status");

    const { data: sessionData } = await window.sb.auth.getSession();
    const session = sessionData.session;

    if (!session) {
        window.location.replace("login.html");
        return;
    }

    async function loadMessages() {
        list.textContent = "Loading messages...";

        const { data, error } = await window.sb
            .from("messages")
            .select("id, sender_id, recipient_id, content, created_at")
            .order("created_at", { ascending: false })
            .limit(100);

        if (error) {
            list.textContent = "Unable to load messages.";
            return;
        }

        list.replaceChildren();

        if (!data.length) {
            list.textContent = "No messages yet.";
            return;
        }

        data.forEach((item) => {
            const card = document.createElement("article");
            card.className = "feature-card";

            const heading = document.createElement("h3");
            heading.textContent =
                item.sender_id === session.user.id
                    ? "You sent a message"
                    : "Message received";

            const content = document.createElement("p");
            content.textContent = item.content;

            const details = document.createElement("small");
            details.textContent =
                new Date(item.created_at).toLocaleString();

            card.append(heading, content, details);
            list.append(card);
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const recipientId = document.querySelector("#recipient").value.trim();
        const content = document.querySelector("#content").value.trim();

        if (!recipientId || !content) {
            status.textContent = "Enter a recipient and a message.";
            return;
        }

        status.textContent = "Sending...";

        const { error } = await window.sb
            .from("messages")
            .insert({
                sender_id: session.user.id,
                recipient_id: recipientId,
                content
            });

        if (error) {
            status.textContent =
                "Message failed. Check the recipient UUID and try again.";
            return;
        }

        form.reset();
        status.textContent = "Message sent successfully.";
        await loadMessages();
    });

    await loadMessages();
});
