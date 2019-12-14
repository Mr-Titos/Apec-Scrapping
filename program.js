  // Puppeteer is needed with JS automatic pages like APEC
  const puppeteer = require('puppeteer');
  const cheerio = require('cheerio');
  const mysql = require('mysql');
  const fs = require('fs');
  const http = require('http');
  // Example of an url scrappingable :
  //'https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/164628320W?selectedIndex=0&page=0&xtor=EPR-41-%5Bpush_sans_compte%5D'

 let browser;

 let skillJSON;
 let settingsJSON;
 let reqBody;

fs.readFile('settings.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Settings file read failed:", err)
        return
    } else {
        try {
            settingsJSON = JSON.parse(jsonString)
    } catch(err) {
            console.log('Error parsing Responses JSON string:', err)
        } 
    }
});

http.createServer(function (req, res) {

    async function asyncMain(arr, callback) {
        for (let index = 0; index < arr.length; index++) {
          await callback(arr[index], index);
        }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    var indexT = req.rawHeaders.indexOf("token");
    if(1 == 1) { // req.rawHeaders[indexT + 1] == settingsJSON.token
        req.on('data', chunk => {
            reqBody = chunk.toString(); // convert Buffer to string
        });
        
        req.on('end', () => {
            let mainQueue = async () => {
                browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                await asyncMain(JSON.parse(reqBody), main);
                console.log("DONE");
                browser.close();
            }
            mainQueue();
            res.end();
        });
    } else {
        console.log("Invalid token");
        res.write("Invalid token");
        res.end();
    }
}).listen(26969); 

async function main(url, indexL) {
    salary = null;
    society = null;
    await loadSkills();

    const page = await browser.newPage();
    await page.goto(url, {timeout: 0}).then( async () => {
        console.log("Index "+ indexL + " / url : " + url);

        const html = await page.content();

        var exec = new Promise((resolve, reject) => {
            try {
                console.log("-------------------In execuction-------------------");
                resolve( [getCEC(html),getWeek(html),getSalExp(html),getSkills(html)] );
            }
            catch(err) { reject(err); }
        }); 
        
        exec.then(async (dataResolved) => {
            console.log("Contract: " + dataResolved[0][2]);
            console.log("Society: " + dataResolved[0][0]);
            console.log("City: " + dataResolved[0][1]);
            console.log("Salary: " + dataResolved[2][0]);
            console.log("Experience: " + dataResolved[2][1]);
            console.log("Date: " + dataResolved[1].toString());
            dataResolved[3].forEach(skill => {
                console.log(skill.arrGet[0].name + ': ' + skill.state);
            });
            console.log("------------Data acquire with success------------");
            console.log("\nPlease wait until the save is over...\n");
                await saveDB(dataResolved[0][2], dataResolved[0][0], dataResolved[0][1], dataResolved[2][0], 
                dataResolved[2][1], dataResolved[1], dataResolved[3] ).then(() => {
                    console.log("---------------Data save in the Database---------------");
                    page.close(); // close the page on the virtual browser
            }).catch(err => { console.log(err); });
        }).catch(err => { console.log("Error in processing data : " + err + " Maybe the link is wrong ?");  }); 
    });
}

function getSkills(html) {
    var skillsArray = skillJSON.skillsArr;
    var containSkill = function(data) {
        skillsArray.forEach(skill => {
            //console.log("foreach: " + skill.arrGet[0].name);
            for (var i = 0; i < skill.arrGet.length; i++) {
                //console.log("for" + skill.arrGet[i].name);
                if(data.includes(skill.arrGet[i].name)) {
                    skill.state = true;
                    //console.log("TRUE: " + skill.arrGet[i].name);
                    break;
                }
            }
        });
    }

    const cells = cheerio('.details-post > p', html)
    for (let i = 0; i < cells.length; i++) {
        let cellSkills = cells[i].children;
        for (let j = 0; j < cellSkills.length; j++) {
            let cellNodeSkill = cheerio(cellSkills[j]);
            containSkill(cellNodeSkill.text().toLowerCase());
        }
    }
    return skillsArray;
}

function getWeek(html) {
    const cells = cheerio('.date-offre', html)
    let cellContract = cells[0].children;
    let cellNodeCont = cheerio(cellContract[0]);
    let parts = cellNodeCont.text().substring(cellNodeCont.text().indexOf('/') - 2).split('/');
    let week =  new Date(parts[2], parts[1] -1, parts[0]);
    return week;
}

function getCEC(html) {
    var getCont = () => {
        const cells = cheerio('.details-offer-list > li > span', html)
        let cellContract = cells[0].children;
        let cellNodeCont = cheerio(cellContract[0]);
        return cellNodeCont.text();
    }
    var sortData = function(data) {
        let stg = "";
        Array.from(data).forEach(s => {
            if(s*0 != 0 && s != " " && s != '-') // can be replace by a switch
                stg+=s;
        });
        return stg;
    };

    // .details-offer-list is a div and > li permit to get li in this div
    const cells = cheerio('.details-offer-list > li', html)
    if(cells.length === 3) {
        let cellEnt = cells[0].children;
        let cellCity = cells[2].children;
        let cellNodeEnt = cheerio(cellEnt[0]);
        let cellNodeCity = cheerio(cellCity[0]);

        let society = sortData(cellNodeEnt.text());
        let city = sortData(cellNodeCity.text());
        let contract = getCont();
        return [society, city, contract];
    } else {
        let cellCity = cells[1].children;
        let cellNodeCity = cheerio(cellCity[0]);

        let society = null;
        let city = sortData(cellNodeCity.text());
        let contract = getCont();
        return [society, city, contract];
    }
}

function getSalExp(html) {
    var sortData = function(data, isSalary) {
        let stg = "";
        let salary1 = 0;
        Array.from(data).forEach(s => {
            if(s*0 === 0 && s != " ") { // can be replace by a switch
                stg+=s;
                if(stg.length >= 2 && isSalary == true && salary1 === 0) {
                    salary1 = stg*1;
                    //console.log(salary1);
                    stg = "";
                }
            }
            
        });
        if(!isSalary)
            return stg;
        else {
            let arrSalary = new Array();
            arrSalary[0] = salary1; arrSalary[1] = stg*1;
            return arrSalary;
        }
    }
    var dataSalExp = function(index) {
        // .details-post is a div and "> span" permit to get span in this div
        const cells = cheerio('.details-post > span', html);
        let cellNodes = cells[index].children;
        let cellNode = cheerio(cellNodes[0]);
        return cellNode.text();      
    }

    // .details-post is a div and > h4 permit to get h4 in this div
    const cells = cheerio('.details-post > h4', html)

    let salary = null;
    let experience;
    for (let i = 0; i < cells.length; i++) {
        let cellNodes = cells[i].children;
        let cellNode = cheerio(cellNodes[0]);

        if(cellNode.text() === "Salaire") {
            saltemp = sortData(dataSalExp(i), true);
            if((saltemp[0] + (saltemp[1]*1)) < 1000 && saltemp[0] > 0 && saltemp[1] == 0) 
                salary = saltemp[0]*1000;

            else if(saltemp[0] != 0 && saltemp[0] + saltemp[1] < 25000 && saltemp[1] > 0) {
                let avgSalary = (saltemp[0] + saltemp[1]) / 2;
                console.log(saltemp[0] + '-' + saltemp[1]);
                salary = avgSalary*1000;
            }
            else if (saltemp[0] != 0)
                salary = saltemp[0];
            else 
                salary = null;
        }
        else if(cellNode.text() === "Expérience") {
            var expTemp = sortData(dataSalExp(i), false);
            if(expTemp != "" && expTemp != null)
                experience = expTemp;
            else 
                experience = "0";
        }
    }
    return [salary, experience];
}

async function loadSkills() {
    fs.readFile('skills.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Responses file read failed:", err)
            return
        } else {
            try {
                skillJSON = JSON.parse(jsonString)
        } catch(err) {
                console.log('Error parsing Responses JSON string:', err)
            } 
        }
    });
}

function saveDB(cont, soc, city, sal, exp, dte, skill) {
    return new Promise(function (resolve, reject) {
        var conx = mysql.createConnection({
            host: settingsJSON.host,
            user: settingsJSON.user,
            password: settingsJSON.password,
            database: settingsJSON.database
        });
        
        conx.connect(function(err) {
            if (err) reject(err);
            var post  = {
                salary: sal, 
                experience: exp,
                city: city,
                date: dte,
                contract: cont,
                society: soc,
                dotNet: skill[0].state,
                nodejs: skill[1].state,
                my_sql: skill[2].state,
                java: skill[3].state,
                php: skill[4].state,
                js: skill[5].state,
                reactjs: skill[6].state
            };
            var querySend = conx.query('INSERT INTO offres SET ?', post, function (error, results, fields) {
                if (error) reject(error);
            });
            resolve(querySend.sql);
        });
    });  
}