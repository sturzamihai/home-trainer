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
            total: totalMem,
            free: freeMem
        }
    };
    return sysInfo;
}

function getModelInfo(data) {
    let modelData = JSON.parse(fs.readFileSync('metrics.json'));
    return modelData;
}

app.get('/app/get', (req,res) => {
    res.send({
        sys: getSysInfo(),
        model: getModelInfo()
    });
});

let port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`Running aggregator on port ${port}`));
