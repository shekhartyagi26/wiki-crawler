const crawler = require('./crawler');
const List = require('./collections/lists');

module.exports = (app) => {
    app.get('/crawl', async function (req, res) {
        let data = [];
        //start crawler
        await List.remove({});
        await crawler();
        const lists = await List.find({});
        lists.map(list => {
            console.log("list", list);
            let item = {};
            item.name = list.name;
            item.data = JSON.parse(list.data);
            data.push(item);
        })
        res.send({ data });
    });

    app.get('/data', async function (req, res) {
        let data = [];
        const lists = await List.find({});
        lists.map(list => {
            let item = {};
            item.name = list.name;
            item.data = JSON.parse(list.data);
            data.push(item);
        })
        res.send({ data });
    });
}