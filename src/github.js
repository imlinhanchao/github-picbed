const request = require('./request');
const crypto = require('crypto');
const fs = require('fs');

module.exports = function ({
    token,
    username,
    repository,
    name = null,
    email = null,
    domain = null
}) {
    let _options = {
        token,
        username,
        repository,
        name: name || username,
        email: email || name + '@github.com',
        domain: domain || `${username}.github.io/${repository}`
    }

    return {
        async upload({
            data,
            extname = null,
            filename = null
        }) {
            if (typeof data == 'string') {
                data = load(data);
            }

            if (!(data instanceof Buffer)) {
                throw new TypeError('The data must be String or Buffer.')
            }

            let fileHash =  hash(data);
            filename = filename || fileHash + (extname || '');

            let rsp = await request({
                path: `/repos/imlinhanchao/page-pic-bed/contents/${filename}`,
                token: _options.token,
                method: 'GET'
            });

            if (!rsp.content) {
                let rsp = await request({
                    path: `/repos/imlinhanchao/page-pic-bed/contents/${filename}`,
                    token: _options.token,
                    method: 'PUT',
                    data: {
                        message: `Upload file ${filename}`,
                        committer: {
                            name: _options.username,
                            email: _options.email
                        },
                        content: data.toString("base64"),
                        sha: fileHash
                    }, 
                });
                if (!rsp.content) {
                    throw new Error(`Upload file failed: ${rsp.message || 'Unknown Error'}.`);
                }
            }

            return `http://${domain}/${filename}`;
        },
        config({
            token,
            username,
            repository,
            name = null,
            email = null,
            domain = null
        }) {
            _options = {
                token,
                username,
                repository,
                name: name || username,
                email: email || name + '@github.com',
                domain: domain || `${username}.github.io/${repository}`
            }
        }
    }
}


function hash(buffer) {
    let sha256 = crypto.createHash('sha256');
    let hash = sha256.update(buffer).digest('hex');
    return hash;
}

function load(pathname) {
    return fs.readFileSync(pathname);
}