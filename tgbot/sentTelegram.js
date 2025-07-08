import config from "/-config"
const conf = await config('mail')

const sentTelegram = async (html, client) => {

    if (client) {
        html += 
`
<a href="https://ip2geolocation.com/?ip=${client.ip}">GEO</a>
<a href="${client.referer}">${client.referer}</a>`
    }
    const botToken = conf.telegram.botToken // токен бота
    const chatID = conf.telegram.chatID // ID получателя %2b
    const apiURl = `https://api.telegram.org/bot${botToken}/sendMessage?parse_mode=HTML&chat_id=${chatID}&text=${encodeURIComponent(html)}` //URL для отправки

    //console.log(apiURl)
    const ans = await fetch(apiURl).then(r => r.json())
    if (!ans.ok) console.log(ans.description)

    return ans.ok
}

export default sentTelegram

