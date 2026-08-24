# manul.studio production

Публичный production-репозиторий сайта Manul. Он содержит только готовую
статическую сборку без исследований, рабочих материалов и внутренних данных.

## Выпуск новой версии

1. В `C:\project\n4ejika` внести изменения и выполнить production-сборку и QA.
2. Синхронизировать `dist` с этим репозиторием.
3. Проверить изменения, сделать commit и push в `main`.
4. Дождаться успешной проверки `Quality and deploy` в GitHub Actions.
5. Запустить этот workflow вручную через `Run workflow` для публикации на Fornex.

Перед выкладкой workflow создаёт архив текущей версии сайта. Для GitHub
Environment `production` необходимы секреты `FORNEX_SSH_KEY` и
`FORNEX_KNOWN_HOSTS`.
