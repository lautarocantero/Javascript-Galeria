
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}


function validarFormulario(e){

    e.preventDefault();

    if(termino === ''){
        mostrarAlerta('debes ingresar algo');
        return;
    }

    //pasa la validacion
    buscarImagenes();

}

function mostrarAlerta(mensaje){

    const viejaAlerta = document.querySelector('.alerta');
    if(viejaAlerta){
        viejaAlerta.remove();
    }

    const alerta = document.createElement('P');
    alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','alerta');

    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> ${mensaje} </span>
    `
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 2000);

}

async function buscarImagenes(){

    const termino = document.querySelector('#termino').value;

    const key = '20796340-393e3765d24ca4e9b62c58f51';
    const url =`https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    // fetch(url)               SIN ASYNC AWAIT
    //     .then( respuesta => respuesta.json())
    //     .then( resultado => {
    //         totalPaginas = calcularPaginas(resultado.totalHits);
    //         console.log(totalPaginas);
    //         mostrarImagenes(resultado.hits)
    //     });

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits)
    } catch (error) {
        console.log('error')
    }

}

//generador que va a registrar la cantidad de elementos de acuerdo a las paginas 

function * crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;        //registrar valor en el generador
    }
}


function mostrarImagenes(imagen){

    

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }   

    //iterar en el arreglo y construir html

    imagen.forEach(imagen => {
        const {previewURL,largeImageURL, likes, views} = imagen; 

        resultado.innerHTML += 
        `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">Me Gusta</span> </p>
                    <p class="font-bold">${views} <span class="font-light">Views</span> </p>
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" 
                    href=${largeImageURL} target="_blank" rel="noopener noreferrer">Ver imagen completa</a>
                </div>
            </div>
        </div>
        
        
        `

    });

    limpiarPaginador();

    imprimirPaginador();    

}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    
    while(true){
        const {value,done} = iterador.next();
        if(done){
            return;
        }

        //genera un boton por cada elemento en el generador

        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-10','uppercase','rounded');

        boton.onclick= () =>{
            paginaActual = value;
            buscarImagenes();
        }

        paginacion.appendChild(boton);

    }
}


function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina)); //devuevle un entero de el resto de esta cuenta redondeando para arriba
}


function limpiarPaginador(){
    
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild);
    }
}