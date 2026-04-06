# VK Audit MVP

Мини-сервер для экспресс-аудита VK-сообществ.

## Быстрый старт

1. Установить Node.js 18+
2. Распаковать архив
3. В папке проекта выполнить:
   npm install
4. Скопировать .env.example в .env
5. Запустить:
   npm run dev

## Проверка

POST http://localhost:3000/api/analyze-vk
Content-Type: application/json

{
  "url": "https://vk.com/example"
}

## Что сейчас делает

- валидирует VK-ссылку
- вытаскивает screen_name / club / public
- отдает мок-результат аудита

## Дальше

- подключить VK API
- подключить LLM
- встроить в лендинг
