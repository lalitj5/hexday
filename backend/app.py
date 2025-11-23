from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import database
from io import BytesIO
from bson import ObjectId

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

@app.route("/api/trip/<trip_id>/photos", methods=["POST"])
def upload_photos(trip_id):
    if 'photos' not in request.files:
        return jsonify({"error": "No photos provided"}), 400

    files = request.files.getlist('photos')

    if not files or len(files) == 0:
        return jsonify({"error": "No photos provided"}), 400

    uploaded_ids = []
    for file in files:
        if file.filename == '':
            continue

        try:
            file_id = database.add_photos(trip_id, file)
            uploaded_ids.append(str(file_id))
        except Exception as e:
            print(f"Error uploading file {file.filename}: {e}")
            continue

    trip = database.get_trip(trip_id)
    return jsonify({
        "success": True,
        "uploaded_count": len(uploaded_ids),
        "trip": trip
    })

@app.route("/api/photo/<file_id>", methods=["GET"])
def get_photo(file_id):
    try:
        file_data = database.get_photo(ObjectId(file_id))
        if file_data is None:
            return jsonify({"error": "Photo not found"}), 404

        return send_file(
            BytesIO(file_data['data']),
            mimetype=file_data.get('content_type', 'image/jpeg'),
            download_name=file_data.get('filename', 'photo.jpg')
        )
    except Exception as e:
        print(f"Error retrieving photo: {e}")
        return jsonify({"error": "Failed to retrieve photo"}), 500

if __name__ == "__main__":
    app.run(debug=True)