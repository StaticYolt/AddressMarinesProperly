import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

# Load environment variable
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("MONGO_URI environment variable is not set")

# Connect to MongoDB
client = MongoClient(mongo_uri, server_api=ServerApi("1"))
db = client["Marines"]  # Uses the DB name from URI

# Collections to export
rank_collections = {
    "PFC": db["PFC"],
    "LCpl": db["LCpl"],
    "Cpl": db["Cpl"],
    "Sgt": db["Sgt"],
    "SSgt": db["SSgt"],
    "GySgt": db["GySgt"],
    "MSgt": db["MSgt"],
    "1stSgt": db["1stSgt"],
    "MGySgt": db["MGySgt"],
    "SgtMaj": db["SgtMaj"],
    "SgtMajMC": db["SgtMajMC"],
    "WO1": db["WO1"],
    "CWO2": db["CWO2"],
    "CWO3": db["CWO3"],
    "CWO4": db["CWO4"],
    "CWO5": db["CWO5"],
    "2ndLt": db["2ndLt"],
    "1stLt": db["1stLt"],
    "Capt": db["Capt"],
    "Maj": db["Maj"],
    "LtCol": db["LtCol"],
    "Col": db["Col"],
    "BGen": db["BGen"],
    "MajGen": db["MajGen"],
    "LtGen": db["LtGen"],
    "Gen": db["Gen"]
}
print(rank_collections["PFC"])
# Create output directory
os.makedirs("data", exist_ok=True)

# Export each collection to a JSON file
for rank, collection in rank_collections.items():
    documents = list(collection.find({}, {"_id" : 0}))  # omit _id
    with open(f"data/{rank}.json", "w") as f:
        json.dump(documents, f, indent=2)

print("✅ Export complete: All collections written to 'data/' folder.")