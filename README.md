# MP Checkout Transparente

Implementação do Checkout Transparente em um site da WIX, feito no Editor x e utilizando as APIs disponibilizadas pelo Mercado Pago.

## Linguagens e plugins utilizados
- JavaScript ES13, Html 5,
- Velo 4.0.0

## Obter chave (Public key e Access token)
https://www.mercadopago.com/mlb/account/credentials

Obs.: Pelo menos até a data atual, os testes devem ser feitos com a chave de produção, considerando que o Mercado Pago não disponibiliza um painel sandbox no momento.

## Velo 4.0.0
[https://getcomposer.org](https://chrome.google.com/webstore/detail/velo-filesystem/gjmdfafehkeddjhielckakekclainbpn)

Após a instalação, para fazer o download do pacote do Mercado Pago via terminal:
```sh
composer require mercadopago/sdk:0.5.2
```
