document.getElementById('paymentForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const method = document.querySelector('input[name="method"]:checked').value;
  const userId = localStorage.getItem('userId') || null;

  if (!userId) {
    alert("Debes iniciar sesión para continuar.");
    return;
  }

  switch (method) {
    case 'efectivo':
      const refCode = 'REF-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('result').innerHTML = `
        <h3>Pago en efectivo</h3>
        <p>Tu código de pago es: <strong>${refCode}</strong></p>
        <p>Entrégalo al repartidor.</p>`;
      break;

    case 'nequi':
      window.location.href = 'https://wa.me/573001112233?text=Quiero%20pagar%20mi%20pedido%20por%20Nequi';
      break;

    case 'daviplata':
      window.location.href = 'https://wa.me/573001112244?text=Quiero%20pagar%20mi%20pedido%20por%20Daviplata';
      break;

    case 'pse':
      const dummyUrl = 'https://sandbox.pse.com.co/payment/confirm?ref=' + Math.floor(100000 + Math.random() * 900000);
      window.location.href = dummyUrl;
      break;
  }
});

// Simulación de sesión iniciada
localStorage.setItem("userId", "123");
    