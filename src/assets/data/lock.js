const axios = require('axios');
const fs = require('fs');

const oneSecSleep = () => new Promise(resolve => setTimeout(resolve, 1000));

(async () => {
    let lock = JSON.parse(fs.readFileSync('src/assets/data/lock.json'));

    let targetDay = lock.length;
    let lastDay = 0;
    do {
        const result = await axios.post(
            'https://havah.io/api/icon/rewardDashboard',
            { sequence: targetDay }
        );
        
        lastDay = result.data.message.dayAll;
        if(result.data.message.msg.result.unrewarded) {
            lock[targetDay] = result.data.message.msg.result.unrewarded;
        }

        targetDay++;

        await oneSecSleep();
    } while(targetDay != lastDay);

    fs.writeFileSync('src/assets/data/lock.json', JSON.stringify(lock, null, 4));

    require('./planet');
})()