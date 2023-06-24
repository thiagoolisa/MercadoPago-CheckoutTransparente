let alinhar
export function sincronzar($input, campoDoForm) {
 $input.onKeyPress(() => {
 $w('#boxErro').hide()
 if (alinhar) {
 clearTimeout(alinhar)
 }
 alinhar = 'undefined'
 alinhar = setTimeout(() => {
 if (campoDoForm === 'cardNumber') 
 {
$w('#htmlSdkMercadoPago').postMessage({ 'id': campoDoForm, 'value': $input.value.split(' ').join('') })
 } else if (campoDoForm === 'docNumber')
 {
 $w('#htmlSdkMercadoPago').postMessage({ 'id': campoDoForm, 'value': $input.value.replace('.','').replace('.','').replace('.','').replace('-','').replace('/','')})
 } else 
 {
 $w('#htmlSdkMercadoPago').postMessage({ 'id': campoDoForm, 'value': $input.value })
 }
 console.log($input.value)
 }, 600);
 })
}
export function sincronizarDropdown($input, campoDoForm) {
 $input.onChange(() => {
 $w('#boxErro').hide()
 $w('#htmlSdkMercadoPago').postMessage({ 'id': campoDoForm, 'value': $input.value })
 })
}
