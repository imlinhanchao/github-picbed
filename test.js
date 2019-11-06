const test = require('tape');
const path = require('path');
// config options first
const options = {
    token: '',
    username: '',
    repository: ''
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
        repositoryUrl: `https://github.com/${options.username}/${options.repository}`
        
    });

    console.log('wait for init.');
    await sleep(2000);
    
    test('Upload readme to repository', async function(assert) {
        assert.deepEqual(await github.upload({
            data: path.resolve(__dirname, 'readme.md'),
            filename: 'readme.txt'
        }), `https://${options.username}.github.io/${options.repository}/readme.txt`);
        assert.end()
    })

})()