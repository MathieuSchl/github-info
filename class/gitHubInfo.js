const userClass = require("./user");

module.exports = class gitHubInfo {
    headless = "new";
    
    constructor(userName) {
        this.userName = userName;
        this.user = new userClass({ userName, headless: this.headless });
    }

    toString() {
        return `${this.userName}`;
    }
}