const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Replace this with your Power Automate flow URL
const POWER_AUTOMATE_URL = "https://prod-114.westeurope.logic.azure.com:443/workflows/12ac885bad114297ae64f17b2c1ba3f8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=raw5V48x6ysBmTA67EGRFt1HllfPVCoXy43kmeioYuY";

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/webhook", async (req, res) => {
    try {
        console.log("Received from Twilio (body):", req.body);
        console.log("Received query params:", req.query); // 👈 Add this

        // Merge Twilio POST body + your custom query params
        const mergedData = {
            ...req.body,
            ...req.query,   // 👈 this adds casenumber and any other custom vars
        };

        const response = await axios.post(POWER_AUTOMATE_URL, mergedData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        console.log("Forwarded to Power Automate:", response.status);
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error forwarding to Power Automate:", error.message);
        res.status(500).send("Forwarding failed");
    }
});


app.get("/", (req, res) => {
    res.send("Twilio → Power Automate Relay is running.");
});

app.listen(port, () => {
    console.log(`Relay server running on port ${port}`);
});
