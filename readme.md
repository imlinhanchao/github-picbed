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
    data: '/your/file/path'
})
.then(url) {
    console.log(url); // http://username.github.io/repository/hash.file
}
.catch(error) {
    console.error(error.message);
}
```