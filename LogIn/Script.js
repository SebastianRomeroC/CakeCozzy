// EXPLICACIÓN: Este código se ejecuta cuando el DOM (toda la estructura HTML) está completamente cargado.
document.addEventListener('DOMContentLoaded', function() {

    // 1. Seleccionamos el botón de Google usando el ID que le pusimos en el HTML.
    const googleSignInButton = document.getElementById('google-signin-btn');

    // 2. Verificamos que el botón realmente exista para evitar errores.
    if (googleSignInButton) {
        // 3. Añadimos un "escuchador de eventos" que espera a que el usuario haga clic en el botón.
        googleSignInButton.addEventListener('click', function() {
            // 4. Cuando el usuario hace clic, se ejecuta esta acción.
            // Por ahora, solo mostramos un mensaje de alerta.
            // Más adelante, aquí podrías poner el código real para el inicio de sesión con Google.
            alert('¡Botón presionado! Aquí iría la lógica para iniciar sesión.');
        });
    }

});