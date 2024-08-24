//Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca,
    this.year = year,
    this.tipo = tipo
}

//Realiza la cotizacion con los datos
//NOTA NO SE UTILIZA ARROW FUNCTION PORQUE AQUI SI ACCEDE A ELEMENTOS .this

Seguro.prototype.cotizarSeguro = function () {
    /**SERIA UN ALGORITMO
     *  1= Americoano 1.15
     *  2 = Asiatico 1.05
     *  3 = Europeo 1.35
     */


    let cantidad;

    const base = 2000;

    //En caso que tengamos que poner muchas opciones para no tener que poner muchos if e else if, podemos usar un siwtch en el cual nos permite poner muchos casos
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        
        case '2':
            cantidad = base * 1.05;
            break;

        case '3':
            cantidad = base * 1.35;
            break;
            
        default:
            break;
    }

    //Vamos a agregarle complejidad, por cada año que el automovil sea mas viejo, el precio va a bajar un 3%

    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    //Cada año que la diferencia es mayor
    cantidad -= ((diferencia * 3) * cantidad) / 100;
    
    /*
        Si el seguro es basico se multiplica por un 30% más
        Si el seguro es completo se multiplica por un 50% más
    */
    if (this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}


//En el objeto de la interface estara vacio porque lo vamos llenando a medida que van pasando los eventos
function UI(){}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 30

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }

}

// Aqui mandamos a llenar las opcions
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); //Llena el select con los años
})


// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    const div = document.createElement('DIV');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10')
    div.textContent = mensaje;

    // insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    //Recuerda para insertbefore(nuevo nodo, el nodo donde deseas insertar)  recuerda que se pone en el nodo siguiente
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);

    
}
//Crear un prototype en el UI para mostrar el resultado 

UI.prototype.mostrarResultado = (total, seguro) => {

    //Aplicamos un destructuring para extraer los valores de las llaves de seguro que es el parametro que le estamos pidiendo anteriormente
    const { marca, year, tipo } = seguro

    let textoMarca;
    
    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        
        case '2':
            textoMarca = 'Asiatico';
            break;
        
        case '3':
            textoMarca = 'Europeo';
            break;
    
        default:
            break;
    }

    // total es un numero se transforma en string para asi poder usar el metodo .slice y solamente mostrar los primero 8 digitos ya que hay resultados con muchos ceros
    console.log(total);
    let totalToString = total.toString(10);
    console.log(totalToString);



    //Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
    <p class="header">Tu Resumen</p>

    <p class="font-bold p-1">Marca: <span class="font-normal"> ${textoMarca}</span> </p>

    <p class="font-bold p-1">Año: <span class="font-normal"> ${year}</span> </p>
    
    <p class="font-bold p-1">Tipo de Seguro: <span class="font-normal capitalize"> ${tipo}</span> </p>

    <p class="font-bold p-1">Total: <span class="font-normal"> $ ${totalToString.slice(0,7)}</span> </p>
    `

    const resultadoDiv = document.querySelector('#resultado');

    //Mostrar el spiner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    //En vez de poner .remove() es mejor poner display none, la digerencia es que el spinner ya estaba en el html, no lo estamos creando con un docuement.createElement
    setTimeout(() => {
        spinner.style.display= 'none'; //Se borra el spinner pero se muestra el resultado
        resultadoDiv.appendChild(div);

    }, 3000);
}

//Funcion para limpiar div de resultado



// INSTANCEAR UI 
const ui = new UI();



eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
                                          
}

function cotizarSeguro(e) {
    e.preventDefault();

    //Leer la marca seleccionado
    const marca = document.querySelector('#marca').value;


    //Leer el año seleccionado
    const year = document.querySelector('#year').value;



    //Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value; //De esta manera podemos obtener cual input esta chequeado es una sytaxis de CSS

    //Aqui hacemos la condicional para mostrar el alert

     if (marca === '' || year === '' || tipo === '') {
         ui.mostrarMensaje('Todos los campos son oblicatorios', 'error');
         return;
    } 
    ui.mostrarMensaje('Cotizando...', 'exito');

    //Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div'); //Recuerda que con query selector despues de seleccionar un div mediante su clase o id si dejamos un espacio luego podemos seleccionar uno de sus hijos por ejemplo si queremos tomar un div dentro del <div id"resultado"> <div>...</div> </div> seria como el ejemplo anterior #resultado div

    //Como al principio #resultado no tiene ningun div porque no lo hemos agregado arrojaria un null, entonces todo lo que sea distinto a null, ahi si lo eliminamos
    if (resultados != null) {
        resultados.remove();
    }
        

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    console.log(total);

    // Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);
}

