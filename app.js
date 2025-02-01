document.addEventListener("DOMContentLoaded", function() {
    // Token Validation Form submission
    document.getElementById("tokenForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let tokenInput = document.getElementById("tokenInput").value;
        let fileInput = document.getElementById("tokenFile").files[0];
        if (fileInput) {
            validateTokensFromFile(fileInput);
        } else {
            validateToken(tokenInput);
        }
    });

    // Cookie Validation Form submission
    document.getElementById("cookieForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let cookieInput = document.getElementById("cookieInput").value;
        let cookieFileInput = document.getElementById("cookieFile").files[0];
        if (cookieFileInput) {
            validateCookiesFromFile(cookieFileInput);
        } else {
            validateCookie(cookieInput);
        }
    });

    // Group Chat UID Finder Form submission
    document.getElementById("gcForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let gcToken = document.getElementById("gcToken").value;
        fetchGroupChats(gcToken);
    });
});

// Token Validation (Single Token)
function validateToken(token) {
    // Replace with actual API request
    fetch(`https://graph.facebook.com/v17.0/me?access_token=${token}`)
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                displayResult("Token is valid: " + data.name, "success");
            } else {
                displayResult("Invalid Token", "error");
            }
        })
        .catch(() => displayResult("Invalid Token", "error"));
}

// Validate Tokens from file
function validateTokensFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const tokens = event.target.result.split("\n");
        tokens.forEach((token, index) => {
            validateToken(token.trim());
        });
    };
    reader.readAsText(file);
}

// Cookie Validation (Single Cookie)
function validateCookie(cookie) {
    // Replace with actual API request
    fetch("https://business.facebook.com/business_locations", {
        headers: {
            "Cookie": cookie,
            "User-Agent": "Mozilla/5.0"
        }
    })
        .then(response => response.text())
        .then(data => {
            if (data.includes("business")) {
                displayResult("Valid Cookie", "success");
            } else {
                displayResult("Invalid Cookie", "error");
            }
        })
        .catch(() => displayResult("Invalid Cookie", "error"));
}

// Validate Cookies from file
function validateCookiesFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const cookies = event.target.result.split("\n");
        cookies.forEach((cookie, index) => {
            validateCookie(cookie.trim());
        });
    };
    reader.readAsText(file);
}

// Group Chat Finder
function fetchGroupChats(token) {
    fetch(`https://graph.facebook.com/v17.0/me/conversations?access_token=${token}&fields=id,name`)
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                displayGroupChats(data.data);
            } else {
                displayResult("Failed to fetch Group Chats", "error");
            }
        })
        .catch(() => displayResult("Failed to fetch Group Chats", "error"));
}

// Display Results
function displayResult(message, type) {
    const resultBox = document.getElementById("resultBox");
    resultBox.innerHTML = `<div class="result ${type}">${message}</div>`;
}

// Display Group Chats
function displayGroupChats(groups) {
    const resultBox = document.getElementById("resultBox");
    resultBox.innerHTML = "<h3>Group Chats Found:</h3>";
    groups.forEach(group => {
        const groupElement = document.createElement("div");
        groupElement.innerHTML = `<p>Name: ${group.name} | UID: ${group.id}</p>`;
        resultBox.appendChild(groupElement);
    });
}
