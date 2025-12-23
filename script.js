let listaFeriados = [];

// Carga automática de feriados al iniciar
window.onload = function() {
    cargarFeriados();
};

async function cargarFeriados() {
    const pResultado = document.getElementById('resultHabiles');
    try {
        const respuesta = await fetch('feriados.txt');
        if (!respuesta.ok) throw new Error();
        const texto = await respuesta.text();
        listaFeriados = texto.split(/\r?\n/).map(f => f.trim()).filter(f => f !== "");
        pResultado.innerText = "Feriados cargados ✅";
    } catch (e) {
        pResultado.innerText = "Solo fines de semana (sin feriados) ⚠️";
    }
}

// BLOQUE 1: CÁLCULO DÍAS CORRIDOS
function calculateDays() {
    const start = document.getElementById('dateStart1').value;
    const end = document.getElementById('dateEnd1').value;
    const display = document.getElementById('resultCorridos');

    if (!start || !end) return display.innerText = "⚠️ Falta fecha";

    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));

    display.innerText = diff >= 0 ? `Resultado: ${diff} días` : "❌ Fecha inválida";
}

// BLOQUE 2: CÁLCULO DÍAS HÁBILES
function calculateBusinessDays() {
    const start = document.getElementById('dateStart2').value;
    const end = document.getElementById('dateEnd2').value;
    const display = document.getElementById('resultHabiles');

    if (!start || !end) return display.innerText = "⚠️ Falta fecha";

    let fechaActual = parseUTC(start);
    let fechaFin = parseUTC(end);
    let contador = -1; // lo puse en -1 pero era 0

    while (fechaActual <= fechaFin) {
        if (esDiaHabil(fechaActual)) contador++;
        fechaActual.setUTCDate(fechaActual.getUTCDate() + 1);
    }
    display.innerText = `Resultado: ${contador} días hábiles`;
}

// BLOQUE 3: SUMAR PLAZOS (Hábiles o Corridos)
function addDays(soloHabiles) {
    const start = document.getElementById('dateStart3').value;
    const days = parseInt(document.getElementById('daysToAdd').value);
    const display = document.getElementById('resultPlazo');

    if (!start || isNaN(days)) return display.innerText = "⚠️ Complete datos";

    let fecha = parseUTC(start);
    let sumados = 0;

    while (sumados < days) {
        fecha.setUTCDate(fecha.getUTCDate() + 1);
        if (!soloHabiles || esDiaHabil(fecha)) {
            sumados++;
        }
    }

    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    display.innerText = `Vence: ${fecha.toLocaleDateString('es-AR', opciones)}`;
}

// FUNCIONES AUXILIARES
function parseUTC(dateStr) {
    const [y, m, d] = dateStr.split("-");
    return new Date(Date.UTC(y, m - 1, d));
}

function esDiaHabil(fecha) {
    const dia = fecha.getUTCDay(); // 0: Dom, 6: Sab
    const iso = fecha.toISOString().split('T')[0];
    return dia !== 0 && dia !== 6 && !listaFeriados.includes(iso);
}







