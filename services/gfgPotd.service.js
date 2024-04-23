const notionService = require("./notion.service");
const cheerio = require('cheerio');
const axios = require('axios');
const { Builder, By, until } = require('selenium-webdriver');
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const dsaDB = "f7a68e29af754c80a9008463940e15e7";
// "e5cc00f39f2c445dafe3f34026599f29"
/**
 * Get Problem of the Day (PotD) data from GeeksforGeeks
 * @returns {Promise<object>} - Object containing problem title, complexity, and problem URL
 */

async function getPotDData() {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        
        await driver.get('https://www.geeksforgeeks.org/problem-of-the-day');

        
        const anchorTag = await driver.wait(until.elementLocated(By.id('potd_solve_prob')), 10000);

        
        const problemURL = await anchorTag.getAttribute('href');
        const complexity = await anchorTag.findElement(By.xpath('following-sibling::p/span[1]')).getText();
        const problemTitle = await anchorTag.findElement(By.xpath('../../div[1]/p[2]')).getText();

        return {
            problemTitle,
            complexity,
            problemURL
        };
    } catch (error) {
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'Failed to fetch PotD data: ' + error.message);
    } finally {
        // Close the browser
        await driver.quit();
    }
}
async function createPageInDSADB(data){
    await notionService.addPageToNotionDB(dsaDB, {
        properties:{
        "Name": {
            "title": [
                {
                    "text": {
                        "content": data.problemTitle
                    }
                }
            ]
        },
        "Due Date": {
            "date": {
                "start": data.dueDate
            }
        },
        "Difficulty": {
            "select": {
                "name": data.difficulty
            }
        },
        "Problem URL": {
            "url": data.problemURL
        },
        "Source":{
            "select": {
                "name": data.source
            }
        }
        },
        icon: { type: 'emoji', emoji: '❓' }
    });

}

async function createGFGPOTD() {

    try{
        const data = await getPotDData();
        console.log(data);
        await createPageInDSADB({
            problemTitle: data.problemTitle,
            problemURL: data.problemURL,
            difficulty: data.complexity,
            source: "GFG",
            dueDate: new Date().toISOString().split('T')[0]
        });

    } catch(error){
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"Failed to add page to Notion database: " + error.message);
    }
}


// createGFGPOTD();
module.exports = {
    createGFGPOTD,
};