'use strict'

function KSA_completed(){
    var botones = controles.step.add(controles.complete);
    botones.addClass('click-animation');
    $('#vector-k').addClass('hide');
    $('#vector-original-message').removeClass('hide');
    $('#vector-cipher-sec').removeClass('hide');
    $('#crypted-message').removeClass('hide');
    elemento_f.text('').parent().addClass('no-value');

    current_method.step = function(){
        botones.removeClass('click-animation');
        // SPRITZ_init();
        PRGA_init();
    };
    current_method.complete = function(){
        botones.removeClass('click-animation');
        alert("No implementado");
        current_method.complete = function(){
            alert('No implementado');
        }
    };

}
function KSA_step(){

    if(index_i<256){

        index_f = ( index_f+VectorS(index_i)+ VectorK(index_i) )%256;
        elemento_f.text(index_f);
        swap(index_i,index_f, function(i,f){
            vectorClave[i][0].style.cssText=';'
            if(++i<=256) selectElements(i);
            else KSA_completed();
            run_animation=false;
        });
        index_i++;
    }
}
function KSA_complete(){
    resetStyles(index_i,index_f);
    var vectorS=[], vectorK=[];
    for(var i=0; i<256; i++){
        vectorS.push(vectorEstado[i].data('value'));
        vectorK.push(vectorClave[i].data('value'));
    }
    while(index_i<256){
        index_f = (index_f+vectorS[index_i]+vectorK[index_i])%256;

        var tmp = vectorS[index_i];
        vectorS[index_i] = vectorS[index_f];
        vectorS[index_f] = tmp;
        index_i++;
    }
    for(var i=0; i<256; i++){
        vectorEstado[i].attr('data-value',vectorS[i]);
        vectorEstado[i].data('value', vectorS[i]);
        vectorEstado[i].text(vectorS[i]);

    }
    KSA_completed();
}
function KSA_init(key){
    index_i=0;
    index_f=0;
    $('body').removeClass('modal-open');
    $('#vector-k').removeClass('hide');
    generateKeyVector(key);
    selectElements(index_i);
    generateOriginalMessageVector($('#input-message')
                                        .val()
                                        .split(',')
                                        .map(function(item){
                                            return parseInt(item);
                                        }));
    elemento_f.parent().removeClass('no-value');
    elemento_f.text(0);
    current_method.step = KSA_step;
    current_method.complete = KSA_complete;


}
