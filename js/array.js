'use strict'

var vectorEstado = [];
var vectorClave = [];
var index_i=0;
var index_f=0;
var elemento_f=$('#valor-f');
//Generar Vector Estado
(function (){
    var vector = $('.vector-estado');
    for(var i=0; i<16; i++){
        var fila = '<div class="fila">';
        for(var j=0; j<16; j++){
            var value = i*16+j;
            fila += `
                    <div class="elemento" data-value="${value}">
                        ${value}
                        <span class="index">${value}</span>
                    </div>`;
        }
        fila+='</div>'
        vector.append(fila);
    }
    $('.vector-estado .elemento').each(function(){
        vectorEstado.push($(this));
    });

})();
function generateKeyVector(clave){
    var vector = $('.vector-clave');
    for(var i=0; i<16; i++){
        var fila = '<div class="fila">';
        for(var j=0; j<16; j++){
            var index = (i*16+j);
            fila += `
                    <div class="elemento" data-value="${clave[index%clave.length]}">
                        ${clave[index%clave.length]}
                        <span class="index">${index}</span>
                    </div>`;
        }
        fila+='</div>'
        vector.append(fila);
    }
    $('.vector-clave .elemento').each(function(){
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
        },2000);
    elemento_j
        .css({'border-color': 'green','z-index':'10'})
        .animate({
            left: `+=${coor_i.left - coor_j.left}`,
            top: `+=${coor_i.top - coor_j.top}`
        },2000, function(){
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
function swapStepVector(){

    if(index_i<256){

        index_f += vectorEstado[index_i].data('value')+ vectorClave[index_i].data('value');
        index_f %= 256;
        elemento_f.text(index_f);
        swap(index_i,index_f, function(i,f){
            vectorEstado[i].find('span').text(f);
            vectorEstado[f].find('span').text(i);
            resetStyles(i,f);
            var tmp = vectorEstado[i];
            vectorEstado[i] = vectorEstado[f];
            vectorEstado[f] = tmp;
            if(++i<=256){
                selectElement(i);
            }
        });
        console.log(index_i,index_f);
        index_i++;
    }
}
function swapCompleteVector(){
    console.log(vectorEstado);

    var vectorS=[], vectorK=[];
    for(var i=0; i<256; i++){
        vectorS.push(vectorEstado[i].data('value'));
        vectorK.push(vectorClave[i].data('value'));
    }
    console.log(vectorS);

    while(index_i<256){
        index_f = (index_f+vectorS[index_i]+vectorK[index_i])%256;

        var tmp = vectorS[index_i];
        vectorS[index_i] = vectorS[index_f];
        vectorS[index_f] = tmp;
        index_i++;
    }
    for(var i=0; i<256; i++){
        vectorEstado[i].attr('data-value',vectorS[i]);
        vectorEstado[i][0].childNodes[0].nodeValue=vectorS[i];

    }
}
$('button#step').on('click',function(){
    swapStepVector();
});
$('button#ir-final').on('click',function(){
    resetStyles(index_i,index_f);
    elemento_f.text('');
    swapCompleteVector();

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
    elemento_f.text(0);
}
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
