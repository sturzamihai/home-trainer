const express = require('express')
const os = require('os');
const fs = require('fs');

app = express()

function getSysInfo() {
    let cpus = os.cpus();
    let totalMem = os.totalmem();
    let freeMem = os.freemem();
    let sysInfo = {
        cpu: {
            num: cpus.length,
            name: cpus[0].model
        },
        memory: {
            total: totalMem/Math.pow(1024,3),
            free: freeMem/Math.pow(1024,3)
        }
    };
    return sysInfo;
}

function getModelInfo(data) {
    var modelData = JSON.parse(fs.readFileSync('metrics.json'));
    return modelData;
}

app.get('/app/get', (req,res) => {
    res.send([getSysInfo(),getModelInfo()]);
});

let port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`Running aggregator on ${port}`));