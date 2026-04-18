const axios = require("axios");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(text){

try{

const url =
`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

await axios.post(url,{

chat_id: TELEGRAM_CHAT_ID,

text: text,

parse_mode:"HTML"

});

console.log("Telegram notification sent");

}
catch(err){

console.log("Telegram error:", err.message);

}

}

module.exports = sendTelegramMessage;