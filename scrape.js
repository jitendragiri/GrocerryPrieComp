const puppeteer = require("puppeteer").default;

const debugmode = true;
module.exports.dunzo = async function(searchTerm) {

    const search = searchTerm;
    
    try {
        const browser = await puppeteer.launch({ headless:debugmode });
        
        const page = await browser.newPage();
          const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
  await page.setUserAgent(ua);


        await page.goto("https://www.dunzo.com/search");

        await page.waitForTimeout(2000);
        

        await page.type("[placeholder=\"Search for item or a store\"]", search);
        

        await page.waitForTimeout(2000);


        await page.waitForXPath('//*[@id="__next"]/div[2]/div[2]/div[2]/p');

        await page.waitForTimeout(2000);

        let product_class = await page.evaluate(() => {
            function getElementByXpath(path) {
                return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              };

            return getElementByXpath('//*[@id="__next"]/div[2]/div[2]/div[3]/div[1]/div[2]/div/div/div/div[1]/div/div').classList['3'];
        })

        console.log(product_class);

        let prods = await page.evaluate((product_class) => {
            return [...document.querySelectorAll("." + product_class)].map(ele => {
                return  { 
                    product_name:  ele.querySelector("div > div > div > p").innerText,
                    product_price: ele.querySelector("div > div > div > div > p").innerText,
                    product_image: ele.querySelector("img").src,
                    link: ele.querySelector("a")?.href,
            }
            }).filter(x=>!!x.link);
        }, product_class);

        console.log(prods);
        await browser.close();
        return prods;


    } catch(err) {
        console.log(err)
        return false
    }


}

module.exports.blinkit = async function(searchTerm) {
    
    const search = searchTerm;
    
    try {
        const browser = await puppeteer.launch({ headless:debugmode });
        
        const page = await browser.newPage();
          const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
  await page.setUserAgent(ua);


        await page.goto("https://blinkit.com/s/?q="+search);

        let products = await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);

            function getElementByXpath(path) {
                return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            };

            let container = getElementByXpath('/html/body/div[1]/div/div/div[5]/div/div[2]/div[2]/div[2]');
            let prods = container.children;
           
    
           return [...prods].map(ele => {
                return {
                
                    product_name:ele.querySelector('div.Product__DetailContainer-sc-11dk8zk-5.gqXiXY > div.Product__ProductName-sc-11dk8zk-6.fxBwnM').innerText,
                    product_price:'₹'+(ele.querySelector('div.Product__DetailContainer-sc-11dk8zk-5.gqXiXY > div.Product__PriceAtcContainer-sc-11dk8zk-3.kOHvUg > div.ProductPrice__PriceContainer-sc-14194u2-0.iKlIZr > div').innerText.split('₹').filter(x=>!!x)[0]),
                    product_image:ele.querySelector('img')?.src || 'https://resources.dunzo.com/web-assets/prod/_next/static/images/SkuItemPlaceholder-f84baae1b76ec41168f8921814c21e72.png',
                    link: ele.href
                };
            
                })
            
        });

        console.log(products);
        await browser.close();
        return products;

    } catch(err) {
        console.log(err)
        return false
    }
} 