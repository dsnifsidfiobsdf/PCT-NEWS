const http = require('http');
const fs = require('fs');
const path = require('path');

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
server.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}/`);
});