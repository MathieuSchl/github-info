const puppeteer = require("puppeteer");
const getUser = require("../puppeteer/user").getUser;

module.exports = class Puppet {
    debug = false;
    test = false;
    
    constructor({ userName, debug, test }) {
        this.userName = userName;
        if(debug != undefined) this.debug = debug;
        if(test != undefined) this.test = test;
        this.options = { debug: this.debug, test: this.test };
        this.headless = this.options.debug ? false : "new";
        this.getData();
    }

    async getData() {
        this.browserProm = puppeteer.launch({headless: this.headless});
        const browser = await this.browserProm;
        this.user = getUser({ browser, options: this.options, userName: this.userName });

        await this.user;
        
        if(!this.debug) await browser.close();
    }

    async getUser() {
        return await this.user;
    }
}