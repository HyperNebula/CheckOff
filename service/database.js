const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connect to database`);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
})();

module.exports = {
    addUser,
    getUser,
    updateUser,
    deleteUser,
    getLibrary,
    sortLibraryInDB
};

async function addUser(user) {
    await userCollection.insertOne(user);
}

async function getUser(field, value) {
    return userCollection.findOne({ [field]: value });
}

async function updateUser(user) {
  await userCollection.updateOne({ id: user.id }, { $set: user });
}

async function deleteUser(user) {
  await userCollection.deleteOne({ id: user.id });
}

async function getLibrary(user) {
    const results = await userCollection.aggregate([
        { $match: { id: user.id } }, 
        {
            $project: {
                library: {
                    $sortArray: {
                        input: "$library",
                        sortBy: { dateViewed: -1 }
                    }
                }
            }
        }
    ]).toArray();
    return results[0].library
}

async function sortLibraryInDB(user) {
    await userCollection.updateOne(
        { id: user.id },
        [
            {
                $set: {
                    library: {
                        $sortArray: {
                            input: "$library",
                            sortBy: { dateViewed: -1 }
                        }
                    }
                }
            }
        ]
    );
}