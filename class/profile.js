const userClass = require("./user");
const Puppet = require("./puppet");

module.exports = class Profile {
    headless = "new";
    
    constructor(userName) {
        this.userName = userName;
        this.puppet = new Puppet({ userName });
        this.user = new userClass({ puppet: this.puppet });
    }

    toString() {
        return `${this.userName}`;
    }
}