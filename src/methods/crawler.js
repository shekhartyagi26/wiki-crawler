const puppeteer = require("puppeteer");
const { WaitFor } = require('./common');
//-------------------------------------------
class Crawler {

    constructor(config = null) {
        this.browser = {};
        this.page = {};
        this.error = "";
        this.config = {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };
    }

    async beforeEach() {

        console.log("Initialising browser and page");

        this.browser = await puppeteer.launch(this.config);

        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1366, height: 768 });
        await this.page._client.send('Network.clearBrowserCookies');
    }

    async checkJQueryLoaded() {

        const that = this;

        const waitFor = new WaitFor();
        await waitFor.waitFor(check, () => console.log(".."), 15);

        async function check() {
            try {
                return await that.page.evaluate(() => {
                    let isLoaded = false;
                    if (!window.jQuery) isLoaded = false;
                    else isLoaded = true;
                    return isLoaded;
                });
            }
            catch (e) {
                console.log("Error in checking jQuery :" + e.message);
                return false;
            }
        }
    }

    async goTo(url) {
        await this.page.goto(url);
    }
}
//-------------------------------------------
module.exports = Crawler;
//-------------------------------------------