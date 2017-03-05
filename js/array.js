'use strict'

var vectorEstado = [];
var vectorClave = [];
var index_i=0;
var index_f=0;
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

function swap(){
    var i= index_i;
    var j = index_f;
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
        },2000, function(){
            $(this).css({'border-color': '#DADADA','z-index':'auto'}).find('span').text(j)
        });
    elemento_j
        .css({'border-color': 'green','z-index':'10'})
        .animate({
            left: `+=${coor_i.left - coor_j.left}`,
            top: `+=${coor_i.top - coor_j.top}`
        },2000, function(){
            $(this).css({'border-color': '#DADADA','z-index':'auto'}).find('span').text(i);
        });;

    var tmp = vectorEstado[i];
    vectorEstado[i] = vectorEstado[j];
    vectorEstado[j] = tmp;
}
var step = 0;
function swapStepVector(){

    if(index_i<256){

        index_f += vectorEstado[index_i].data('value')+ vectorClave[index_i].data('value');
        index_f %= 256;
        swap();
        console.log(index_i,index_f);
        index_i++;
    }


}
$('button#step').on('click',function(){
    swapStepVector();
});
//swap(20, 255);
generateKeyVector(['4']);
$('#cifrar').on('click', function(){
    var filled = $('#modal #box input:text').filter(function(){
        if($(this).val()==''){
            $(this).css('border','3px solid #9D1717');
            return 0;
        }
        return $(this);
    }).length;

    if (filled==2){
        $('body').removeClass('modal-open');
        generateKeyVector($('#input-key')
                                .val()
                                .split(','));
                                //.map(function(item){
                                    // Añadir codigo si se permiten letras...
                                    //return parseInt(item, 10);
                                //})

    }
});
