const getProfilePicture = require("../../puppeteer/user/profilePicture");
const getProfilePictureSpy = jest.spyOn(getProfilePicture, 'getProfilePicture');

const userClass = require("../user");

describe("user.getProfilePicture()", () => {
    afterEach(() => {
        getProfilePictureSpy.mockClear();
    });

    test("Get profile picture of user", async() => {
        const user = new userClass({ userName: "MathieuSchl" });

        const url = await user.getProfilePicture();

        expect(getProfilePictureSpy).toHaveBeenCalledTimes(1);
        expect(url).toMatch(new RegExp(`^https:\/\/avatars\.githubusercontent\.com\/u\/`));// Start with
    });

    test("Get profile picture of user (2 times)", async() => {
        const user = new userClass({ userName: "MathieuSchl" });

        const url = await user.getProfilePicture();
        const url1 = await user.getProfilePicture();

        expect(getProfilePictureSpy).toHaveBeenCalledTimes(1);
        expect(url).toMatch(url1);
        expect(url).toMatch(new RegExp(`^https:\/\/avatars\.githubusercontent\.com\/u\/`));// Start with
    });

    test("Get profile picture of user force reload (3 times)", async() => {
        const user = new userClass({ userName: "MathieuSchl" });

        const url = await user.getProfilePicture();
        const url1 = await user.getProfilePicture();
        const url2 = await user.getProfilePicture({reload: true});

        expect(getProfilePictureSpy).toHaveBeenCalledTimes(2);
        expect(url).toMatch(url1);
        expect(url).toMatch(url2);
        expect(url).toMatch(new RegExp(`^https:\/\/avatars\.githubusercontent\.com\/u\/`));// Start with
    }, 15000);

    test("User dont exist", async() => {
        const user = new userClass({ userName: "UserTestButDoesNotExist" });

        const url = await user.getProfilePicture();

        expect(getProfilePictureSpy).toHaveBeenCalledTimes(1);
        expect(url).toBeNull();
    },15000);
});