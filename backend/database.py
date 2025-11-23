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




def create_new_trip(user_id):
    new_trip_id = generate_id()
    trip_collection.insert_one(
        {
            "name": "Untitled Trip",
            "trip_id": new_trip_id,
            "user_id": user_id,
            "photos": []
        }
    )

    user_collection.update_one({"user_id": user_id}, {"$push": {"trips": new_trip_id}})



# Create a unique index on user_id
# user_collection.create_index("user_id", unique=True)

print("Connected!") 