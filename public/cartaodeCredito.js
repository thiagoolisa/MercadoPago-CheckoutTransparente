import { aplicarMascara } from 'public/mascaras'
import { sincronzar, sincronizarDropdown } from 'public/checkout/controle'
import { pagarComCartao } from 'backend/mercadoPago'
import { validarEmail, validarDocumento } from 'backend/validador'
import { bandeiras } from 'public/checkout/bandeiras'
let paymentMethod = ''
let bancoCod
let valorDaVenda
export function controleDeCartaoDeCredito() {

    $w('#btnPagar').onClick(() => {
        $w('#stateBoxBotaoPagar').changeState('loading')
        $w('#htmlSdkMercadoPago').postMessage({ 'id': 'submit' })
    })

    $w('#htmlSdkMercadoPago').postMessage({ 'id': 'docType', 'value': 'CPF' })
    listarAnos()
    aplicarMascara($w('#tbNumeroCartao'), 'cartão')
    aplicarMascara($w('#tbNumeroDoDocumento'), 'cpf')
    sincronzar($w('#tbNumeroCartao'), 'cardNumber')
    sincronzar($w('#tbCvv'), 'securityCode')
    sincronizarDropdown($w('#ddMesExpiracao'), 'cardExpirationMonth')
    sincronizarDropdown($w('#ddAnoExpiracao'), 'cardExpirationYear')
    sincronzar($w('#tbEmail'), 'email')
    sincronzar($w('#tbTitular'), 'cardholderName')
    sincronizarDropdown($w('#ddTipoDocumento'), 'docType')
    sincronzar($w('#tbNumeroDoDocumento'), 'docNumber')
    $w('#ddTipoDocumento').onChange(() => {
        if ($w('#ddTipoDocumento').value === 'CPF') {
            $w('#tbNumeroDoDocumento').maxLength = 13
            aplicarMascara($w('#tbNumeroDoDocumento'), 'cpf')
        } else {
            $w('#tbNumeroDoDocumento').maxLength = 18
            aplicarMascara($w('#tbNumeroDoDocumento'), 'cnpj')
        }
    })
    $w('#htmlSdkMercadoPago').onMessage((event) => {
        tratamentoDeDados(event.data)
    })
    function tratamentoDeDados(dado) {
        switch (dado.tipo) {
            case 'paymentMethod':
                paymentMethod = dado.valor
                if (typeof bandeiras[dado.valor] !== 'undefined') {
                    $w('#imgPngFlag').src = bandeiras[dado.valor].image
                    setTimeout(() => {
                        $w('#imgPngFlag').show()
                    }, 1500);
                } else {
                    $w('#imgPngFlag').hide()
                }
                break;
            case 'parcelas':
                $w('#ddParcelas').options = dado.valor
                $w('#ddParcelas').value = dado.valor[0].value
                $w('#ddParcelas').enable()
                break;
            case 'bancos':
                bancoCod = dado.valor
                break;
            case 'erro':
                tratamentoDeErros(dado, 'form')
                break;
            case 'sucesso':
                gerarPagamento(dado.token)
                break;
            default:
                break;
        }
    }
    function tratamentoDeErros(erro, saida) {
        console.log(erro.codigo)
        switch (erro.codigo) {
            
            case '001':
                $w('#txtErro').text = erro.mensagem
                break;

            case 'E301':
                $w('#txtErro').text = 'Número do cartão inválido'
                $w('#imgPngFlag').hide()
                $w('#imgVecFlag').hide()
                break;

            case '205':
                $w('#txtErro, #txtErroFinal').text = 'Número do cartão não informado'
                break;

            case 'E302':
                $w('#txtErro, #txtErroFinal').text = 'Código de segurança do cartão inválido'
                break;

            case '208':
                $w('#txtErro, #txtErroFinal').text = 'Mês de expiração do cartão inválido'
                break;

            case '209':
                $w('#txtErro, #txtErroFinal').text = 'Ano de expiração do cartão inválido'
                break;

            case '221':
                $w('#txtErro, #txtErroFinal').text = 'Nome do titular do cartão inválido'
                break;

            case '214':
                $w('#txtErro, #txtErroFinal').text = 'Número do ' + $w('#ddTipoDocumento'
                ).options[$w('#ddTipoDocumento').selectedIndex].label.toLowerCase() + ' inválido'
                break;
                
            case '316':
                $w('#txtErro, #txtErroFinal').text = 'Nome do proprietário do cartão inválido!'
                break;

            case '2131': 
                $w('#txtErro, #txtErroFinal').text = 'Não foi possível processar o pagemento com este cartão'
                break;

            case '000':   
                $w('#txtErro, #txtErroFinal').text = 'Ocorreu um erro interno, tente novamente com outro cartão ou tente novamente mais tarde!'
                break;
            default:
                console.log(erro)
                break;
        }
        mostrarErro(saida)
    }
    function mostrarErro(saida) {
        if (saida === 'final') {
            $w('#stateBoxPagamentos').changeState('erro')
        } else {
            setTimeout(() => {
                $w('#boxErro').show()
                $w('#stateBoxBotaoPagar').changeState('botao')
            }, 1000)
        }
    }
    function gerarPagamento(token) {
        validarEmail($w('#tbEmail').value)
            .then((validEmail) => {
                console.log('EMAIL', validEmail)
                if (validEmail) {
                    validarDocumento($w('#ddTipoDocumento').value.toLowerCase(), $w('#tbNumeroDoDocumento').value.replace('.', '').replace('.', '').replace('.', '').replace('-', '').replace('/', ''))
                        .then((data) => {
                            if (data) {
                                $w('#stateBoxPagamentos').changeState('processandoPagamento')
                                finalizar()
                            } else {
                                $w('#htmlSdkMercadoPago').postMessage({
                                    'id': 'submitErro'
                                })
                                $w('#txtErro').text = 'O ' + $w('#ddTipoDocumento').v
                                alue.toLowerCase() + ' é inválido'
                                mostrarErro()
                            }
                        })
                } else {
                    $w('#htmlSdkMercadoPago').postMessage({ 'id': 'submitErro' })
                    $w('#txtErro').text = 'E-mail inválido'
                    mostrarErro()
                }
            })
        function finalizar() {
            let data = {
                token: token,
                paymentMethodId: paymentMethod,
                issuer_id: bancoCod,
                email: $w('#tbEmail').value,
                docType: $w('#ddTipoDocumento').value,
                parcelas: $w('#ddParcelas').value,
                valor: Number(valorDaVenda),
                docNumber: $w('#tbNumeroDoDocumento').value.replace('.', '').replace(
                    '.', '').replace('.', '').replace('-', '').replace('/', '')
            }
            pagarComCartao(data)
                .then((data) => {
                    console.log('RETORNO', data)
                    if (data.tipo === 'erro')
                     {
                        $w('#htmlSdkMercadoPago').postMessage({ 'id': 'submitErro' })
                        tratamentoDeErros({
                            'codigo': data.valor.cause.length > 0 ? String(data.valor.cause[0].code) : '000'
                        }, 'final')
                    } else 
                     {
                        if (data.valor.body.status === 'approved')
                         {
                            $w('#stateBoxPagamentos').changeState('sucesso')
                        } else 
                        {
                            $w('#stateBoxPagamentos').changeState('processamento')
                        }
                    }
                })
        }
    }
    function listarAnos() {
        let anoAtual = new Date().getFullYear()
        let op = [{ 'value': String(anoAtual), 'label': String(anoAtual) }]
        for (let i = anoAtual; i < anoAtual + 10; i++) {
            op.push({ 'value': String(i).substr(2, 2), 'label': String(i) })
            if (i === (anoAtual + 10) - 1) 
            {
                $w('#ddAnoExpiracao').options = op
            }
        }
    }
}
export function setValorDaVenda(valor) {
    valorDaVenda = valor
    $w('#htmlSdkMercadoPago').postMessage({
        'id': 'transactionAmount', 'value': valor
    })
}
