// Referencias a elementos del DOM
const openCameraBtn = document.getElementById("openCamera");
const cameraContainer = document.getElementById("cameraContainer");
const video = document.getElementById("video");
const takePhotoBtn = document.getElementById("takePhoto");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const photosGallery = document.getElementById("photosGallery");
const photosContainer = document.getElementById("photosContainer");

// Variable global para almacenar el MediaStream
let stream = null;
let photoCount = 0;

// Función para abrir la cámara
async function openCamera() {
  try {
    // Definición de restricciones (constraints)
    const constraints = {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 320 },
        height: { ideal: 240 },
      },
    };

    // Obtener el Stream de Medios
    stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Asignar el Stream al elemento video
    video.srcObject = stream;

    // Actualización de la UI
    cameraContainer.style.display = "block";
    openCameraBtn.textContent = "Cámara Abierta";
    openCameraBtn.disabled = true;

    console.log("Cámara abierta exitosamente");
  } catch (error) {
    console.error("Error al acceder a la cámara:", error);
    alert("No se pudo acceder a la cámara. Asegúrate de dar permisos.");
  }
}

// Función para tomar una foto
function takePhoto() {
  if (!stream) {
    alert("Primero debes abrir la cámara");
    return;
  }

  // Dibujar el frame actual del video en el canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convertir el canvas a Data URL
  const imageDataURL = canvas.toDataURL("image/png");

  // Incrementar contador de fotos
  photoCount++;

  // Crear elemento de foto
  const photoItem = document.createElement("div");
  photoItem.className = "photo-item";

  const img = document.createElement("img");
  img.src = imageDataURL;
  img.alt = `Foto ${photoCount}`;

  photoItem.appendChild(img);

  // Agregar la foto al contenedor
  photosContainer.appendChild(photoItem);

  // Mostrar la galería si estaba oculta
  if (photosGallery.style.display === "none" || !photosGallery.style.display) {
    photosGallery.style.display = "block";
  }

  // Hacer scroll al final para mostrar la última foto
  setTimeout(() => {
    photosContainer.scrollLeft = photosContainer.scrollWidth;
  }, 100);

  // Mostrar información en consola
  console.log("Foto capturada:", photoCount);
  console.log("Tamaño en Base64:", imageDataURL.length, "caracteres");
}

// Función para cerrar la cámara
function closeCamera() {
  if (stream) {
    // Detener todos los tracks del stream
    stream.getTracks().forEach((track) => track.stop());
    stream = null;

    // Limpiar y ocultar UI
    video.srcObject = null;
    cameraContainer.style.display = "none";

    // Restaurar el botón
    openCameraBtn.textContent = "Abrir Cámara";
    openCameraBtn.disabled = false;

    console.log("Cámara cerrada");
  }
}

// Event Listeners
openCameraBtn.addEventListener("click", openCamera);
takePhotoBtn.addEventListener("click", takePhoto);

// Limpiar stream cuando el usuario cierra la página
window.addEventListener("beforeunload", () => {
  closeCamera();
});

console.log("PWA Cámara inicializada");
