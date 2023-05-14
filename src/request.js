const https = require('https');

module.exports = function ({
    path,
    token,
    data = null,
    method,
    httpProxy = null
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

        if (httpProxy) {
            options.agent = new https.Agent({ proxy: httpProxy });
        }

        let req = https.request(options, (res) => {
            let body = '';

            res.setEncoding('utf8');

            res.on('data', (data) => {
                body += data;
            });

            res.on('end', () => {
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

        if (data) req.write(JSON.stringify(data));

        req.end();
    });
}
