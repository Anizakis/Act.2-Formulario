// Imprime mensajes iniciales en la consola
console.log('Desarrollo de Recursos Animados para Web');
console.log('Actividad 2');

// Selecciona todos los elementos con la clase "step" (pasos del formulario)
const steps = document.querySelectorAll('.step');
// Selecciona todas las secciones del acordeón
const sections = document.querySelectorAll('.accordion-section');

// Agrega un evento de clic a cada paso
steps.forEach(step => {
    step.addEventListener('click', () => {
        const stepNumber = step.dataset.step; // Obtiene el número del paso desde el atributo "data-step"
        activateStep(stepNumber); // Activa el paso correspondiente
    });
});

// Función para avanzar al siguiente paso
function nextStep(stepNumber) {
    activateStep(stepNumber); // Activa el paso especificado
}

// Función para activar un paso específico
function activateStep(stepNumber) {
    // Elimina la clase "active" de todos los pasos
    steps.forEach(step => step.classList.remove('active'));
    // Elimina la clase "active" de todas las secciones
    sections.forEach(section => section.classList.remove('active'));

    // Agrega la clase "active" al paso correspondiente
    document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
    // Agrega la clase "active" a la sección correspondiente
    document.querySelector(`#step-${stepNumber}`).classList.add('active');
}