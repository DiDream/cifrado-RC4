var w=5,j,k,z,cipher_count;

function SPRITZ_init(){
    j=k=z=0;
    index_i=cipher_count=0;
    current_method.step = SPRITZ_PRG;
    SPRITZ_PRG();
}
function SPRITZ_PRG(){
    if(cipher_count<original_message.length){
        index_i= index_i+ w;
        j = k+ VectorS(j+VectorS(index_i));
        k = index_i+k+VectorS(j);
        swap(VectorS(index_i), VectorS(j),function(){
            run_animation = false;
        });
        z = VectorS(j+VectorS(index_i+VectorS(z+k)));
        AppendVector(vec_cipher_sec, z);
        AppendVector(crypted_message,xor_operation(original_message[cipher_count],z));
        cipher_count++;
    }
}
function SPRITZ_complete(){
    //No implementado
}
