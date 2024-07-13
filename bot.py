from telegram.ext import Updater, CommandHandler

# Ваш токен от BotFather в Telegram
token = '7041304147:AAH_s9MPbW6LIGg8JnpMunHWJPpBsOyUrzQ'

# Создаем Updater и передаем в него токен бота
updater = Updater(token, use_context=True)

# Обработчик команды /game
def game(update, context):
    chat_id = update.message.chat_id
    context.bot.send_message(chat_id, "Игра Тетрис доступна по ссылке: https://your-domain.com/tetris/index.html")

# Добавляем обработчик для команды /game
updater.dispatcher.add_handler(CommandHandler('game', game))

# Запускаем бота
updater.start_polling()

# Ожидаем завершения работы бота
updater.idle()
