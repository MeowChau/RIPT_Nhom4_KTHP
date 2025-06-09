const cron = require("node-cron");
const runMinutePoints = require("./cron/dailyPoints");
cron.schedule("* * * * *", runMinutePoints);
console.log("Minute points cron started!");
