const request = require("./request");

function extraireChiffresFromString(chaine) {
    // Utilisation d'une expression régulière pour trouver tous les chiffres dans la chaîne
    const chiffres = chaine.match(/\d+/g);

    // Si des chiffres sont trouvés, les convertir en nombres
    if (chiffres) {
        return chiffres.map(Number);
    } else {
        return [];
    }
}

module.exports.getUser = getUser;
async function getUser({browser, options, userName}) {
    const pageUser = await browser.newPage();
    const pageUserReadMe = await browser.newPage();

    const goToUser = pageUser.goto(`https://github.com/${userName}/`);
    const goToUserReadMe = pageUserReadMe.goto(`https://raw.githubusercontent.com/${userName}/${userName}/main/README.md`);

    await goToUser;
    await goToUserReadMe;

    const result = { userName }
    
    result.nickname = await request(options, "user.nickname", async() => {
        const nicknameSelector = ".vcard-fullname";
        const spanNickName = await pageUser.waitForSelector(nicknameSelector, { timeout: 5000 });// get html object
        const nickname = await spanNickName?.evaluate(el => el.innerText);// get attribute src in html object
        return nickname;
    })

    result.bio = await request(options, "user.bio", async() => {
        const bioSelector = ".user-profile-bio>div";
        const divBio = await pageUser.waitForSelector(bioSelector);
        const bio = await divBio?.evaluate(el => el.innerText);
        return bio;
    })
    
    result.profilePictureUrl = await request(options, "user.profilePictureUrl", async() => {
        const avatarSelector = ".avatar.avatar-user";
        const imgAvatar = await pageUser.waitForSelector(avatarSelector);
        const profilePictureUrl = await imgAvatar?.evaluate(el => el.src.split('?')[0]);
        return profilePictureUrl;
    })
    
    result.followers = await request(options, "user.followers", async() => {
        const followersSelector = "div.flex-order-1.flex-md-order-none.mt-2.mt-md-0>div.mb-3>*:nth-of-type(1)";
        const aFollower = await pageUser.waitForSelector(followersSelector);
        const followersString = await aFollower?.evaluate(el => el.innerText);
        const followers = extraireChiffresFromString(followersString)[0];
        return followers;
    })
    
    result.following = await request(options, "user.following", async() => {
        const followingSelector = "div.flex-order-1.flex-md-order-none.mt-2.mt-md-0>div.mb-3>*:nth-of-type(2)";
        const aFollowing = await pageUser.waitForSelector(followingSelector);
        const followingString = await aFollowing?.evaluate(el => el.innerText);
        const following = extraireChiffresFromString(followingString)[0];
        return following;
    })
    
    result.achievements = await request(options, "user.achievements", async() => {
        const achievementsSelectors = "div.border-top.color-border-muted.pt-3.mt-3.d-none.d-md-block>div.d-flex.flex-wrap"
        const divAchievementsBlock = await pageUser.$(achievementsSelectors);
        const achievements = await divAchievementsBlock.evaluate(element => {
            const achievementsArray = [];
            const regexAchievements = /achievement=([^&]+)/;
            for (const childNode of element.children) {
              const match = childNode.href.match(regexAchievements);
              achievementsArray.push(match[1]);
            }
            return achievementsArray;
        });
        return achievements;
    })
    
    result.organizations = await request(options, "user.organizations", async() => {
        const organisationSelectors = "div.border-top.color-border-muted.pt-3.mt-3.clearfix.hide-sm.hide-md"
        const divOrganizationsBlock = await pageUser.$(organisationSelectors);
        const organizations = await divOrganizationsBlock.evaluate(element => {
            const organizationsArray = [];
            for (const childNode of element.children) {
                if(childNode.localName === "a" && childNode.className === "avatar-group-item") {
                const imgAvatar = childNode.querySelectorAll("img.avatar")[0];
                const urlAvatar = imgAvatar.currentSrc.split('?')[0];
                organizationsArray.push({
                    name:childNode.ariaLabel,
                    href:childNode.href,
                    urlAvatar
                });
                }
            }
            return organizationsArray;
        });
        return organizations;
    })

    result.readme = await request(options, "user.readme", async() => {
        const readmeSelector = "pre";
        const preReadme = await pageUserReadMe.waitForSelector(readmeSelector);
        const readme = await preReadme?.evaluate(el => el.innerText);
        return readme;
    })
    
    if(!options.debug) await pageUser.close();
    if(options.debug) console.log(result);

    return result;
}