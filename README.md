# Currency-API - exchange rates API
[![Dependencies Status](https://david-dm.org/mvandrew/currency-api.svg)](https://david-dm.org/mvandrew/currency-api) [![devDependencies Status](https://david-dm.org/mvandrew/currency-api/dev-status.svg)](https://david-dm.org/mvandrew/currency-api?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Currency exchange rates API based on [NodeJS](https://nodejs.org) & [SailsJS framework](http://sailsjs.org).

## Проблемы и Ошибки
### Решение: ENOENT: no such file or directory

При развертывании приложения и установке зависимостей (npm install) может возникнуть ошибка:

```
ENOENT: no such file or directory
```

Решается проблема следующим образом:
1. Временно очистить секции dependencies и devDependencies.
2. Выполнить команду: ```npm install```.
3. Восстановить секции dependencies и devDependencies.
4. Снова выполнить команду: ```npm install```.

В результате все зависимости должны установится.

Кроме этого, может потребоваться очистить кэш: ```npm cache clear --force```; и установить npm ```npm install -g npm```.
