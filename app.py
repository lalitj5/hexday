from flask import Flask, jsonify, request
from backend import database

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello World"
if __name__ == "__main__":
    app.run(debug=True)

@app.route("/api/user/<username>", methods=["GET"])
def get_or_create_user(username):
    user = database.get_user(username)
    if user  == None:
        database.create_new_user(username)
        user = database.get_user(username)
    return jsonify(user)
    