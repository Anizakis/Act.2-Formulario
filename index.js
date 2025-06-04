/* ───── 1. Selección de elementos ─────────────────────────── */
const steps    = document.querySelectorAll('.step');           // Pasos del stepper
const sections = document.querySelectorAll('.accordion-section'); // Secciones del acordeón
const headers  = document.querySelectorAll('.accordion-header');  // Encabezados

/* ───── 2. Eventos de navegación (click) ──────────────────── */
steps.forEach(step => {
  step.addEventListener('click', () => {
    const destino = +step.dataset.step;                         // Número de paso destino
    const actual = +document.querySelector('.accordion-section.active').id.split('-')[1];

    // Si se intenta avanzar, se muestran errores sin bloquear
    if (destino > actual) validarSeccion(document.querySelector('.accordion-section.active'));
    activateStep(destino); // Siempre activa el paso
  });
});

headers.forEach(header => {
  header.addEventListener('click', () => {
    const destino = +header.parentElement.id.split('-')[1];     // Extrae Nº de paso
    const actual = +document.querySelector('.accordion-section.active').id.split('-')[1];

    if (destino > actual) validarSeccion(document.querySelector('.accordion-section.active'));
    activateStep(destino);
  });
});

/**
 * Avanza al paso indicado desde botón “Continuar”
 * @param {number} destino - paso al que se quiere avanzar
 */
function nextStep(destino) {
  if (puedeAvanzar(destino)) activateStep(destino);
}

/* ───── 3. VALIDACIÓN ─────────────────────────────────────── */

/**
 * Determina si se puede avanzar al paso destino.
 * Valida la sección actual sólo cuando se intenta ir hacia delante.
 */
function puedeAvanzar(pasoDestino) {
  const actualSection = document.querySelector('.accordion-section.active');
  const pasoActual = +actualSection.id.split('-')[1];

  // Ir hacia atrás nunca requiere validación
  if (pasoDestino <= pasoActual) return true;

  // Valida la sección actual
  return validarSeccion(actualSection);
}

/**
 * Valida todos los campos (input / select / radios) de una sección.
 * Muestra mensajes de error y bordes rojos si algo falla.
 * @param {HTMLElement} sectionEl
 * @returns {boolean} true si la sección no tiene errores
 */
function validarSeccion(sectionEl) {
  let ok = true;

  /* Todos los inputs y selects dentro de la sección */
  const campos = sectionEl.querySelectorAll('input, select');

  campos.forEach(input => {
    // Span de error justo después del campo (si existe)
    const errorBox =
        input.nextElementSibling?.classList.contains('error-text')
            ? input.nextElementSibling
            : null;

    /* Limpia estados anteriores */
    input.classList.remove('input-error');
    if (errorBox) errorBox.classList.remove('visible');

    /* Mensaje de error (vacío = sin error) */
    let mensaje = '';

    /* Reglas nativas de HTML5 */
    if (input.validity.valueMissing) {
      mensaje = 'Campo obligatorio.';
    } else if (input.validity.typeMismatch) {
      mensaje = 'Formato inválido.';
    } else if (input.validity.tooShort) {
      mensaje = `Mínimo ${input.minLength} caracteres.`;
    }

    /* Regla extra: fecha de nacimiento >= 18 años */
    if (input.id === 'birthdate' && input.value) {
      const edad = calcEdad(input.value);
      if (edad < 18) mensaje = 'Debes ser mayor de edad.';
    }

    /* Regla para grupo de radios (sexo) */
    if (input.type === 'radio') {
      const grupo = sectionEl.querySelectorAll(`input[name="${input.name}"]`);
      const algunoMarcado = [...grupo].some(r => r.checked);
      if (!algunoMarcado) mensaje = 'Selecciona una opción.';
    }

    /* Aplica mensaje / borde si corresponde */
    if (mensaje) {
      ok = false;
      input.classList.add('input-error');
      if (errorBox) {
        errorBox.textContent = mensaje;
        errorBox.classList.add('visible');
      } else {
        // Si no hay <span class="error-text"> avisa en consola
        console.warn('Falta span.error-text tras', input);
      }
    }
  });

  return ok;
}

/**
 * Calcula edad en años completos a partir de una fecha ISO (yyyy-mm-dd)
 */
function calcEdad(fechaIso) {
  const hoy = new Date();
  const nac = new Date(fechaIso);
  let edad  = hoy.getFullYear() - nac.getFullYear();
  const ajusta =
      hoy.getMonth() < nac.getMonth() ||
      (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate());
  return ajusta ? edad - 1 : edad;
}

/* ───── 4. Activación de pasos (lógica original) ──────────── */
function activateStep(stepNumber) {
  const currentStep = +stepNumber; // Convierte a número

  /* Actualiza círculos del stepper */
  steps.forEach(step => {
    const i = +step.dataset.step;
    step.classList.remove('active', 'completed');
    if (i < currentStep) step.classList.add('completed');
    if (i === currentStep) step.classList.add('active');
  });

  /* Muestra / oculta secciones */
  sections.forEach(section => {
    const i = +section.id.split('-')[1];
    section.classList.toggle('completed-section', i < currentStep);
    section.classList.toggle('active', i === currentStep);
  });

  /* Barra de progreso */
  const stepper = document.querySelector('.stepper');
  stepper.className = `stepper progress-${currentStep}`;
}

/* ───── 5. Finalización del formulario ────────────────────── */
function finalizarFormulario() {
  // Valida la última sección antes de cerrar
  if (!validarSeccion(document.querySelector('#step-3'))) return;

  /* Oculta stepper y acordeón */
  document.querySelector('.stepper').style.display = 'none';
  document.querySelector('.accordion').style.display = 'none';

  /* Muestra mensaje final */
  const mensaje = document.getElementById('mensaje-final');
  mensaje.classList.remove('oculto');
  setTimeout(() => mensaje.classList.add('visible'), 50);

  /* Crea botón para reiniciar una sola vez */
  if (!mensaje.querySelector('button')) {
    const btn = document.createElement('button');
    btn.textContent = 'Volver a realizar';
    btn.style.marginTop = '20px';

    btn.onclick = () => {
      /* Oculta mensaje final */
      mensaje.classList.remove('visible');
      mensaje.classList.add('oculto');

      /* Muestra stepper y formulario */
      document.querySelector('.stepper').style.display = 'flex';
      document.querySelector('.accordion').style.display = 'block';

      /* Limpia campos */
      document.querySelectorAll('input').forEach(i => {
        if (i.type === 'radio') i.checked = false;
        else i.value = '';
      });
      document.querySelector('select').selectedIndex = 0;

      /* Reinicia a paso 1 */
      activateStep(1);

      /* Elimina el botón para no duplicarlo la próxima vez */
      btn.remove();
    };

    mensaje.appendChild(btn);
  }
  window.nextStep = nextStep;
}
