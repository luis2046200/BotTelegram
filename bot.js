const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const bot = new Telegraf('5460768156:AAGYNAiH3PmCj5bLdy05yGa1SzFO102_bcg')
let contagem = 0

const botones = Extra.markup(Markup.inlineKeyboard([ 
    Markup.callbackButton('+1', 'add 1'),
    Markup.callbackButton('+10', 'add 10'),
    Markup.callbackButton('+100', 'add 100'),
    Markup.callbackButton('-1', 'sub 1'),
    Markup.callbackButton('-10', 'sub 10'),
    Markup.callbackButton('-100', 'sub 100'),
    Markup.callbackButton('🔃 Zerar', 'reset'),
    Markup.callbackButton('Resultado', 'result')
], { columns: 3 }))

bot.hears(['quiero comprar', 'buenos dias', 'quiero informacion'], ctx => {
  ctx.reply('Hola soy un bot 👋 mi nombre es luigui');
  ctx.reply('Porfavor inicie con /start para las opciones');
})


bot.help(ctx => {
    const helpMessage = `
    *Purocodigo frases bot*
    /start - Iniciar bot
    `

    bot.telegram.sendMessage(ctx.from.id, helpMessage, {
        parse_mode: "Markdown"
    })
})

bot.command('start', ctx => {
    sendStartMessage(ctx);
})

function sendStartMessage (ctx) {
const nome = ctx.update.message.from.first_name
    const startMessage = `Bienvenid@, ${nome}`;

    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "Celulares", callback_data: 'quote'}
                ],
                [
                    {text: "Nuestro website", url: "https://www.mercadolibre.com.pe/c/celulares-y-telefonos"}
                ],
                [
                    {text: "Creditos", callback_data: 'credits'}
                ]
            ]
        }
    })
}

bot.action('credits', ctx => {
    ctx.answerCbQuery();
    ctx.reply('Creado por Jonathan');
})

bot.action('quote', ctx => {
    ctx.answerCbQuery();

    const menuMessage = "¿Que tipo de frase quieres?"
    bot.telegram.sendMessage(ctx.chat.id, menuMessage, {
        reply_markup: {
            keyboard: [
                [
                    { text: "Frases de amistad" },
                    { text: "Chistes cortos" },
                    { text: "Frases para informaticos" }
                ],
                [
                    { text: "Salir" }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
    
})

async function fetchQuote(type) {
    const res = await axios.get('http://localhost:3000/quotes/' + type);
    return res.data.quote;
}

bot.hears('Frases de amistad', async (ctx) => {
    const quote = await fetchQuote('amistad')
    ctx.reply(quote);
})

bot.hears('Chistes cortos', async (ctx) => {
    const quote = await fetchQuote('graciosas')
    ctx.reply(quote);
})

bot.hears('Frases para informaticos', async (ctx) => {
    const quote = await fetchQuote('informaticos')
    ctx.reply(quote);
})

bot.hears('Salir', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Hasta luego", {
        reply_markup: {
            remove_keyboard: true
        }
    })
})

bot.launch();
