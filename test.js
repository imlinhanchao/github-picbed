const test = require('tape');
const path = require('path');
// config options first
const options = {
    token: '',
    username: '',
    repository: ''
};
const github = require('.')(options);

if (options.token == '' || options.username == '' || options.repository == '') {
    throw new Error('Please Edit file to config options first.');
}

test('Upload readme to repository', async function(assert) {
    assert.deepEqual(await github.upload({
        data: path.resolve(__dirname, 'readme.md'),
        filename: 'readme.txt'
    }), `http://${username}.github.io/${repository}/readme.txt`);
    assert.end()
})