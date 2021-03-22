
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}


function validarFormulario(e){

    e.preventDefault();
    const termino = document.querySelector('#termino').value;

    if(termino === ''){
        mostrarAlerta('debes ingresar algo');
        return;
    }

    //pasa la validacion
    buscarImagenes(termino);

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

function buscarImagenes(termino){

    const key = '20796340-393e3765d24ca4e9b62c58f51';
    const url =`https://pixabay.com/api/?key=${key}&q=${termino}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => {
            mostrarImagenes(resultado.hits)
        });

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

}