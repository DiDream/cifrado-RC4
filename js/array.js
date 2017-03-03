'use strict'

//Generar Vector Estado
var vectorEstado = $('.vector-estado');
for(var i=0; i<16; i++){
    var fila = '<div class="fila">';
    for(var j=0; j<16; j++){
        var value = i*16+j;
        fila += `<div class="elemento">${value.toString(16)}</div>`;
    }
    fila+='</div>'
    vectorEstado.append(fila);
}

var elementos = [];
$('.vector-estado .elemento').each(function(){
    elementos.push($(this));
});
console.log(elementos);
elementos[20].css('background-color', 'red');
elementos[255].css('background-color', 'green');
var elemento_i = elementos[20][0].getBoundingClientRect();
var elemento_j = elementos[255][0].getBoundingClientRect();
console.log(elemento_i, elemento_j);
elementos[20].css('z-index','10').animate({
    left: elemento_j.left-elemento_i.left,
    top: elemento_j.top-elemento_i.top
},2000,function(){
    $(this).css('z-index','auto');

});
elementos[255].css('z-index','10').animate({
    left: elemento_i.left-elemento_j.left,
    top: elemento_i.top-elemento_j.top
},2000,function(){
    $(this).css('z-index','auto');
});
// var temp = elementos[20];
// elementos[20]= elementos[255];
// elementos[255]=temp;
console.log(elementos[255]);
