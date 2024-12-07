
        const canvas = document.getElementById("editorCanvas");
        const ctx = canvas.getContext("2d");
        const imageUpload = document.getElementById("imageUpload");
        const textInput = document.getElementById("textInput");
        const opacitySlider = document.getElementById("opacity");
        const addTextBtn = document.getElementById("addTextBtn");
        const imageListContainer = document.getElementById("imageList");
        const xPosInput = document.getElementById("xPos");
        const yPosInput = document.getElementById("yPos");
        const scaleInput = document.getElementById("scale");
        const rotationInput = document.getElementById("rotation");
        const clearAllBtn = document.getElementById("clearAllBtn");
        const exportBtn = document.getElementById("exportBtn");
        const hexInput = document.getElementById("txtHex");
  const widthInput= document.getElementById("widthInput");
const heightInput= document.getElementById("heightInput");
 const doneBtn = document.getElementById("doneBtn");
const layerCounter = document.getElementById("layerCounter");

function updateLayerCounter() {
    layerCounter.textContent = `Layers: ${elements.length}`;
}


        let elements = [];
        let selectedElementIndex = null;
canvas.width = 1920;
canvas.height = 1080;

        imageUpload.addEventListener("change", handleImageUpload);
        addTextBtn.addEventListener("click", handleAddText);
        xPosInput.addEventListener("input", updateElementPosition);
        yPosInput.addEventListener("input", updateElementPosition);
        scaleInput.addEventListener("input", updateElementScale);
        rotationInput.addEventListener("input", updateElementRotation);
        opacitySlider.addEventListener("input", updateElementOpacity);
        clearAllBtn.addEventListener("click", clearAllElements);
        exportBtn.addEventListener("click", exportCanvas);
