// Selecciona todos los elementos con la clase "step" (pasos del formulario)
const steps = document.querySelectorAll('.step');

// Selecciona todas las secciones del acordeón
const sections = document.querySelectorAll('.accordion-section');

// Selecciona todos los encabezados de las secciones del acordeón
const headers = document.querySelectorAll('.accordion-header');

// Agrega un evento de clic a cada paso del stepper
steps.forEach(step => {
  step.addEventListener('click', () => {
    activateStep(step.dataset.step); // Activa la sección correspondiente al paso seleccionado
  });
});

// Agrega un evento de clic a cada encabezado del acordeón
headers.forEach(header => {
  header.addEventListener('click', () => {
    const section = header.parentElement; // Obtiene la sección padre del encabezado
    const step = section.id.split('-')[1]; // Extrae el número del paso desde el ID (por ejemplo, "step-2" → "2")
    activateStep(step); // Activa la sección correspondiente
  });
});

// Función para avanzar al siguiente paso
function nextStep(stepNumber) {
  activateStep(stepNumber); // Activa el paso especificado
}

// Función para activar un paso específico
function activateStep(stepNumber) {
  // Elimina la clase "active" de todos los pasos del stepper
  steps.forEach(step => step.classList.remove('active'));

  // Elimina la clase "active" de todas las secciones del acordeón
  sections.forEach(section => section.classList.remove('active'));

  // Agrega la clase "active" al paso correspondiente
  document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');

  // Agrega la clase "active" a la sección del acordeón correspondiente
  document.querySelector(`#step-${stepNumber}`).classList.add('active');
}
