
const pasteles = [];
const carrito = [];


const sabores = [
    "Chocolate",
    "Vainilla",
    "Fresa",
    "Limon",
    "Caramelo"
];

function loadSabores() {
    const saborSelect = document.getElementById("pastelSabor");
    saborSelect.innerHTML =  `<option value = "">Seleccione un sabor</option>`;
    sabores.forEach(sabor =>{
        const option = document.createElement("option");
        option.value = sabor;
        option.textContent = sabor;
        saborSelect.appendChild(option);

    });

}

const pastelForm = document.getElementById("addPastelForm");

pastelForm.addEventListener("submit", e => {

    e.preventDefault();
    const name = document.getElementById("pastelName").value;
    const sabor = document.getElementById("pastelSabor").value;
    const personas = document.getElementById("pastelPersonas").value;
    const photoFile = document.getElementById("pastelPhoto").files[0];
    const photo = photoFile ? URL.createObjectURL(photoFile) : "assets/images/default-pastel.jpg";

    if (!name || !sabor || !personas){
        alert("Porfavor, complete todos los campos obligatorios.");
        return;
    }

    const pastel = { name, sabor, personas, photo };
    pasteles.push(pastel);
    updatePastelTable();
    pastelForm.reset();


});

function updatePastelTable() {
    const pastelTable = document.getElementById("pastelTableBody");
    pastelTable.innerHTML = "";
    pasteles.forEach((pastel, index) => {
        const row = `<tr>
            <td><img src="${pastel.photo}" alt="${pastel.name}" style="width: 50px; height: 50px; border-radius: 50%;"></td>
            <td>${pastel.name}</td>
            <td>${pastel.sabor}</td>
            <td>${pastel.personas}</td>
            <td><button onclick="agregarAlCarrito(${index})">🛒</button></td>
        </tr>`;
        pastelTable.innerHTML += row;
    });
}

function agregarAlCarrito(index) {
    const pastel = pasteles[index];
    carrito.push(pastel);
    updateCarrito();
}

function updateCarrito() {
    const carritoList = document.getElementById("carritoList");
    carritoList.innerHTML = "";
    carrito.forEach((pastel, index) => {
        const item = document.createElement("li");
        item.textContent = `${pastel.name} - ${pastel.sabor} (${pastel.personas} personas)`;
        carritoList.appendChild(item);
    });
}

function vaciarCarrito() {
    carrito.length = 0;
    updateCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
    loadSabores(); 
});

