document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-cotizador");
  const btnAgregar = document.querySelector(".boton-secundario");
  const totalDiv = document.getElementById("total-cotizacion");

  // Función para calcular el total
  function calcularTotal() {
    let total = 0;
    const productos = document.querySelectorAll(".producto-cotizacion");

    productos.forEach(producto => {
      const select = producto.querySelector(".select-producto");
      const cantidad = producto.querySelector(".cantidad").value;
      const precio = parseFloat(select.value);

      if (!isNaN(precio)) {
        total += precio * parseInt(cantidad || 1);
      }
    });

    totalDiv.textContent = `$${total.toFixed(2)}`;
  }

  // Evento para calcular total cuando se cambia algo
  form.addEventListener("change", calcularTotal);

  // Agregar un nuevo campo de producto
  btnAgregar.addEventListener("click", () => {
    const nuevaFila = document.createElement("div");
    nuevaFila.classList.add("producto-cotizacion");

    nuevaFila.innerHTML = `
      <select class="select-producto">
        <option value="">Seleccione un producto</option>
        <option value="45">NEUTRA STRESS 30 ML. ($45)</option>
        <option value="100">Descontaminador de agua ($100)</option>
        <option value="75">Regulador de PH ($75)</option>
        <option value="150">Anillos de cerámica 450g ($150)</option>
        <option value="100">Anillos cerámica económico ($100)</option>
        <option value="70">Anillos super económicos ($70)</option>
        <option value="300">Alimento Axolotl 135g ($300)</option>
        <option value="550">Alimento Axolotl 300g ($550)</option>
        <option value="85">Sunny Tropical 90g ($85)</option>
        <option value="60">Alimento granel ($60/kg)</option>
        <option value="1500">Tropical Flakes Premium ($1500)</option>
        <option value="700">Transportadora hasta 5kg ($700)</option>
        <option value="259">Talco Quita Olores ($259)</option>
        <option value="1000">Perfect Sense 7kg ($1000)</option>
        <option value="70">Alimento perro granel ($70)</option>
        <option value="1700">PEDIGREE Grilled Steak ($1700)</option>
        <option value="1800">Kibbles ‘n Bits® Original ($1800)</option>
        <option value="1200">Kibbles ‘n Bits® Mini ($1200)</option>
        <option value="1000">Kibbles Mini Bits ($1000)</option>
        <option value="800">Kibbles Mini Bits ($800)</option>
      </select>
      <input type="number" min="1" value="1" class="cantidad">
    `;

    btnAgregar.before(nuevaFila);
  });

  // Evento al enviar el formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const productos = document.querySelectorAll(".producto-cotizacion");
    let resumen = "";

    productos.forEach((producto, index) => {
      const select = producto.querySelector(".select-producto");
      const cantidad = producto.querySelector(".cantidad").value;
      const texto = select.options[select.selectedIndex].text;
      const precio = parseFloat(select.value);

      if (!isNaN(precio)) {
        resumen += `Producto ${index + 1}: ${texto} x ${cantidad}\n`;
      }
    });

    resumen += `\nTotal: ${totalDiv.textContent}\nGracias, ${nombre} (${email})`;

    alert("Resumen de cotización:\n\n" + resumen);

    form.reset();
    totalDiv.textContent = "$0.00";
  });

  // Calcular total al inicio
  calcularTotal();
});

function generarPDF() {
  event.preventDefault(); // Evita envío del formulario

  const form = document.getElementById("formPresupuesto");

  // Obtener datos del formulario
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;
  const metodoPago = document.getElementById("tipo-pago").value;
  const fecha = document.getElementById("fecha").value;
  const comentarios = document.getElementById("comentarios").value;
  const total = document.getElementById("total-cotizacion").textContent;

  const productos = [];
  const selects = form.querySelectorAll('.select-producto');
  const cantidades = form.querySelectorAll('.cantidad');

  selects.forEach((select, i) => {
    const selectedOption = select.options[select.selectedIndex];
    const cantidad = cantidades[i].value;
    if (selectedOption.value !== "") {
      productos.push(`${selectedOption.text} - Cantidad: ${cantidad}`);
    }
  });

  // Crear contenido para el PDF
  let contenido = `
    COTIZACIÓN DE PRODUCTOS\n\n
    Nombre: ${nombre}
    Teléfono: ${telefono}
    Correo: ${email}

    Productos seleccionados:
    ${productos.join('\n')}

    Método de pago: ${metodoPago}
    Fecha requerida: ${fecha}
    Instrucciones especiales: ${comentarios}

    Total estimado: ${total}
  `;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const lines = doc.splitTextToSize(contenido, 180); // Ajuste de ancho
  doc.text(lines, 10, 10);
  doc.save(`cotizacion_${nombre || "cliente"}.pdf`);
}

function descargarPDF() {
  generarPDF(); // Reutilizamos la lógica
}

