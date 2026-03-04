const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

document.getElementById("foto").onclick = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
};

// obtiene foto y texto
document.getElementById("guardar").onclick = () => {
  const texto = document.getElementById("texto").value;
  const imagen = canvas.toDataURL("image/png");
// peticion para gurdar
  fetch("/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, imagen })
  })
  .then(res => res.text())
  .then(msg => {
  alert(msg);
  cargarHistorial();
  });
};

// carga historial
function cargarHistorial() {
  fetch("/fotos")
    .then(res => res.json())
    .then(datos => {
      const contenedor = document.getElementById("historial");
      contenedor.innerHTML = "";

      datos.forEach(fila => {
        const div = document.createElement("div");
        div.className = "item-historial";
        div.innerHTML = `
          <div id="print-area-${fila.id}">
            <img src="${fila.imagen}" width="200">
            <p><strong>Texto:</strong> <span id="text-val-${fila.id}">${fila.texto}</span></p>
          </div>
          <button onclick="editar(${fila.id})">✏️ Editar</button>
          <button onclick="borrar(${fila.id})">❌ Borrar</button>
          <button onclick="imprimir(${fila.id})">🖨️ Imprimir</button>
          <hr>
        `;
        contenedor.appendChild(div);
      });
    });
}

// borra el resultado
function borrar(id) {
  if (confirm("¿Seguro que quieres borrar esto?")) {
    fetch(`/borrar/${id}`, { method: "DELETE" })
      .then(() => cargarHistorial());
  }
}


// edita resultado
function editar(id) {
  const nuevoTexto = prompt("Edita el texto:", document.getElementById(`text-val-${id}`).innerText);
  if (nuevoTexto) {
    fetch(`/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: nuevoTexto })
    }).then(() => cargarHistorial());
  }
}

// imprime tu resultado
function imprimir(id) {
  const area = document.getElementById(`print-area-${id}`);
  area.classList.add("solo-impresion");

  window.print();

  area.classList.remove("solo-impresion");
}

cargarHistorial();