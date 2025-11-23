from pymongo import MongoClient
import uuid

# Replace with your connection string
uri = "mongodb+srv://kxiang644:HexDays@cluster0.cpcw8iv.mongodb.net/"
client = MongoClient(uri)

# Access a database
db = client["vacation_scrapbook"]

# Access a collection
user_collection = db["users"]
trip_collection = db["trips"]
media_collection = db["media"]

def generate_id():
    return str(uuid.uuid4())

def create_new_user(username): 
    # Check that the user does not exist
    if user_collection.find_one({"username": username}):
        raise Exception("User has been taken!")
    user_collection.insert_one(
        {
            "username": username,
            "user_id": generate_id(),
            "profile_photo_id": 0,
            "trips": []
        }
    )

def get_user(username):
    user = user_collection.find_one({"username": username}, {"_id": 0})
    return user

def get_user_trips(user_id):
    trips = list(trip_collection.find({"user_id": user_id}, {"_id": 0}))
    return trips

def get_trip(trip_id):
    trip = trip_collection.find_one({"trip_id": trip_id}, {"_id": 0})
    return trip

def create_new_trip(user_id):
    new_trip_id = generate_id()
    trip_collection.insert_one(
        {
            "name": "Untitled Trip",
            "trip_id": new_trip_id,
            "user_id": user_id,
            "photos": [],
            "locations": []
        }
    )

    user_collection.update_one({"user_id": user_id}, {"$push": {"trips": new_trip_id}})
    return new_trip_id

def add_location(trip_id, location_details):
    location_details["location_id"] = generate_id()
    trip_collection.update_one({"trip_id": trip_id}, {"$push": {"locations": location_details}})

def update_location(trip_id, location_id, location_details):
    trip_collection.update_one({"trip_id": trip_id, "locations.location_id": location_id}, {"$set": {"locations.$": location_details}})

def add_photos(trip_id, photo_url):
    trip_collection.update_one({"trip_id": trip_id}, 
                                {"$push": {"photos": photo_url}})

# Create unique indexs
# user_collection.create_index("user_id", unique=True)
# trip_collection.trip_index("user_id", unique=True)