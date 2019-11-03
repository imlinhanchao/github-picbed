const https = require('https');

module.exports = function ({
    path,
    token,
    data = null,
    method
}) {
    return new Promise((resolve, reject) => {

        var options = {
            hostname: 'api.github.com',
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token ' + token,
                'User-Agent': 'GitHub-PicBad-App'
            }
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                try {
                    resolve(JSON.parse(body))
                } catch (_) {
                    resolve(body);
                }
            });
        });
        req.on('error', function (e) {
            reject(e);
        });

        if(data) req.write(JSON.stringify(data));

        req.end();
    });
}