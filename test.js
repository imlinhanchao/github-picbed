const test = require('tape');
const path = require('path');
// config options first
const options = {
    token: '',
    username: '',
    repository: '',
    httpProxy: ''
};

if (options.token == '' || options.username == '' || options.repository == '') {
    throw new Error('Please Edit file to config options first.');
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

(async () => {

    const github = require('.')({
        token: options.token,
        repository: `https://github.com/${options.username}/${options.repository}`,
        branch: options.branch,
        httpProxy: options.httpProxy
    });

    console.log('wait for init.');
    while(!github.isInitialized()) await sleep(100);

    test('Upload readme to repository', async function(assert) {
        assert.deepEqual(await github.upload({
            data: path.resolve(__dirname, 'readme.md'),
            filename: 'readme.txt'
        }), {'filename': 'readme.txt', 'url':`https://cdn.jsdelivr.net/gh/${options.username}/${options.repository}@${options.branch}/readme.txt`});
        assert.end()
    })

})()
