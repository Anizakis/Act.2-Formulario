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
  // Convierte a número por seguridad
  const currentStep = parseInt(stepNumber);

  // Recorre todos los pasos del stepper
  steps.forEach(step => {
    const stepIndex = parseInt(step.dataset.step);

    // Limpia clases anteriores
    step.classList.remove('active', 'completed');

    // Marca los pasos anteriores como completados
    if (stepIndex < currentStep) {
      step.classList.add('completed');
    }
    // Marca las secciones anteriores como completadas
    sections.forEach(section => {
      const sectionStep = parseInt(section.id.split('-')[1]);
      if (sectionStep < currentStep) {
        section.classList.add('completed-section');
      } else {
        section.classList.remove('completed-section');
      }
    });

    // Marca el paso actual como activo
    if (stepIndex === currentStep) {
      step.classList.add('active');
    }
  });

  // Oculta todas las secciones
  sections.forEach(section => section.classList.remove('active'));

  // Muestra la sección correspondiente al paso actual
  document.querySelector(`#step-${stepNumber}`).classList.add('active');

  // Actualiza la clase de progreso en el stepper para animar la línea
  const stepper = document.querySelector('.stepper');
  stepper.classList.remove('progress-1', 'progress-2', 'progress-3'); // limpia
  stepper.classList.add(`progress-${stepNumber}`); // aplica
}
function finalizarFormulario() {
  // Oculta stepper y formulario
  document.querySelector('.stepper').style.display = 'none';
  document.querySelector('.accordion').style.display = 'none';

  // Muestra el mensaje con animación
  const mensaje = document.getElementById('mensaje-final');
  mensaje.classList.remove('oculto');
  setTimeout(() => {
    mensaje.classList.add('visible');
  }, 50);

  // Crear botón "Volver a realizar"
  const botonVolver = document.createElement('button');
  botonVolver.textContent = "Volver a realizar";
  botonVolver.style.marginTop = "20px";
  
  // Cuando se clickee, reinicia el formulario y vuelve a mostrar todo
  botonVolver.onclick = () => {
    // Ocultar mensaje final
    mensaje.classList.remove('visible');
    mensaje.classList.add('oculto');

    // Mostrar stepper y formulario
    document.querySelector('.stepper').style.display = 'flex';
    document.querySelector('.accordion').style.display = 'block';

    // Eliminar el botón para no duplicarlo si se vuelve a enviar
    botonVolver.remove();

    // Reiniciar formulario a paso 1
    activateStep(1);

    // Opcional: limpiar inputs y estados
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('input[type=radio]').forEach(radio => radio.checked = false);
    document.querySelector('select').selectedIndex = 0;
  };

  // Añadir botón al contenedor del mensaje final
  mensaje.appendChild(botonVolver);
}

