# GitHub Picture Bed

A picture bed based on GitHub. Provide an HTTP file service through Pages. Upload images using the GitHub API.

## Installation

```bash
npm install github-upload
```

## Usage 

```javascript
const github = require('github-upload')({
    token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    repository: 'https://github.com/imlinhanchao/upload-file'
})
const path = require('path');

router.post('/upload', async (req, res, next) => {
    let data = req.files[0].buffer;
    let extname = path.extname(req.files[0].originalname);
    let upload = await github.upload({ data, extname })
    res.json(upload);
})
```

## Preparation

1. You need to create an access token in [GitHub](https://github.com/settings/tokens). Select only `repo` for the `select scopes`.
2. Create a repository use to upload files.

## Functions

### Config Upload Options

```javascript
async function config({ token, repository });
```

#### Parameter Object 
|key|description|
|--|--|
|token|Your GitHub access token.|
|repository|Your repository use to upload files.|

### Check Initialize State

```javascript
async function isInitialized();
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

## Notice

After configuring the GitHub repository address and access token, it takes about 1 second to get the information of GitHub Pages. Therefore, please do not upload immediately after configuration. You can use `isInitialized` to check if initialization has been completed. Or use `await` to wait for the configuration to complete.
