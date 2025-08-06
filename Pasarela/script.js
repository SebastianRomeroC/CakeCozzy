let selectedMethod = null;

// Marcar método seleccionado visualmente
document.querySelectorAll('.payment-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMethod = card.dataset.method;
  });
});

document.getElementById('confirmBtn').addEventListener('click', function () {
  const userId = localStorage.getItem('userId') || null;

  if (!userId) {
    alert("Debes iniciar sesión para continuar.");
    return;
  }

  if (!selectedMethod) {
    alert("Por favor selecciona un método de pago.");
    return;
  }

  const result = document.getElementById('result');
  result.innerHTML = ''; // Limpiar contenido anterior

  switch (selectedMethod) {
    case 'efectivo':
      const refCode = 'REF-' + Math.floor(100000 + Math.random() * 900000);
      result.innerHTML = `
        <h3>Pago en efectivo</h3>
        <p>Tu código de pago es: <strong>${refCode}</strong></p>
        <p>Entrégalo al repartidor.</p>`;
      break;

    case 'nequi':
      result.innerHTML = `
        <h3>Paga con Nequi</h3>
        <p>Escanea el siguiente código QR para realizar tu pago:</p>
        <img src="/Pasarela/img/QR.jpeg" alt="QR Nequi" style="max-width: 200px;">`;
      break;

    case 'daviplata':
      result.innerHTML = `
        <h3>Paga con Daviplata</h3>
        <p>Escanea el siguiente código QR para realizar tu pago:</p>
        <img src="/Pasarela/img/QR.jpeg" alt="QR Daviplata" style="max-width: 200px;">`;
      break;

    case 'pse': // Ahora es Datafono
      const dataphoneCode = Math.floor(100000 + Math.random() * 900000);
      result.innerHTML = `
        <h3>Paga con Datafono</h3>
        <p>Ingresa este código en el datáfono:</p>
        <p><strong>${dataphoneCode}</strong></p>`;
      break;
  }
});

// Simulación de sesión iniciada
localStorage.setItem("userId", "123");
