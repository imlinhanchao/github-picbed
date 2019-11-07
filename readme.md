# GitHub Picture Bed

A picture bed based on GitHub. Provide an HTTP file service through Pages. Upload images using the GitHub API.

## Installation

```bash
npm install github-upload
```

## Usage 

```javascript
const options = {
    token: '',
    username: '',
    repository: ''
};
const github = require('github-upload')(options);

github.upload({
    data: '/your/file/path.jpg'
})
.then(url) {
    console.log(url); // http://username.github.io/repository/hash.jpg
}
.catch(error) {
    console.error(error.message);
}
```

## Preparation

1. You need to create an access token in [GitHub](https://github.com/settings/tokens). Select only `repo` for the `select scopes`.
2. Create a repository use to upload files.

## Functions

### Config Upload Options

```javascript
async function config({ token, repositoryUrl });
```

#### Parameter Object 
|key|description|
|--|--|
|token|Your GitHub access token.|
|repositoryUrl|Your repository use to upload files.|

### Check Initialize State

```javascript
async function isInitialized({ token, repositoryUrl });
```

#### Return Value
**bool** - true means finish initialize.

### Upload file

```javascript
async function upload({ data, extname, filename });
```

#### Parameter Object 
|key|description|
|--|--|
|data|The file path that you want to upload or the buffer of file.|
|extname|The extname of file. You must set this key if the data is buffer.|
|filename|The filename that you want to upload.(Options)|

#### Return Object 
|key|description|
|--|--|
|filename|The filename that was eventually uploaded.|
|url|Access URL.|

## Example

```javascript
const github = require('github-upload')({
    token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    repository: 'https://github.com/imlinhanchao/upload-file'
})
const path = require('path');

router.post('/upload', async (req, res, next) => {
    let data = req.files[0].buffer;
    let upload = await github.upload({ data, extname: path.extname(req.files[0].originalname) })
    res.json(upload);
})
```