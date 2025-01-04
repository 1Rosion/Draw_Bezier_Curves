const list = document.getElementById("list");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const js = document.getElementById("js");
        const addCoordsToCode = document.getElementById("addCoordsToCode");

        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            ToString() {
                return `[${this.x}, ${this.y}]`;
            }

            draw(fill = "true", color = "black"){
                let strokeStyle = ctx.strokeStyle;
                let fillStyle = ctx.fillStyle;

                ctx.strokeStyle = color;
                ctx.fillStyle = color;

                ctx.beginPath();
                ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
                if (fill == "true")
                    ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.strokeStyle = strokeStyle;
                ctx.fillStyle = fillStyle;
            }

            clone(){
                return new Point(this.x, this.y);
            }
        }

        class MoveTo {
            constructor(x = canvas.width / 2, y = canvas.height / 2){
                this.coords = new Point(x, y);
            }

            draw() {
                this.coords.draw(document.getElementById("fill").value, "red");
            }

            toCode() {
                ctx.moveTo(this.coords.x, this.coords.y);
                if (addCoordsToCode.checked)
                    return `\nctx.moveTo(x + ${this.coords.x}, y + ${this.coords.y});`;
                else 
                    return `\nctx.moveTo(${this.coords.x}, ${this.coords.y});`;
            }

            displayEdit() {
                const editor = document.createElement("div"); 
                editor.innerHTML = `<h3>Edit MoveTo</h3>`;

                const coordInputX = document.createElement("input"); 
                coordInputX.type = "number"; 
                coordInputX.value = this.coords.x; 
                coordInputX.placeholder = "X"; 
                coordInputX.onchange = () => { 
                    this.coords.x = Number(coordInputX.value);
                    draw(); 
                };

                const coordInputY = document.createElement("input"); coordInputY.type = "number";
                coordInputY.value = this.coords.y;
                coordInputY.placeholder = "Y";
                coordInputY.onchange = () => { 
                    this.coords.y = Number(coordInputY.value);
                    draw();
                }; 
                editor.appendChild(coordInputX); 
                editor.appendChild(coordInputY);
                return editor;
            }

            ToString() {
                return `[${this.coords.x}, ${this.coords.y}]`;
            }

            display() {
                const newForm = document.createElement("form");
                newForm.innerHTML = `MoveTo Coordinates: ${this.ToString()}`;

                const editButton = document.createElement("input");
                editButton.type = "button";
                editButton.value = "Edit";
                editButton.addEventListener("click", () => {
                    editCurve(this);
                });

                const deleteButton = document.createElement("input");
                deleteButton.type = "button";
                deleteButton.value = "Delete";
                deleteButton.addEventListener("click", () => {
                    tableCurves.splice(tableCurves.indexOf(this) , 1);
                    ClearAndAddRows();
                    draw();
                });

                newForm.appendChild(editButton);
                newForm.appendChild(deleteButton);

                return newForm;
            }

            clone() {
                let coords = this.coords.clone();
                return new MoveTo(coords.x, coords.y);
            }
        }

        class Curve {
            constructor() {
                this.coords = [];
            }

            addCoord(x, y) {
                if (this.coords.length < 3)
                    this.coords.push(new Point(x, y));
                else 
                    alert("You already added 3 coords");
            }

            updateCoord(index, x, y) {
                if (index >= 0 && index < this.coords.length) {
                    this.coords[index].x = x;
                    this.coords[index].y = y;
                }
            }

            ToString() {
                return this.coords.map(coord => coord.ToString()).join(", ");
            }

            draw() {
                this.coords.forEach(coord => {
                    coord.draw(document.getElementById("fill").value, "black");
                });
            }

            toCode() {
                if (this.coords.length === 0)
                    return "";
                else if (this.coords.length === 1) {
                    const p = this.coords[0];
                    ctx.lineTo(p.x, p.y);
                    if (addCoordsToCode.checked)
                        return `\nctx.lineTo(x + ${p.x}, y + ${p.y});`;
                    else
                        return `\nctx.lineTo(${p.x}, ${p.y});`;
                } else if (this.coords.length === 2) {
                    const [p1, p2] = this.coords;
                    ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
                    if (addCoordsToCode.checked)
                        return `\nctx.quadraticCurveTo(x + ${p1.x}, y + ${p1.y}, x + ${p2.x}, y + ${p2.y});`;
                    else
                        return `\nctx.quadraticCurveTo(${p1.x}, ${p1.y}, ${p2.x}, ${p2.y});`;
                } else if (this.coords.length === 3) {
                    const [p1, p2, p3] = this.coords;
                    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                    if (addCoordsToCode.checked)
                        return `\nctx.bezierCurveTo(x + ${p1.x}, y + ${p1.y}, x + ${p2.x}, y + ${p2.y}, x + ${p3.x}, y + ${p3.y});`;
                    else
                        return `\nctx.bezierCurveTo(${p1.x}, ${p1.y}, ${p2.x}, ${p2.y}, ${p3.x}, ${p3.y});`;
                }
            }

            displayEdit() {
                const editor = document.createElement("div");
                editor.innerHTML = `<h3>Edit Curve</h3>`;
                
                this.coords.forEach((coord, index) => {
                    const coordInputX = document.createElement("input");
                    coordInputX.type = "number";
                    coordInputX.value = coord.x;
                    coordInputX.placeholder = `X${index + 1}`;
                    coordInputX.onchange = () => {
                        this.updateCoord(index, Number(coordInputX.value), coord.y);
                        draw();
                    };

                    const coordInputY = document.createElement("input");
                    coordInputY.type = "number";
                    coordInputY.value = coord.y;
                    coordInputY.placeholder = `Y${index + 1}`;
                    coordInputY.onchange = () => {
                        this.updateCoord(index, coord.x, Number(coordInputY.value));
                        draw();
                    };

                    // Creăm un buton de ștergere pentru fiecare coordonată
                    const deleteCoordButton = document.createElement("button");
                    deleteCoordButton.textContent = `Delete Coord ${index + 1}`;
                    deleteCoordButton.onclick = () => {
                        // Ștergem coordonata respectivă
                        this.coords.splice(index, 1);
                        draw();
                        ClearAndAddRows();
                        editCurve(this); // Redesenăm editorul cu lista actualizată de coordonate
                    };

                    editor.appendChild(coordInputX);
                    editor.appendChild(coordInputY);
                    editor.appendChild(deleteCoordButton); // Adăugăm butonul de ștergere
                });

                const addCoordButton = document.createElement("button");
                addCoordButton.textContent = "Add Coordinate";
                addCoordButton.onclick = (e) => {
                    e.preventDefault();
                    this.addCoord(10, 10); // Adăugăm un punct cu coordonate implicite
                    draw();
                    ClearAndAddRows();
                    editCurve(this); // Redesenăm editorul
                };

                editor.appendChild(addCoordButton);

                return editor;
            }

            display (){
                const newForm = document.createElement("form");
                newForm.innerHTML = `Curve Coordinates: ${this.ToString()}`;

                const editButton = document.createElement("input");
                editButton.type = "button";
                editButton.value = "Edit";
                editButton.addEventListener("click", () => {
                    editCurve(this);
                });

                const deleteButton = document.createElement("input");
                deleteButton.type = "button";
                deleteButton.value = "Delete";
                deleteButton.addEventListener("click", () => {
                    tableCurves.splice(tableCurves.indexOf(this) , 1);
                    ClearAndAddRows();
                    draw();
                });

                newForm.appendChild(editButton);
                newForm.appendChild(deleteButton);

                return newForm;
            }

            clone() {
                let newCurve = new Curve();
                this.coords.forEach(elem => {
                    newCurve.coords.push(elem.clone());
                });

                return newCurve;
            }
        }

        class Fill {
            constructor (color){
                this.color = color ?? ctx.fillStyle;
            }

            draw() { /* Fill class dont have points to draw */}

            toCode() {
                let fillStyle = ctx.fillStyle;
                ctx.fillStyle = this.color;
                ctx.fill();
                
                ctx.fillStyle = fillStyle;

                if (this.color == fillStyle)
                    return `\nctx.fill()`;
                else 
                    return `\nctx.fillStyle = "${this.color}";\nctx.fill();`;
            }

            display() {
                const newForm = document.createElement("form");
                newForm.innerHTML = "Fill ";

                const colorInput = document.createElement("input");
                colorInput.type = "color";
                colorInput.value = this.color;
                colorInput.addEventListener("change", () => {
                    this.color = colorInput.value;
                    draw();
                });

                const deleteButton = document.createElement("input");
                deleteButton.type = "button";
                deleteButton.value = "Delete";
                deleteButton.addEventListener("click", () => {
                    tableCurves.splice(tableCurves.indexOf(this) , 1);
                    ClearAndAddRows();
                    draw();
                });

                newForm.appendChild(colorInput);
                newForm.appendChild(deleteButton);

                return newForm;
            }

            clone() {
                return new Fill(this.color);
            }
        }

        class Stroke {
            constructor (lineWidth = 1, strokeStyle = "black"){
                this.lineWidth = lineWidth;
                this.strokeStyle = strokeStyle;
            }

            draw() { /* Stroke class dont have points to draw */}

            toCode() {
                let lineWidth = ctx.lineWidth;
                let strokeStyle = ctx.strokeStyle;

                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.strokeStyle;
                ctx.stroke();
                
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;

                let toReturn = "";
                
                if (this.lineWidth != ctx.lineWidth)
                    toReturn += `\nctx.lineWidth = ${this.lineWidth};`;
                if (this.strokeStyle != ctx.strokeStyle)
                    toReturn += `\nctx.strokeStyle = ${this.strokeStyle};`;

                return toReturn + `\nctx.stroke();`;
            }

            display() {
                const newForm = document.createElement("form");
                newForm.innerHTML = "Stroke ";

                const colorInput = document.createElement("input");
                colorInput.type = "color";
                colorInput.value = this.strokeStyle;
                colorInput.addEventListener("change", () => {
                    this.strokeStyle = colorInput.value;
                    draw();
                });

                const lineWidthInput = document.createElement("input");
                lineWidthInput.type = "number";
                lineWidthInput.ariaValueMin = 0;
                lineWidthInput.ariaValueMax = 20;
                lineWidthInput.value = this.lineWidth;
                lineWidthInput.addEventListener("change", () => {
                    this.lineWidth = Number(lineWidthInput.value);
                    draw();
                });

                const deleteButton = document.createElement("input");
                deleteButton.type = "button";
                deleteButton.value = "Delete";
                deleteButton.addEventListener("click", () => {
                    tableCurves.splice(tableCurves.indexOf(this) , 1);
                    ClearAndAddRows();
                    draw();
                });

                newForm.appendChild(colorInput);
                newForm.appendChild(lineWidthInput);
                newForm.appendChild(deleteButton);

                return newForm;
            }

            clone() {
                return new Stroke(this.lineWidth, this.strokeStyle);
            }
        }

        class ClosePath {
            constructor (){}

            draw() { /* ClosePath class dont have points to draw */}

            toCode() {
                ctx.closePath();
                return `\nctx.closePath();`;
            }

            display() {
                const newForm = document.createElement("form");
                newForm.innerHTML = "ClosePath";

                const deleteButton = document.createElement("input");
                deleteButton.type = "button";
                deleteButton.value = "Delete";
                deleteButton.addEventListener("click", () => {
                    tableCurves.splice(tableCurves.indexOf(this) , 1);
                    ClearAndAddRows();
                    draw();
                });

                newForm.appendChild(deleteButton);

                return newForm;
            }

            clone() {
                return new ClosePath();
            }
        }

        let tableCurves = [new MoveTo()];
        let currentCurve = tableCurves[0];
        let initialPoint = new Point(0, 0);
        let imageBack = new Image();
        imageBack.src = "";
        let draggedPoint = null;

        let savingIndex = -1; // For undo/Redo managing
        let savings = [];
        UndoSave();

        addCoordsToCode.addEventListener("change", ()=>{
            draw();
        })

        canvas.addEventListener("mousedown", (e) => {
            const { offsetX, offsetY } = e;
            if (e.button == 0){
                draggedPoint = findDraggedPoint(offsetX, offsetY);
            }
            else if (e.button == 2){
                let newCurve = new Curve();
                newCurve.addCoord(offsetX, offsetY);
                tableCurves.push(newCurve);

                draw();
                ClearAndAddRows();

                draggedPoint = newCurve.coords[0];
            }
        });

        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault(); 
        });

        canvas.addEventListener("mousemove", (e) => {
            if (draggedPoint) {
                const { offsetX, offsetY } = e;
                draggedPoint.x = offsetX;
                draggedPoint.y = offsetY;
                draw();
                syncCoordinates();
            }
        });

        canvas.addEventListener("mouseup", () => {
            draggedPoint = null;
            UndoSave();
        });

        function findDraggedPoint(x, y) {
            for (const curve of tableCurves) {
                if (curve.constructor.name == "Curve"){
                    for (const coord of curve.coords) {
                        const dx = coord.x - x;
                        const dy = coord.y - y;
                        if (Math.sqrt(dx * dx + dy * dy) < 5) {
                            return coord;
                        }
                    }
                }
                else if (curve.constructor.name == "MoveTo") {
                    const dx = curve.coords.x - x;
                    const dy = curve.coords.y - y;
                    if (Math.sqrt(dx * dx + dy * dy) < 5) {
                        return curve.coords;
                    }
                }
            }

            if (tableCurves.length > 0 && tableCurves[tableCurves.length - 1].constructor.name == "Curve"){
                let curve = tableCurves[tableCurves.length - 1];
                if (curve.coords.length < 3){
                    curve.addCoord(x, y);
                    draw();
                    return curve.coords[curve.coords.length - 1];
                }
                else 
                    alert("Something went wrong, try to click right click to add a new Curve");
            }
        }

        function addCurve() {
            tableCurves.push(new Curve());
            ClearAndAddRows();
            UndoSave();
            draw();
        }

        function addMoveTo() {
            tableCurves.push(new MoveTo(10, 10));
            ClearAndAddRows();
            UndoSave();
            draw();
        }

        function addFill() {
            tableCurves.push(new Fill("black"));
            ClearAndAddRows();
            UndoSave();
            draw();
        }

        function addStroke() {
            tableCurves.push(new Stroke());
            ClearAndAddRows();
            UndoSave();
            draw();
        }

        function addClosePath() {
            tableCurves.push(new ClosePath());
            ClearAndAddRows();
            UndoSave();
            draw();
        }

        function addRow(curve, index) {
            const li = document.createElement("li");
            li.draggable = true;

            let newForm = curve.display();

            li.appendChild(newForm);
            list.appendChild(li);
        }

        let dragging = false;  // Variable for dragging items 

        function ClearAndAddRows() {
            list.innerHTML = "";
            tableCurves.forEach((curve, index) => {
                addRow(curve, index);
            });

            list.querySelectorAll('li').forEach((item, index) => {
                item.addEventListener('dragstart', (e) => {
                    draggedIndex = index;
                    e.dataTransfer.setData('text/plain', index);
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    item.style.border = '2px dashed #000';
                });

                item.addEventListener('dragleave', () => {
                    item.style.border = 'none';
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();

                    const droppedIndex = index;
                    item.style.border = 'none';

                    const draggedElement = tableCurves.splice(draggedIndex, 1)[0];
                    tableCurves.splice(droppedIndex, 0, draggedElement);

                    UndoSave();
                    ClearAndAddRows();
                    draw();
                });
            });
        }

        function editCurve(curve) {
            ClearAndAddRows();

            editor = curve.displayEdit();
            list.appendChild(editor);
        }

        function syncCoordinates() {
            list.innerHTML = "";
            ClearAndAddRows();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath()
            ctx.drawImage(imageBack, 0, 0, canvas.width, canvas.height);
            ctx.closePath()

            let textJS = `ctx.beginPath();`;
            ctx.strokeStyle= "black";

            ctx.strokeStyle= document.getElementById("color").value;

            ctx.beginPath();
            ctx.moveTo(initialPoint.x, initialPoint.y);
            tableCurves.forEach(curve => {
                textJS += curve.toCode();
            });

            ctx.stroke();
            textJS += `\nctx.stroke();`;
            js.innerText = textJS;

            tableCurves.forEach(curve => {
                curve.draw();
            });
        }

        function Clone(table){
            let newSave = [];

            table.forEach(elem => {
                newSave.push(elem.clone());
            });

            return newSave;
        }

        function UndoSave() {
            if (savingIndex == savings.length - 1) {
                savings.push(Clone(tableCurves));
                savingIndex++;
                return;
            }
            
            savings.splice(savingIndex + 1);
            savings.push(Clone(tableCurves));
            savingIndex++;
        }

        document.getElementById("jsVisibility").addEventListener("change", (e)=>{
                js.style.display = document.getElementById("jsVisibility").checked ? "flex" : "none";
        });

        document.getElementById("listVisibility").addEventListener("change", (e)=>{
                list.style.display = document.getElementById("listVisibility").checked ? "flex" : "none";
        });

        document.addEventListener('keydown', (e) => { // Undo/Redo
            const isCtrl = e.ctrlKey;

            if (isCtrl && e.key === 'z') {
                e.preventDefault();
                if (savingIndex > 0){
                    savingIndex--;
                    tableCurves = Clone(savings[savingIndex]);
                    draw();
                    ClearAndAddRows ();
                }
            }

            if (isCtrl && ((e.shiftKey && e.key === 'Z') || (e.key == "y"))) {
                e.preventDefault();

                if (savingIndex < savings.length - 1){
                    savingIndex++;
                    tableCurves = Clone(savings[savingIndex]);
                    draw();
                    ClearAndAddRows();
                }
            }
        });

        function calculeazaDimensiuniImagine(img) {
            const latimeEcran = window.innerWidth;
            const inaltimeEcran = window.innerHeight;

            const latimeImagine = latimeEcran / 2;
            const inaltimeImagine = inaltimeEcran / 2;

            const raportAspect = img.naturalWidth / img.naturalHeight;

            if (latimeImagine / inaltimeImagine > raportAspect) {
                return [inaltimeImagine * raportAspect, inaltimeImagine]
            } else {
                return [latimeImagine, latimeImagine / raportAspect];
            }
        }

        const container = document.getElementById("canvas");
        const container2 = document.getElementById("canvas-container");
        
        function ChangeBackground() {
            imageBack.src = document.getElementById("linkImage").value;
            imageBack.addEventListener("load", ()=>{
                let [x, y] = calculeazaDimensiuniImagine(imageBack);
                container2.style.width = x + "px";
                container2.style.height = y + "px";

                resizeCanvas();
            });
        }
        
        
        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            
            draw();
        }
        

        draw();
        ClearAndAddRows();
        new ResizeObserver(resizeCanvas).observe(container);

        resizeCanvas();
        
        function saveJSONToFile(jsonData, filename = 'savingFile.json') {
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function Saving() {
            const savingArray = [];
            tableCurves.forEach((elem) => {
                savingArray.push({ name: elem.constructor.name, ...elem }); // Include toate proprietățile
            });

            saveJSONToFile(savingArray);
        }

        const input = document.getElementById('fileInput');

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonData = JSON.parse(e.target.result);
                const newData = [];

                jsonData.forEach((data) => {
                    if (data.name === "Curve") {
                        const newCurve = new Curve();
                        data.coords.forEach((coord) => {
                            newCurve.addCoord(coord.x, coord.y);
                        });
                        newData.push(newCurve);
                    } else if (data.name === "MoveTo") {
                        newData.push(new MoveTo(data.coords.x, data.coords.y));
                    } else if (data.name === "Stroke") {
                        newData.push(new Stroke(data.lineWidth, data.strokeStyle));
                    } else if (data.name === "Fill") {
                        newData.push(new Fill(data.color));
                    } else if (data.name === "ClosePath") {
                        newData.push(new ClosePath());
                    }
                });

                tableCurves = newData;
                draw();
                ClearAndAddRows();
            };

            reader.readAsText(file);
        });