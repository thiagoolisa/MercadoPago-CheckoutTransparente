export function mascara(tipo, campoInput) {
    switch (tipo) {
    case "telefone": {
    campoInput.value = campoInput.value.replace(/\D/g, ""); 
    campoInput.value = campoInput.value.replace(/^(\d{2})(\d)/g, "($1) $2"); 
    campoInput.value = campoInput.value.replace(/(\d)(\d{4})$/, "$1-$2"); 
        break;

    }
    case "cpf": {
    campoInput.value = campoInput.value.replace(/\D/g, ""); //
    campoInput.value = campoInput.value.replace(/^(\d{3})(\d)/g, "$1.$2");
    campoInput.value = campoInput.value.replace(/(\d)(\d{5})$/, "$1.$2");
    campoInput.value = campoInput.value.replace(/(\d)(\d{2})$/, "$1-$2");
    break;

    }
    case "cnpj": {
    campoInput.value = campoInput.value.replace(/\D/g, "")
    campoInput.value = campoInput.value.replace(/^(\d{2})(\d)/, "$1.$2")
    campoInput.value = campoInput.value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    campoInput.value = campoInput.value.replace(/\.(\d{3})(\d)/, ".$1/$2")
    campoInput.value = campoInput.value.replace(/(\d{4})(\d)/, "$1-$2")
    break;

    }
    case "cep": {
    campoInput.value = campoInput.value.replace(/\D/g, "")
    campoInput.value = campoInput.value.replace(/^(\d{5})(\d)/, "$1-$2")
    break;
    
    }
    case "moeda": {
    campoInput.value = campoInput.value.replace(/\D/g, "")
    var tmp = campoInput.value + '';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
    tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    campoInput.value = 'R$ ' + tmp
    break;

    }
    case "data": {
    campoInput.value = campoInput.value.replace(/\D/g, "")
    campoInput.value = campoInput.value.replace(/(\d{2})(\d)/, "$1/$2")
    campoInput.value = campoInput.value.replace(/(\d{2})(\d)/, "$1/$2")
    break;

    }
    case "placa": {

    campoInput.value = campoInput.value.replace(/^(\d{3})(\d)/, "$1-$2")
    break;

    }
    case "cartão": {
    let v = campoInput.value
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{4})(\d)/g, "$1 $2");
    v = v.replace(/^(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3");
    v = v.replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3 $4");
    campoInput.value = v;
    }
    }
   }
   let alinhar
   export function aplicarMascara($input, tipo) {
    mascara(tipo, $input)
    $input.onKeyPress(() => {
    $w('#boxErro').hide()
    if (alinhar) {
    clearTimeout(alinhar)
    }
    alinhar = 'undefined'
    alinhar = setTimeout(() => {
    mascara(tipo, $input)
    }, 600);
    })
   }