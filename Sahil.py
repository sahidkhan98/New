from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Function to check Facebook token validity
def check_facebook_token(token):
    url = "https://graph.facebook.com/v17.0/me"
    params = {"access_token": token, "fields": "name,id,birthday,email"}
    response = requests.get(url, params=params)
    data = response.json()

    if "id" in data:
        return {
            "status": "valid",
            "name": data.get("name", "N/A"),
            "id": f"https://facebook.com/{data['id']}",
            "dob": data.get("birthday", "N/A"),
            "email": data.get("email", "N/A")
        }
    return {"status": "invalid"}

# Function to check Facebook cookies validity
def check_facebook_cookies(cookie):
    url = "https://business.facebook.com/business_locations"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Cookie": cookie
    }
    response = requests.get(url, headers=headers)
    return "Set-Cookie" in response.headers or "facebook.com" in response.text

# Function to get GC UIDs with Names
def get_group_chats(access_token):
    url = "https://graph.facebook.com/v17.0/me/conversations"
    params = {"access_token": access_token, "fields": "id,name"}
    response = requests.get(url, params=params)
    data = response.json()

    def get_group_name(group_id, token):
        group_url = f"https://graph.facebook.com/v17.0/{group_id}"
        res = requests.get(group_url, {"access_token": token, "fields": "name"}).json()
        return res.get("name", f"Group {group_id}")

    gc_list = []
    if "data" in data:
        for chat in data["data"]:
            chat_id = chat["id"].replace("t_", "")
            chat_name = chat.get("name", get_group_name(chat_id, access_token))
            gc_list.append({"name": chat_name, "uid": chat_id})
    
    return gc_list

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_token', methods=['POST'])
def check_token():
    token_input = request.form.get('token')
    
    if not token_input:
        return jsonify({"status": "error", "message": "Token required!"})

    tokens = token_input.strip().split("\n")
    results = [check_facebook_token(token.strip()) for token in tokens]

    return jsonify({"status": "success", "data": results})

@app.route('/check_cookie', methods=['POST'])
def check_cookie():
    cookie_input = request.form.get('cookie')

    if not cookie_input:
        return jsonify({"status": "error", "message": "Cookie required!"})

    cookies = cookie_input.strip().split("\n")
    results = [{"cookie": c, "status": "valid" if check_facebook_cookies(c) else "invalid"} for c in cookies]

    return jsonify({"status": "success", "data": results})

@app.route('/find_gc', methods=['POST'])
def find_gc():
    access_token = request.form.get('token')

    if not access_token:
        return jsonify({"status": "error", "message": "Token required!"})

    gc_list = get_group_chats(access_token)

    return jsonify({"status": "success", "data": gc_list} if gc_list else {"status": "error", "message": "No group chats found!"})

if __name__ == '__main__':
    app.run(debug=True)
