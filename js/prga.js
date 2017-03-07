var vec_cipher_sec = $('#vector-cipher-sec .vector');
var crypted_message = $('#crypted-message .vector');
function xor_operation(m,k){
    var result ='';
    m = m.toString(2);
    k = k.toString(2);
    if(m.length<k.length){
        var tmp = m;
        m = k;
        k = tmp;
    }
    console.log(k,m);

    tmp=0;
    while(tmp<k.length){

        tmp++;
        result = (k[k.length-tmp]==m[m.length-tmp]? '0': '1')+result;
    }
    result = m.slice(0,m.length-tmp) +result;
    console.log('XOR result:', result);
    return parseInt(result,2);
}
function PRGA_firstStep(){

    index_f = (index_f+vectorEstado[index_i].data('value'))%256;
    vectorEstado[index_f].css('background-color', '#179D9C');
    current_method.step = PRGA_secondStep;
    run_animation =false;

}
function PRGA_secondStep(){
    var index_t= (vectorEstado[index_i].data('value') + vectorEstado[index_f].data('value'))%256;
    var t = vectorEstado[index_t].data('value');
    vec_cipher_sec.append(`<div class="elemento">
                                <div class="value" data-value="${t}">
                                    ${t}
                                </div>
                                <span class="index">${index_i-1}</span>
                            </div>`);
    var crypted_val = xor_operation(parseInt(original_message[index_i-1]), t);
    crypted_message.append(`<div class="elemento">
                                <div class="value" data-value="${crypted_val}">
                                    ${crypted_val}
                                </div>
                                <span class="index">${index_i-1}</span>
                            </div>`);
    swap(index_i, index_f, function(i,f){
        run_animation=false;
        vectorEstado[i].css({'border-color': '#DADADA','z-index':'auto'});
        vectorEstado[f].css({'border-color': '#DADADA','background-color': '#FAFAFA','z-index':'auto'});
        var tmp = vectorEstado[i];
        vectorEstado[i] = vectorEstado[f];
        vectorEstado[f] = tmp;
        elemento_f.text(index_f);
        current_method.step = PRGA_firstStep;
        if((++index_i)%256<=original_message.length) selectElements(index_i);
        else {
            current_method.step = current_method.complete = function(){
                alert('Mensaje cifrado');
                run_animation = false;
            }
        }

    });

}
function PRGA_complete(){

}
