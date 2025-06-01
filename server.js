const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');

const PORT = 3000;

// OAuth2 configuration
const oauth2Config = {
    clientId: '587549746435-0o3q8t3urgk8vng7rpdk7et93vt9264f.googleusercontent.com',
    clientSecret: 'YOUR_CLIENT_SECRET', // Replace with your actual client secret
    redirectUri: 'http://localhost:3000/callback'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Handle callback route
    if (parsedUrl.pathname === '/callback') {
        const code = parsedUrl.query.code;
        
        if (code) {
            // Exchange code for tokens
            const tokenUrl = 'https://oauth2.googleapis.com/token';
            const postData = JSON.stringify({
                code: code,
                client_id: oauth2Config.clientId,
                client_secret: oauth2Config.clientSecret,
                redirect_uri: oauth2Config.redirectUri,
                grant_type: 'authorization_code'
            });

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                }
            };

            const tokenReq = https.request(tokenUrl, options, (tokenRes) => {
                let data = '';
                tokenRes.on('data', (chunk) => {
                    data += chunk;
                });
                tokenRes.on('end', () => {
                    try {
                        const tokens = JSON.parse(data);
                        // Store tokens securely (in a real app, use a secure session)
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>Processing Sign In...</title>
                                <script>
                                    // Store tokens in localStorage (in a real app, use secure HTTP-only cookies)
                                    localStorage.setItem('access_token', '${tokens.access_token}');
                                    localStorage.setItem('id_token', '${tokens.id_token}');
                                    window.location.href = '/';
                                </script>
                            </head>
                            <body>
                                <p>Processing your sign in...</p>
                            </body>
                            </html>
                        `);
                    } catch (error) {
                        console.error('Error parsing token response:', error);
                        res.writeHead(500);
                        res.end('Error processing authentication');
                    }
                });
            });

            tokenReq.on('error', (error) => {
                console.error('Error requesting tokens:', error);
                res.writeHead(500);
                res.end('Error processing authentication');
            });

            tokenReq.write(postData);
            tokenReq.end();
        } else {
            res.writeHead(400);
            res.end('No authorization code received');
        }
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
}); 