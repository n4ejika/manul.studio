# manul.studio production

Публичный production-репозиторий сайта Manul. Он содержит только готовую
статическую сборку без исследований, рабочих материалов и внутренних данных.

## Выпуск новой версии

1. В `C:\project\n4ejika\astro-site` внести изменения, выполнить Astro production-сборку и полный QA.
2. Синхронизировать `C:\project\n4ejika\astro-site\dist` с этим репозиторием.
3. Проверить изменения, сделать commit и push в `main`.
4. Дождаться успешной проверки `Quality and deploy` в GitHub Actions.
5. Запустить этот workflow вручную через `Run workflow` для публикации на Fornex.

Языковая архитектура production: английская версия находится в корне `/`,
русская — в `/ru/`. Старые адреса `/en/` и русские URL без `/ru/`
сохраняются только как постоянные редиректы в `.htaccess`.

Перед выкладкой workflow создаёт архив текущей версии сайта. Для GitHub
Environment `production` необходимы секреты `FORNEX_SSH_KEY` и
`FORNEX_KNOWN_HOSTS`.
