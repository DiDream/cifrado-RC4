'use strict'

/* DECLARACION DE VARIABLES */
var vectorEstado = [];
var vectorClave = [];
var index_i=0;
var index_f=0;
var elemento_f = $('.elemento.f .value');
var original_message = [];
var run_animation = false;
var current_method = new Object();
var controles = {
    step: $('button#step'),
    complete: $('button#ir-final'),
    stop: $('button#parar')
};
var elementVectorStyles;

/* FUNCIONES */
//Generar Vector Estado
(function (){
    var vector = $('#vector-s .vector');
    for(var i=0; i<16; i++){
        var fila = '<div class="fila">';
        for(var j=0; j<16; j++){
            var value = i*16+j;
            fila += `
                    <div class="elemento">
                        <div class="value" data-value="${value}">
                            ${value}
                        </div>
                        <span class="index">${value}</span>
                    </div>`;
        }
        fila+='</div>'
        vector.append(fila);
    }
    $('#vector-s .elemento .value').each(function(){
        vectorEstado.push($(this));
    });

})();
//Generar vector K
function generateKeyVector(clave){
    var vector = $('#vector-k .vector');
    for(var i=0; i<16; i++){
        var fila = '';
        for(var j=0; j<16; j++){
            var index = (i*16+j);
            var value = clave[index%clave.length];
            fila += `
                    <div class="elemento">
                        <div class="value" data-value="${value}">
                            ${value}
                        </div>
                        <span class="index">${index}</span>
                    </div>`;
        }
        vector.append(fila);
    }
    $('#vector-k .elemento .value').each(function(){
        vectorClave.push($(this));
    });
}
// Generar vector de mensaje original
function generateOriginalMessageVector(message){
    original_message = message;
    var vector = $('#vector-original-message .vector');
    var fila = '';
    for(var i=0; i<message.length; i++){

        fila+= `
                <div class="elemento">
                    <div class="value" data-value="${message[i]}">
                        ${message[i]}
                    </div>
                    <span class="index">${i}</span>
                </div>`;

    }
    vector.append(fila);
}
// Intercambiar elementos + animacion
function swap(i,j, callback){
    var elemento_i= vectorEstado[i];
    var elemento_j= vectorEstado[j];
    var coor_i = elemento_i[0].getBoundingClientRect();
    var coor_j = elemento_j[0].getBoundingClientRect();
    elemento_i
        .css({'border-color': 'red','z-index':'10'})
        .animate({
            left: `+=${coor_j.left - coor_i.left}`,
            top: `+=${coor_j.top - coor_i.top}`
        },1000);
    elemento_j
        .css({'border-color': 'green','z-index':'10'})
        .animate({
            left: `+=${coor_i.left - coor_j.left}`,
            top: `+=${coor_i.top - coor_j.top}`
        },1000, function(){
            var tmp = vectorEstado[i];
            vectorEstado[i] = vectorEstado[j];
            vectorEstado[j] = tmp;
            resetStyles(i,j);
            callback(i,j);
        });
}
//Seleccionar elemento i del vector S y K
function selectElements(i){
    vectorEstado[i].css('border-color','red');
    vectorClave[i].css('border-color','red');
}
//Resetea estilos css
function resetStyles(i,f){
    vectorClave[i].css('border-color', '#DADADA');
    vectorEstado[i].css({'border-color': '#DADADA','z-index':'auto'});
    vectorEstado[f].css({'border-color': '#DADADA','z-index':'auto'});
}
// Operacion XOR dados dos valores end decimal
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
// Añade un div.elemento a 'vectorElement'
function AppendVector(vectorElement, value){
    vectorElement.append(`
        <div class="elemento">
            <div class="value" data-value="${value}">
                ${value}
            </div>
        </div>
        `);
}

function VectorS(index){
    return vectorEstado[index%256].data('value');
}
function VectorK(index){
    return vectorClave[index%256].data('value');
}


/* EVENTOS */

$('#cifrar').on('click', function(){
    var filled = $('#modal #box input:text').filter(function(){
        if($(this).val()==''){
            $(this).css('border','3px solid #9D1717');
            return 0;
        }
        return $(this);
    }).length;

    if (filled==2){
        KSA_init($('#input-key').val().split(','));
    }
});
controles.step.on('click',function(){
    if(!run_animation) {
        run_animation=true;
        current_method.step();
    }
});
controles.complete.on('click',function(){
    if(!run_animation){

        current_method.complete();
    }

});
