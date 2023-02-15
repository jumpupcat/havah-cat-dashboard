const axios = require('axios');
const fs = require('fs');

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

    fs.writeFileSync('src/assets/data/planet.json', JSON.stringify(planet, null, 4));
})()