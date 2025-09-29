const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Replace this with your Power Automate flow URL
const POWER_AUTOMATE_URL = "https://defaultead220ab17434c5783aee055f3401f.19.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/12ac885bad114297ae64f17b2c1ba3f8/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=a1o999QCBgpFP7C8E_a5xwd9TlyTCYxUFH9mbmw1hNc";

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/webhook", async (req, res) => {
    try {
        console.log("Received from Twilio:", req.body);

        const response = await axios.post(POWER_AUTOMATE_URL, req.body, {
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
