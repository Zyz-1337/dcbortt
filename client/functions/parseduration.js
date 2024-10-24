function parseduration(duration) {
    // input posibilitys: 10 secs, 5 mins, 3 hours, 15 days
    // output: 10000, 300000, 10800000, 1296000000

    // if duration has this pattern YYYY-MM-DD HH:MM:SS
    if (duration.includes('-') && duration.includes(':')) {
        const ms = new Date(duration).getTime() - new Date().getTime();
        return ms;
    }

    if (duration.includes(',')) {
        const [ time1, time2 ] = duration.split(',');

        const ms1 = parseduration(time1);
        const ms2 = parseduration(time2);

        return ms1 + ms2;
    }

    const [time, type] = duration.split(' ');

    let ms = 0;

    if (type === 'secs' || type === 'seconds' || type === "sek" || type === "sekunden") ms = time * 1000;
    if (type === 'mins' || type === 'minutes' || type === "min" || type === "minuten") ms = time * 60000;
    if (type === 'hours' || type === 'stunden' || type === "stunden") ms = time * 3600000;
    if (type === 'days' || type === 'tage' || type === "tage") ms = time * 86400000;

    return ms;
}

module.exports = parseduration;