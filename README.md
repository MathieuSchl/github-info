# GitHub-info-inspector

This is an npm package that allows you to get user informations from a username.

## Install

```bash
npm install GitHub-info-inspector
```

## Usage

### Import

Import module like this :

```javascript
const githubInfoInspector = require("github-info-inspector");
```

Create new profile object :
```javascript
 const profile = new githubInfoInspector("UserName");
```

### Accessing data

#### User

##### Profile picture

You can access to url of the profile picture of the user :
```javascript
await profile.user.getProfilePicture();
```
