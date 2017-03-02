'use strict'
var array = $('.array');
for(var i=0; i<256; i++){
    array.append(`<div class="celda">${i.toString(16)}</div>`);
}
