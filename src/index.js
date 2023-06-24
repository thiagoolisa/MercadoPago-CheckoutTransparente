import { controleDeCartaoDeCredito, setValorDaVenda } from 'public/checkout/cartaoDeCredito'
$w.onReady(function () {

    controleDeCartaoDeCredito()
    setValorDaVenda('700')

});
