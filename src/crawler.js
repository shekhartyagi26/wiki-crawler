const Crawler = require('./methods/crawler');
const List = require("../src/collections/lists");

const config = {
    headless: false,
    devtools: true,
    args: ['--no-sandbox']
};

let list = [];

async function crawler(url) {

    let cData = {
        websiteUrl: url,
        data: []
    }

    const crawler = new Crawler(config);

    await initRemedy();

    await process();

    await crawler.browser.close();

    /*
    ***** Methods
    */

    async function initRemedy() {
        await crawler.beforeEach();
    }

    async function process() {

        try {
            //visit the website
            await crawler.goTo(url);

            await crawler.checkJQueryLoaded();

            const headings = await getHeadings();

            const rowData = await getRowData();

            combineData();

            await List.create({
                name: cData.websiteUrl,
                data: cData.data
            });

            function combineData() {
                let allData = {};
                headings.map((heading) => {
                    allData[heading.toLowerCase()] = [];
                })
                rowData.map((data) => {
                    Object.keys(data).map(item => {
                        allData[headings[item].toLowerCase()].push(data[item]);
                    });
                });

                console.log("all data", allData)
                cData.data = JSON.stringify(allData);
            }
        }
        catch (e) {
            //If Error is encountered restart process
            await console.log("Error:" + e.message);
            await process();
        }
    }

    async function getHeadings() {
        await crawler.page.waitForSelector("table.wikitable");
        return await crawler.page.evaluate(async function () {
            const tables = $("table.wikitable").find("th");
            console.log("tables", tables);
            let headings = [];
            tables.each(function (key, value) {
                headings.push(value.innerText);
            });
            return headings;
        })
    }

    async function getRowData() {
        return await crawler.page.evaluate(async function () {
            const trs = $("table.wikitable").find("tr");
            let rowData = [];
            trs.each(function () {
                $(this).find('td').each(function (key, val) {
                    let data = {};

                    let image = $(this).find("small").find("a");
                    if (image.length) {
                        console.log("image", image[0].href)
                        data[key] = image[0].href;
                    }
                    else {
                        image = $(this).find(".center").find("a");
                        if (image.length) {
                            console.log("image", image[0].href, image)
                            data[key] = image[0].href;
                        }
                        else {
                            let innerText = val.innerText
                            console.log("inner text", innerText)
                            data[key] = innerText;
                        }
                    }
                    rowData.push(data);
                });

            });
            return rowData;
        })
    }
}

module.exports = async function crawlWikiWeb() {
    await crawler("https://en.wikipedia.org/w/index.php?title=Antarctic_Specially_Managed_Area&oldid=744434921");
    await crawler("https://hy.wikipedia.org/w/index.php?title=%D5%86%D5%A5%D6%80%D6%84%D5%AB%D5%B6_%D5%87%D5%B8%D6%80%D5%AA%D5%A1%D5%B5%D5%AB_%D5%BA%D5%A1%D5%BF%D5%B4%D5%B8%D6%82%D5%A9%D5%B5%D5%A1%D5%B6_%D6%87_%D5%B4%D5%B7%D5%A1%D5%AF%D5%B8%D6%82%D5%B5%D5%A9%D5%AB_%D5%A1%D5%B6%D5%B7%D5%A1%D6%80%D5%AA_%D5%B0%D5%B8%D6%82%D5%B7%D5%A1%D6%80%D5%B1%D5%A1%D5%B6%D5%B6%D5%A5%D6%80%D5%AB_%D6%81%D5%A1%D5%B6%D5%AF_(%D4%B3%D5%A5%D5%B2%D5%A1%D6%80%D6%84%D5%B8%D6%82%D5%B6%D5%AB%D6%84%D5%AB_%D5%B4%D5%A1%D6%80%D5%A6)&oldid=2262578");
    await crawler("https://ca.wikipedia.org/w/index.php?title=Llista_de_monuments_d%27Andorra&oldid=19419105");

    return list;
};