function sendMessage() {
    const input = document.getElementById("userMsg");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    const typing = addMessage("Typing...", "bot");

    fetch("chatbot", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ message: msg })
    })
    .then(res => {
        // 🔴 If server error (500, 401, etc.)
        if (!res.ok) {
            throw new Error("Server error: " + res.status);
        }
        return res.json();
    })
    .then(data => {
        typing.remove();

        if (data.reply) {
            addMessage(data.reply, "bot");
        } else {
            addMessage("AI gave an empty response.", "bot");
        }
    })
    .catch(err => {
        typing.remove();
        console.error("Chatbot error:", err);

        // ✅ Only show offline for real failures
        addMessage("AI is temporarily unavailable. Please try again later 😔", "bot");
    });
}

function addMessage(text, type) {
    const chatBody = document.getElementById("chatBody");
    const div = document.createElement("div");
    div.className = "chat-message " + type;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
}

function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
}