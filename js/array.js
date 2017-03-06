'use strict'

var vectorEstado = [];
var vectorClave = [];
var index_i=0;
var index_f=0;
var elemento_f=$('.elemento.f .value');
var run_animation = false;
var initComplete = false;
//Generar Vector Estado
(function (){
    var vector = $('.vector-estado');
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
    $('.vector-estado .elemento .value').each(function(){
        vectorEstado.push($(this));
    });

})();
function generateKeyVector(clave){
    var vector = $('.vector-clave');
    for(var i=0; i<16; i++){
        var fila = '<div class="fila">';
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
        fila+='</div>'
        vector.append(fila);
    }
    $('.vector-clave .elemento .value').each(function(){
        vectorClave.push($(this));
    });
}

function swap(i,j, callback){
    var elemento_i= vectorEstado[i];
    var elemento_j= vectorEstado[j];
    var coor_i = elemento_i[0].getBoundingClientRect();
    var coor_j = elemento_j[0].getBoundingClientRect();
    console.log(coor_i, coor_j);
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
            callback(i,j);
        });;
}


function resetStyles(i,f){
    vectorClave[i].css('border-color', '#DADADA');
    vectorEstado[i].css({'border-color': '#DADADA','z-index':'auto'});
    vectorEstado[f].css({'border-color': '#DADADA','z-index':'auto'});
}
function selectElement(i){
    vectorEstado[i].css('border-color','red');
    vectorClave[i].css('border-color','red');
}
function initilizeComplete(){
    $('button#step, button#ir-final').addClass('click-animation');
}
function swapStepVector(){

    if(index_i<256){

        index_f += vectorEstado[index_i].data('value')+ vectorClave[index_i].data('value');
        index_f %= 256;
        elemento_f.text(index_f);
        swap(index_i,index_f, function(i,f){
            resetStyles(i,f);
            var tmp = vectorEstado[i];
            vectorEstado[i] = vectorEstado[f];
            vectorEstado[f] = tmp;
            if(++i<=256) selectElement(i);
            else initilizeComplete();
            run_animation=false;
        });
        index_i++;
    }
}
function swapCompleteVector(){
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
        vectorEstado[i].text(vectorS[i]);

    }
    initilizeComplete();
}
$('button#step').on('click',function(){
    if(!run_animation) {
        run_animation=true;
        swapStepVector();
    }
});
$('button#ir-final').on('click',function(){
    if(!run_animation){
        resetStyles(index_i,index_f);
        elemento_f.text('').parent().addClass('no-value');
        swapCompleteVector();
    }

})
function init(){
    index_i=0;
    index_f=0;
    $('body').removeClass('modal-open');
    generateKeyVector($('#input-key')
                            .val()
                            .split(','));
                            //.map(function(item){
                                // Añadir codigo si se permiten letras...
                                //return parseInt(item, 10);
                            //})
    selectElement(index_i);
    elemento_f.parent().removeClass('no-value');
    elemento_f.text(0);
}
generateKeyVector(['2','5']);
$('#cifrar').on('click', function(){
    var filled = $('#modal #box input:text').filter(function(){
        if($(this).val()==''){
            $(this).css('border','3px solid #9D1717');
            return 0;
        }
        return $(this);
    }).length;

    if (filled==2){
        init();
    }
});
