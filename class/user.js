const getProfilePicture = require("../puppeteer/user/profilePicture").getProfilePicture;

module.exports = class user {
    constructor({userName, headless = "new"}) {
      this.userName = userName;
      this.headless = headless;
    }
  
    getUserName() {
        return this.userName;
    }

    async getProfilePicture({reload} = {}){
      if(this.profilePictureUrl && !reload) return this.profilePictureUrl;
        const result = await getProfilePicture({headless: this.headless, userName: this.userName, reload});
        this.profilePictureUrl = result;
        return result;
    }
}