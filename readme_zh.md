# GitHub 图床

基于 GitHub 的图床。通过 Pages 提供 HTTP 文件服务。使用 GitHub API 上传图像。

## 安装

```bash
npm install github-upload
```

## 用法 

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

## 准备

1. 您需要在 [GitHub](https://github.com/settings/tokens/new?scopes=repo&description=Picture%20Bed) 中创建访问令牌. 只需要开放 `repo` 权限即可。
2. 创建用于上传文件的存储库，并开通 Pages 服务。

## 函数

### 配置上传选项

```javascript
async function config({ token, repository });
```

#### 参数对象
|键|描述|
|--|--|
|token|你创建的 GitHub 访问令牌。|
|repository|你的用于上传文件存储库地址。|

### 检查初始化状态

```javascript
async function isInitialized();
```

#### 返回值
**bool** - true 表示完成初始化。

### 上传文件

```javascript
async function upload({ data, extname, filename });
```

#### 参数对象
|键|描述|
|--|--|
|data|您要上传的文件路径或文件内容 `Buffer` 对象。|
|extname|文件的扩展名。如果 `data` 是 `Buffer` 对象，则必须设置这个值。|
|filename|你要保存到仓库的文件名。（可选）|

#### 返回值
|键|描述|
|--|--|
|filename|最终上传的文件名。|
|url|Web 访问地址。|

## 注意事项

配置 GitHub 存储库地址和访问令牌后，大约需要 1 秒钟来获取 GitHub Pages 的信息。因此，请不要在配置后立即上传。你可以使用 `isInitialized` 检查初始化是否已完成，或者使用`await` 等待配置完成。
