// Esta función filtra las tarjetas por el texto escrito en el campo de búsqueda
function filtrarTarjetas() {
  const input = document.getElementById("buscador").value.toLowerCase();
  const tarjetas = document.querySelectorAll(".tarjeta");

  tarjetas.forEach(tarjeta => {
    const texto = tarjeta.querySelector("p").innerText.toLowerCase();
    // Muestra u oculta la tarjeta dependiendo si incluye el texto del input
    tarjeta.style.display = texto.includes(input) ? "block" : "none";
  });
}
