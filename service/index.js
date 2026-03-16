const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());

const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const path = require('path');

const DB = require('./database.js');

const { peerProxy } = require('./peerWS.js');


async function createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        id: uuid.v4(),
        username: username,
        password: passwordHash,
        library: [],
    };

    await DB.addUser(user);

    return user;
}

async function getUser(field, value) {
    return await DB.getUser(field, value)
}

async function setAuthCookie(res, user) {
    user.token = uuid.v4();

    await DB.updateUser(user)

    res.cookie("token", user.token, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
    });
}

function clearAuthCookie(res, user) {
    const pulledUser = getUser("token", user.token)
    delete pulledUser.token;
    DB.updateUser(pulledUser)
    res.clearCookie("token");
}

// registration
app.post("/api/auth", async (req, res) => {
    if (await getUser("username", req.body.username)) {
        res.status(409).send({ msg: "Existing user" });
    } else {
        const user = await createUser(req.body.username, req.body.password);

        await setAuthCookie(res, user);

        res.status(200).send({ username: user.username });
    }
});

// login
app.put("/api/auth", async (req, res) => {
    const user = await getUser("username", req.body.username);
    if (!user) {
        res.status(403).send({ msg: "User not registered" });
    } else {
        if (await bcrypt.compare(req.body.password, user.password)) {
            await setAuthCookie(res, user);

            res.status(200).send({ username: user.username });
        } else {
            res.status(401).send({ msg: "Incorrect Password" });
        }
    }
});

// change password
app.put("/api/update/pass", async (req, res) => {
    try {
        const token = req.cookies["token"];
        const user = await getUser("token", token);

        if (!user) {
            res.status(402).send({ error: "Invalid token or user not found." });
        } else {
            user.password = bcrypt.hash(
                req.body.password,
                10,
            );

            await DB.updateUser(user)

            res.status(200).send({ msg: "Password updated successfully" });
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send({ error: "An internal server error occurred." });
    }
});

// change username
app.put("/api/update/user", async (req, res) => {
    try {
        if (await getUser("username", req.body.username)) {
            res.status(409).send({ msg: "Existing user" });
        } else {
            const token = req.cookies["token"];
            const user = await getUser("token", token);

            if (!user) {
                return res
                    .status(402)
                    .send({ error: "Invalid token or user not found." });
            } else {
                user.username = req.body.username;

                await DB.updateUser(user)

                res.status(200).send({ msg: "Username updated successfully" });
            }
        }
    } catch (error) {
        console.error("Error updating username:", error);
        res.status(500).send({ error: "An internal server error occurred." });
    }
});

// logout
app.delete("/api/auth", async (req, res) => {
    const token = req.cookies["token"];
    const user = await getUser("token", token);
    if (user) {
        clearAuthCookie(res, user);
    }

    res.status(200).send({});
});

// getMe
app.get("/api/user/me", async (req, res) => {
    const token = req.cookies["token"];
    const user = await getUser("token", token);
    if (user) {
        res.status(200).send({ username: user.username });
    } else {
        res.status(401).send({ msg: "Unauthorized" });
    }
});

// delete user
app.delete("/api/user", async (req, res) => {
    const token = req.cookies["token"];
    const user = await getUser("token", token);
    if (user) {
        clearAuthCookie(res, user);
        await DB.deleteUser(user)
        res.status(200).send({});
    } else {
        res.status(402).send({ msg: "Invalid token or user not found." });
    }
});

// get library
app.get("/api/library", async (req, res) => {
    const token = req.cookies["token"];
    const user = await getUser("token", token);
    if (!user) {
        res.status(401).send({ msg: "Unauthorized" });
    } else {
        res.status(200).send({ library: JSON.stringify(await DB.getLibrary(user)) });
    }
});

// add to library
app.put("/api/library", async (req, res) => {
    const token = req.cookies["token"];
    const user = await getUser("token", token);
    if (!user) {
        res.status(401).send({ msg: "Unauthorized" });
    } else {
        user.library.push(req.body)
        await DB.updateUser(user)
        await DB.sortLibraryInDB(user)

        res.status(200).send({ msg: "Library updated" });
    }
});

// remove from library
app.delete("/api/library", async (req, res) => {
    const token = req.cookies["token"];
    const user = await getUser("token", token);
    if (!user) {
        res.status(401).send({ msg: "Unauthorized" });
    } else {
        user.library.splice(req.body.index, 1);
        await DB.updateUser(user)

        res.status(200).send({ msg: "Library updated" });
    }
});

app.get('/library', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/feed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const httpService = app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

peerProxy(httpService);