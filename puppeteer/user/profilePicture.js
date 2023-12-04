const puppeteer = require("puppeteer");


module.exports.getProfilePicture = getProfilePicture;
async function getProfilePicture({headless = "new", userName}) {
    const browser = await puppeteer.launch({headless});
    const page = await browser.newPage();

    await page.goto(`https://github.com/${userName}/`);
    
    const profilePictureUrl = await new Promise(async (resolve)=>{
        try {
            const avatarSelector = ".avatar.avatar-user";
            const avatar = await page.waitForSelector(avatarSelector, { timeout: 5000 });// get html object
            const profilePictureUrl = await avatar?.evaluate(el => el.src);// get attribute src in html object
            resolve(profilePictureUrl);
        } catch (error) {
            resolve(null)
        }
    })
    
    await browser.close();
    return profilePictureUrl;
}