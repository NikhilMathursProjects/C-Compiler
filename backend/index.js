require("dotenv").config();
const express = require('express');
const cors=require("cors");
const { generatefile, executeCppBinary } = require('./generatefile'); // Import executeCppBinary function
const { NIL } = require('uuid');

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT=process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.json({ hello: "world!" }); // Corrected the response message
});

app.post("/run", async (req, res) => {
    const { language = "cpp", code } = req.body;
    if (code == undefined) {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }
    try {
        const filepath = await generatefile(language, code);
        executeCppBinary(filepath, (error, output) => {
            if (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
            return res.json({ success: true, output });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port",PORT);
});