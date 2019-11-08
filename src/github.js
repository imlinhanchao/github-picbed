const request = require('./request');
const crypto = require('crypto');
const fs = require('fs');

let _options = {};

module.exports = function ({
    token = null,
    repository = null
}) {

    async function getOptions({ token, repository }) {
        repository = repository.replace(/http(s|):\/\/github.com\//, '');
        if (repository.split('/').length != 2) throw new Error('Not a invaild repository url.');

        let username = repository.split('/')[0];
        repository = repository.split('/')[1];
        let pagesInfo = await getPages({ username, repository, token });

        return {
            token,
            username,
            repository,
            domain: pagesInfo.domain,
            path: pagesInfo.path,
            branch: pagesInfo.branch
        };
    }

    async function getPages({ username, repository, token }) {
        let rsp = await request({
            path: `/repos/${username}/${repository}/pages`,
            token,
            method: 'GET'
        });

        if (!rsp.html_url) {
            throw new Error('The repository must be setting GitHub Pages.')
        }
        console.log(rsp)
        return {
            domain: rsp.html_url,
            path: rsp.source.path,
            branch: rsp.source.branch
        }
    }

    (async () =>{
        try {
            if (!token && !repository) return;
            _options = await getOptions({ token, repository }); 
            console.dir(_options);
        } catch (error) {
            console.error(error);
        }
    })();

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
                path: `/repos/${_options.username}/${_options.repository}/contents${_options.path}${filename}?ref=${_options.branch}`,
                token: _options.token,
                method: 'GET'
            });

            if (!rsp.content) {
                console.dir(_options);
                let rsp = await request({
                    path: `/repos/${_options.username}/${_options.repository}/contents${_options.path}${filename}`,
                    token: _options.token,
                    method: 'PUT',
                    data: {
                        message: `Upload file ${filename}`,
                        content: data.toString("base64"),
                        sha: fileHash,
                        branch: _options.branch
                    }
                });
                if (!rsp.content) {
                    throw new Error(`Upload file failed: ${rsp.message || 'Unknown Error'}.`);
                }
            }

            return {
                filename,
                url: `${_options.domain}${filename}`
            };
        },
        async config({
            token,
            repository
        }) {
            _options = await getOptions({ token, repository });
        },
        isInitialized() {
            return !!_options.domain
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