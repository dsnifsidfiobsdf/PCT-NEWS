const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const baseDir = path.join(__dirname, '../client');

const server = http.createServer((req, res) => {

    // 🔥 FIX: bỏ query param
    let cleanUrl = req.url.split('?')[0];

    let filePath = path.join(baseDir, cleanUrl);

    if (cleanUrl === "/") {
        filePath = path.join(baseDir, 'index.html');
    }

    const ext = path.extname(filePath);

    const contentTypeMap = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon"
    };

    const contentType = contentTypeMap[ext] || "text/plain";

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("404 Not Found");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });

});

const port = 3000;

if (cleanUrl === "/api/chat" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        const parsed = JSON.parse(body);

        const postData = JSON.stringify({

            model: "deepseek/deepseek-chat-v3-0324",

            messages: [

                {
                    role: "system",
                    content: `
                    Bạn là PCT Assistant,
                    trợ lý AI chính thức của
                    website PHAN CHÂU TRINH NEWS.
                    `
                },

                {
                    role: "user",
                    content: parsed.text
                }

            ],

            temperature: 0.7,
            max_tokens: 1000

        });

        const options = {

            hostname: "openrouter.ai",

            path: "/api/v1/chat/completions",

            method: "POST",

            headers: {

                "Authorization":
                    `Bearer ${process.env.OPENROUTER_API_KEY}`,

                "Content-Type":
                    "application/json",

                "Content-Length":
                    Buffer.byteLength(postData)

            }

        };

        const apiReq = https.request(options, apiRes => {

            let data = "";

            apiRes.on("data", chunk => {
                data += chunk;
            });

            apiRes.on("end", () => {

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(data);

            });

        });

        apiReq.on("error", err => {

            res.writeHead(500);

            res.end(JSON.stringify({
                error: err.message
            }));

        });

        apiReq.write(postData);

        apiReq.end();

    });

    return;

}
server.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}/`);
});