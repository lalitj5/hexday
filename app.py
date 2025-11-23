from flask import Flask, jsonify, request
from flask_cors import CORS
from backend import database

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "Hello World"

@app.route("/api/user/<username>", methods=["GET"])
def get_or_create_user(username):
    user = database.get_user(username)
    if user  == None:
        database.create_new_user(username)
        user = database.get_user(username)
    return jsonify(user)

@app.route("/api/user/<username>/trips", methods=["GET"])
def get_user_trips(username):
    user = database.get_user(username)
    if user == None:
        return jsonify({"error": "User not found"}), 404

    trips = database.get_user_trips(user["user_id"])
    return jsonify(trips)

@app.route("/api/trip", methods=["POST"])
def create_trip():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    trip_id = database.create_new_trip(user_id)
    trip = database.get_trip(trip_id)
    return jsonify(trip)

if __name__ == "__main__":
    app.run(debug=True)