import config from "/-config"
const conf = await config('mail')

const processLink = (link) => {
    const url = new URL(link);
    const params = Object.fromEntries(url.searchParams);
    // Достаем и декодируем ключевую фразу
    let keyword = 'не указана';
    if (params.utm_term && params.utm_term !== 'no') {
     keyword = decodeURIComponent(params.utm_term.split('|').pop());
    }

    return {
        cleanLink: `${url.origin}${url.pathname}`, // Короткая ссылка
        term: (params.utm_term || '').split('|')[0]
    };
}

const sentTelegram = async (html, client) => {
    if (!conf.telegram) console.log('Отправка в телеграмм не настроена, нужно добавить реквизиты botToken и chatID в .mail.json секция telegram')
    if (client) {
        const resObj = processLink(client.referer)

        html = html + `
<a href="https://ip2geolocation.com/?ip=${client.ip}">GEO</a>
<a href="${resObj.cleanLink}">${resObj.cleanLink}</a>`
        if (resObj.utm_term) html = html + `(${resObj.utm_term})`
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

