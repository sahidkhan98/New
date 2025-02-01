// Token Checker
document.getElementById("tokenForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const token = document.getElementById("token").value;
    const tokenFile = document.getElementById("multiTokenFile").files[0];

    if (token) {
        checkToken(token);
    } else if (tokenFile) {
        handleTokenFile(tokenFile);
    }
});

function checkToken(token) {
    const url = `https://graph.facebook.com/v17.0/me?access_token=${token}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = document.getElementById("tokenResult");
            if (data.error) {
                result.innerHTML = `<p class="error">❌ Invalid Token</p>`;
            } else {
                result.innerHTML = `<p>✅ Valid Token: ${data.name}</p>`;
            }
        })
        .catch(err => console.error(err));
}

function handleTokenFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const tokens = e.target.result.split("\n");
        tokens.forEach(token => checkToken(token.trim()));
    };
    reader.readAsText(file);
}

// Cookie Checker
document.getElementById("cookieForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const cookie = document.getElementById("cookie").value;
    const cookieFile = document.getElementById("multiCookieFile").files[0];

    if (cookie) {
        checkCookie(cookie);
    } else if (cookieFile) {
        handleCookieFile(cookieFile);
    }
});

function checkCookie(cookie) {
    const url = "https://business.facebook.com/business_locations";
    const headers = {
        "User-Agent": "Mozilla/5.0",
        "Cookie": cookie
    };
    fetch(url, { headers })
        .then(response => response.text())
        .then(data => {
            const result = document.getElementById("cookieResult");
            if (data.includes("facebook.com")) {
                result.innerHTML = `<p>✅ Valid Cookie</p>`;
            } else {
                result.innerHTML = `<p class="error">❌ Invalid Cookie</p>`;
            }
        })
        .catch(err => console.error(err));
}

function handleCookieFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const cookies = e.target.result.split("\n");
        cookies.forEach(cookie => checkCookie(cookie.trim()));
    };
    reader.readAsText(file);
}

// GC UID Finder
document.getElementById("gcForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const token = document.getElementById("gcToken").value;
    if (token) {
        findGC(token);
    }
});

function findGC(token) {
    const url = `https://graph.facebook.com/v17.0/me/conversations?access_token=${token}&fields=id,name`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const result = document.getElementById("gcResult");
            if (data.data) {
                let html = '<ul>';
                data.data.forEach(chat => {
                    const chatId = chat.id.replace("t_", ""); // Format UID
                    html += `<li><a href="https://m.me/${chatId}" target="_blank">${chat.name || "Unnamed Group"} | UID: ${chatId}</a></li>`;
                });
                html += '</ul>';
                result.innerHTML = html;
            } else {
                result.innerHTML = `<p class="error">❌ Failed to fetch Group Chats</p>`;
            }
        })
        .catch(err => console.error(err));
                  }
