const axios = require('axios');
const fs = require('fs');

const miningAmount = 4300000;
const oneSecSleep = () => new Promise(resolve => setTimeout(resolve, 1000));

(async () => {
    let planet = JSON.parse(fs.readFileSync('src/assets/data/planet.json'));

    const planetAddress = 'cx8000000000000000000000000000000000000000';
    let currentPage = 1;
    let totalSize;
    let burnPlanet = [];

    do {
        const result = await axios.get(`https://scan.havah.io/v3/nft/txList?page=${currentPage++}&count=100&scoreAddr=${planetAddress}`);

        totalSize = result.data.totalSize;
        for(const p of result.data.data) {
            if(p.toAddr == 'hx0000000000000000000000000000000000000000') {
                burnPlanet.push({ id: p.tokenId, block: p.blockHeight });

            } else if(p.fromAddr == 'hx0000000000000000000000000000000000000000') {
                if(planet?.find(cp => cp.id == p.tokenId)) {
                    totalSize = 1;
                    break;
                }

                planet.push({
                    id: p.tokenId,
                    block: p.blockHeight,
                    address: p.toAddr,
                    date: new Date(`${p.timestamp} GMT`).toISOString()
                });
            }
        }

        await oneSecSleep();
    } while(currentPage <= Math.ceil(totalSize/100));

    planet = planet.filter(cp => !burnPlanet.find(bp => cp.id == bp.id));

    setDashBoad(planet);
    fs.writeFileSync('src/assets/data/planet.json', JSON.stringify(planet, null, 4));
})();

function setDashBoad (planetData) {
    let dashbordData = {};
    let holder = {};
    let personal = 0;
    let mini = 0;
    let vc = 0;
    const keyDate = Date.parse('2023-01-12');

    planetData.map(p => {
        const termNum = Math.floor((p.block - 4188193) / 43200);
        const date = new Date(keyDate + ((1000 * 60 * 60 * 24) * termNum)).toISOString().slice(0, 10);
        if(!dashbordData[date]) dashbordData[date] = {};

        if(!holder[p.address]) {
            if(dashbordData[date].holder) dashbordData[date].holder++;
            else dashbordData[date].holder = 1;
        }

        if(dashbordData[date].planet) dashbordData[date].planet++;
        else dashbordData[date].planet = 1;

        if(p.id < 45001) {
            if(dashbordData[date].personal) dashbordData[date].personal++;
            else dashbordData[date].personal = 1;

            personal++;
        }

        if(p.id > 50000 && p.id < 100000) {
            if(dashbordData[date].mini) dashbordData[date].mini++;
            else dashbordData[date].mini = 1;

            mini++;
        }
        if(p.id > 100000) vc++;
        
        holder[p.address] = 1;
    });

    dashbordData.totalPlanet = planetData.length;
    dashbordData.totalHolder = Object.keys(holder).length;
    dashbordData.personalHolder = personal;
    dashbordData.mPlanet = mini;
    dashbordData.vc = vc;

    dashbordData.chartData = [
        { name: 'PLANET', data: [] },
        { name: 'HOLDER', data: [] }
    ];
    let j = 0;
    for(let i=11; i>=0; i--) {
        const keyDate = new Date(Date.parse(new Date()) - (1000 * 60 * (60 * 27)) - ((1000 * 60 * 60 * 24)* i)).toISOString().slice(0, 10);
        const defaultChartData = { x: keyDate, y: 0 }
        dashbordData.chartData[0].data[j] = { ...defaultChartData };
        dashbordData.chartData[1].data[j] = { ...defaultChartData };

        if(dashbordData[keyDate]?.planet) dashbordData.chartData[0].data[j].y = dashbordData[keyDate].planet;
        if(dashbordData[keyDate]?.holder) dashbordData.chartData[1].data[j].y = dashbordData[keyDate].holder;

        j++;
    }

    const today = new Date(Date.parse(new Date()) - (1000 * 60 * (60 * 2 + 15))).toISOString().slice(0, 10);

    dashbordData.tableData = [];
    let sumPlanet = 7086;
    let sumHolder = 270;
    let sumPersonal = 184 + 45;
    let sumSupply = miningAmount / sumPlanet * sumPersonal;
    let targetDate = '2023-01-12';
    do {
        const currentH = dashbordData[targetDate]?.holder ? dashbordData[targetDate]?.holder : 0;
        const currentP = dashbordData[targetDate]?.planet ? dashbordData[targetDate]?.planet : 0;

        dashbordData.tableData.push({
            date: targetDate,
            holders: currentH,
            planet: currentP,
            mining: (miningAmount/sumPlanet).toFixed(4),
            totalPlanet: sumPlanet,
            totalHolders: sumHolder,
            holderSupply: Math.ceil(sumSupply)
        });

        sumHolder += currentH;
        sumPlanet += currentP;

        if(dashbordData[targetDate]?.personal) sumPersonal += dashbordData[targetDate].personal;
        if(dashbordData[targetDate]?.mini) sumPersonal += dashbordData[targetDate].mini * 0.9;
        
        sumSupply += miningAmount / sumPlanet * sumPersonal;

        targetDate = new Date(Date.parse(targetDate) + (1000 * 60 * 60 * 24)).toISOString().slice(0, 10);
    } while(targetDate != new Date(Date.parse(today) + (1000 * 60 * 60 * 24)).toISOString().slice(0, 10));

    fs.writeFileSync('src/assets/data/dashboard.json', JSON.stringify(dashbordData, null, 4));
}