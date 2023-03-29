const puppeteer = require("puppeteer").default;
const cors = require("cors")
const express = require("express");
const { blinkit, dunzo } = require("./scrape");

const app = express()
app.use(cors())

app.get("/scrape",async (req, res) => {
    const searchTerm = req.query?.s;
    if(searchTerm === undefined || searchTerm === "") {
        return res.send({error:"Input cannot be empty"});
    } else {
        let [blinkit_result, dunzo_result] = await Promise.all([blinkit(searchTerm),
            dunzo(searchTerm)]);

        let output = [{name:"BlinkIt",result:blinkit_result}, {name:"Dunzo",result:dunzo_result}];
        output.sort((a, b) => a.result != false && b.result == false)
        return res.send(output);
    }
})



app.listen(9000, () => console.log("server started in 9000"))