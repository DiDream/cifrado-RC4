var vec_cipher_sec = $('#vector-cipher-sec .vector');
var crypted_message = $('#crypted-message .vector');

function PRGA_init(){
    index_i=index_f=0;
    elemento_f.text(index_f).parent().removeClass('no-value');
    selectElements((++index_i)%256)
    current_method.step=PRGA_firstStep;
    PRGA_firstStep();
}
function PRGA_firstStep(){

    index_f = (index_f+vectorEstado[index_i].data('value'))%256;
    vectorEstado[index_f].css('border-color', '#179D9C');
    current_method.step = PRGA_secondStep;
    run_animation =false;

}
function PRGA_secondStep(){
    var index_t= (vectorEstado[index_i].data('value') + vectorEstado[index_f].data('value'))%256;
    var t = vectorEstado[index_t].data('value');
    AppendVector(vec_cipher_sec, t);
    var crypted_val = xor_operation(original_message[index_i-1], t);
    AppendVector(crypted_message,crypted_val);
    swap(index_i, index_f, function(i,f){
        run_animation=false;
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
    //No implementado
}