heightInput.addEventListener("input", resizeCanvas);
hexInput.addEventListener("input", updateElementColor);
doneBtn.addEventListener("click", closeEditor);
widthInput.addEventListener("input", resizeCanvas);

        // Handle image upload
        function handleImageUpload(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    elements.push({ type: "image", img, x: canvas.width / 2, y: canvas.height / 2, scale: 100, rotation: 0, opacity: 100 });
                    updateImageList();
                    drawCanvas();
                };
            };

            reader.readAsDataURL(file);
        }

        // Handle adding text
        function handleAddText() {
            const text = textInput.value.trim();
            if (!text) return;

            elements.push({ type: "text", text, x: canvas.width / 2, y: canvas.height / 2, scale: 100, rotation: 0, color: "#ffffff", opacity: 100});
            textInput.value = "";
            updateImageList();
            drawCanvas();
        }

        // Update the image list
        function updateImageList() {
            imageListContainer.innerHTML = '';

            elements.forEach((element, index) => {
                const container = document.createElement("div");

                if (element.type === "image") {
                    const img = document.createElement("img");
                    img.src = element.img.src;
                    img.onclick = () => selectElement(index);
                    container.appendChild(img);
                } else if (element.type === "text") {
                    const canvas = document.createElement("canvas");
                    canvas.width = 100;
                    canvas.height = 100;  // Ensure square canvas for text preview
                    const ctx = canvas.getContext("2d");

                    ctx.font = `${70/(element.text.length/2)}px Arial`;
                    ctx.fillStyle = element.color;
                    ctx.globalAlpha = element.opacity / 100;  // Apply opacity
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(element.text, canvas.width / 2, canvas.height / 2);
                    canvas.onclick = () => selectElement(index);
                    container.appendChild(canvas);
                }

                deleteBtn = document.createElement("span");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("delete-btn");
                deleteBtn.onclick = () => deleteElement(index);
container.appendChild(deleteBtn);
moveUpBtn = document.createElement("span");
moveUpBtn.textContent = "Go up";
moveUpBtn.classList.add("moveup-btn");
moveUpBtn.onclick = () => moveLayer(index, -1);

moveDownBtn = document.createElement("span");
moveDownBtn.textContent = "Go down";
moveDownBtn.classList.add("movedown-btn");
moveDownBtn.onclick = () => moveLayer(index, 1);

container.appendChild(moveUpBtn);
container.appendChild(moveDownBtn);


                imageListContainer.appendChild(container);
            });
        }

        // Draw the canvas
        function drawCanvas() {
updateLayerCounter();
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
          
            elements.forEach((element) => {
                ctx.save();
                ctx.translate(element.x, element.y);
                ctx.rotate((element.rotation * Math.PI) / 180);
                ctx.globalAlpha = element.opacity / 100;  // Apply opacity

                if (element.type === "image") {
                    const imgWidth = element.img.width * (element.scale / 100);
                    const imgHeight = element.img.height * (element.scale / 100);
                    ctx.drawImage(element.img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
                    //ctx.strokeStyle = "#ffffff"; // Outline color
                    //ctx.lineWidth = 10;
                    //ctx.strokeRect(-imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
                      } else if (element.type === "text") {
                    ctx.font = `${element.scale}px Arial`;
                    ctx.fillStyle = element.color;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(element.text, 0, 0);  // Centered text
                }

                ctx.restore();
            });
        }
function closeEditor(){
            document.getElementById("coordinateInputs").style.display = "none";
      }

        // Select an element for editing
        function selectElement(index) {
            selectedElementIndex = index;
            const element = elements[index];

            // Show coordinates and opacity controls
            document.getElementById("coordinateInputs").style.display = "block";
            xPosInput.value = (element.x / canvas.width) * 100;
            yPosInput.value = (element.y / canvas.height) * 100;
            scaleInput.value = element.scale;
            rotationInput.value = element.rotation;
            opacitySlider.value = element.opacity;
if (element.type === "image"){
hexInput.style.display = "none";
}

if (element.type === "text"){
hexInput.style.display = "block";
}
hexInput.value = element.color;
        }

        // Delete an element
        function deleteElement(index) {
            elements.splice(index, 1);
            updateImageList();
closeEditor();
            drawCanvas();
        }

        // Update element position based on coordinate inputs
        function updateElementPosition() {
            if (selectedElementIndex === null) return;
            const element = elements[selectedElementIndex];
            element.x = (xPosInput.value / 100) * canvas.width;
            element.y = (yPosInput.value / 100) * canvas.height;
            drawCanvas();
        }

        // Update element scale
        function updateElementScale() {
            if (selectedElementIndex === null) return;
            const element = elements[selectedElementIndex];
            element.scale = scaleInput.value;
            drawCanvas();
        }
function updateElementColor() {
            if (selectedElementIndex === null) return;
            const element = elements[selectedElementIndex];
            if (element.type === "text") {
if(hexInput.value.length == 4 || hexInput.value.length == 7){
                element.color = hexInput.value;
}
        updateImageList();
                drawCanvas();
            }
        }
function moveLayer(index, direction) {
    // Calculate the new index
    const newIndex = index + direction;

    // Check if movement is within bounds
    if (newIndex < 0 || newIndex >= elements.length) return;

    // Swap elements in the array
    [elements[index], elements[newIndex]] = [elements[newIndex], elements[index]];

    // Update UI and redraw canvas
    updateImageList();
    drawCanvas();
}

function resizeCanvas(){

if(heightInput.value > 5000){
heightInput.value = 5000;
}
if(widthInput.value > 5000){
widthInput.value = 5000;
}
if(heightInput.value.length > 0){
canvas.height = heightInput.value;
}
if(widthInput.value.length > 0){
canvas.width = widthInput.value;
}
                drawCanvas();
        }

        // Update element rotation
        function updateElementRotation() {
            if (selectedElementIndex === null) return;
            const element = elements[selectedElementIndex];
            element.rotation = rotationInput.value;
            drawCanvas();
        }

        // Update opacity when the slider is moved
        function updateElementOpacity() {
            if (selectedElementIndex === null) return;
            const element = elements[selectedElementIndex];
            element.opacity = opacitySlider.value;
            drawCanvas();
        }

        // Update text color

        // Clear all elements from the canvas
        function clearAllElements() {
    const confirmDelete = confirm("Are you sure you want to delete all elements?");
    if (confirmDelete) {
        elements = [];
        updateImageList();
        drawCanvas();
    }
}

        // Export canvas as image
        function exportCanvas() {
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "canvas_image.png";
            link.click();
        }