 var isSelectedTool = "";
 var canvasx = 0;
var canvasy = 0;
var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;

var tempArrX=[];
var tempArrY=[];

var sMY=0;
var sMX=0;

var cnt=1;
 
// Initialize croquis
var croquis = new Croquis();
croquis.lockHistory();
croquis.setCanvasSize(window.innerWidth, window.innerHeight);
croquis.addLayer();
croquis.fillLayer('#000');
croquis.addLayer();
croquis.selectLayer(1);
croquis.unlockHistory();

var brush = new Croquis.Brush();
brush.setSize(2);
brush.setColor('#000');
brush.setSpacing(0.2);

croquis.setTool(brush);
croquis.setToolStabilizeLevel(10);
croquis.setToolStabilizeWeight(0.5);

var croquisDOMElement = croquis.getDOMElement();
var canvasArea = document.getElementById('canvas-area');
console.log("DOM::::::::::::::::  ",croquisDOMElement);


window.addEventListener("resize", function(){
	croquis.setCanvasSize(window.innerWidth, window.innerHeight);
	
});


canvasArea.appendChild(croquisDOMElement);
function canvasPointerDown(e) {
	
	
	
	var cX =  e.clientX
	var cY =  e.clientY
	
	 
	
    last_mousex = mousex = parseInt(cX-canvasx);
	last_mousey = mousey = parseInt(cY-canvasy);
	
	//if(isSelectedTool=="pencil")
	{
	 mousedown = true;
	}
	sMX = last_mousex;
	sMY = last_mousey;
	tempArrX=[];
	tempArrY=[];
	tempArrX.push(sMX);
	tempArrY.push(sMY);
	console.log("canvas mouse down ",isSelectedTool)
	
	
	

    setPointerEvent(e);
    var pointerPosition = getRelativePosition(e.clientX, e.clientY);
    if (pointerEventsNone)
      //  canvasArea.style.setProperty('cursor', 'none');
    if (e.pointerType === "pen" && e.button == 5)
        croquis.setPaintingKnockout(true);
    croquis.down(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
    document.addEventListener('pointermove', canvasPointerMove);
    document.addEventListener('pointerup', canvasPointerUp);
}
function canvasPointerMove(e) {
	var cX =  e.clientX
	var cY =  e.clientY	
	
	
	if(cX > (window.innerWidth -  (($(".tool-container").width()+8))) || cX<0 || cY>window.innerHeight-20)  		
		{
			mousedown=false;
			console.log("FALSE");
			return;
		}
		
		if(mousedown)
		{
    setPointerEvent(e);
    var pointerPosition = getRelativePosition(e.clientX, e.clientY);
	
	
	
    mousex = parseInt(cX-canvasx);
    mousey = parseInt(cY-canvasy);
	tempArrX.push(mousex);
	tempArrY.push(mousey);
	
	
	
    croquis.move(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
		}
}
function canvasPointerUp(e) {
	
	console.log("mouse up");
	//mousedown=false;
    setPointerEvent(e);
    var pointerPosition = getRelativePosition(e.clientX, e.clientY);
    if (pointerEventsNone)
       // canvasArea.style.setProperty('cursor', 'pointer');
 //   croquis.up(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1);
    croquis.up(mousex,mousey, e.pointerType === "pen" ? e.pressure : 1);
   /*  if (e.pointerType === "pen" && e.button == 5)
        setTimeout(function() {croquis.setPaintingKnockout(selectEraserCheckbox.checked)}, 30);//timeout should be longer than 20 (knockoutTickInterval in Croquis) */
	
	
   
	 
	
	tempArrX.sort(function(a, b){return a - b})
	tempArrY.sort(function(a, b){return a - b})
	 eMX = tempArrX[tempArrX.length-1];//last_mousex;
	eMY = tempArrY[tempArrY.length-1];//last_mousey;
	
	sMX = tempArrX[0];
	sMY = tempArrY[0];
	 
		
			
	  
	  setTimeout(function(){
		  var canvas = document.getElementsByClassName('croquis-layer-canvas');
	 console.log("canvasss ",canvas)
var dataURL = canvas[0].toDataURL()
 var ctx  = canvas[0].getContext('2d');
 
	 
		 $("body").prepend('<div class="tempItem" id="mydiv'+cnt+'"  style="position:absolute; cursor:pointer; z-index:9999;pointer-events:none;" width:auto;></div>') 
	// ctx.clearRect(0,0, window.innerWidth,window.innerHeight)		 
	
	var  _wd = Math.abs(sMX-eMX);
	var  _ht = Math.abs(sMY-eMY);
	if(Math.abs(sMX-eMX)<=10)
	{
		_wd=10;
		_ht=10;
	}
	
	console.log("WDDDDDDDDDDD ",_wd," ---- ",_ht)
	 var imgData = ctx.getImageData(sMX,sMY,Math.abs(_wd),Math.abs(_ht))
	
 
	 dataURL.slice(0,dataURL.length);
	  // dataURL.slice(0,dataURL.length-1)
	 
	 $("#mydiv"+cnt).append('<img src='+(dataURL)+'>')
	  $("body").prepend('<div   class="clickable1 tempItem" id="hitBtn'+cnt+'" style="position:absolute;z-index:9999; padding:5px; margin-left:0px; margin-top:0px; min-width:50px; min-height:50px; left:'+sMX+'px; top:'+sMY+'px; border:0px solid red; width:'+Math.abs(sMX-eMX)+'px; height:'+Math.abs(sMY-eMY)+'px"></div>')
	  croquis.clearLayer();
	   $(".clickable1").unbind("click").bind("click", function() {
	 
	
	 
	 var ID = $(this).attr("id").split("hitBtn")[1];
	
	 $("#hitBtn"+ID).remove();
	 $("#mydiv"+ID).remove();
	 })
	 
	 cnt++;
	  },100)
	 

	
	
	 document.removeEventListener('pointermove', canvasPointerMove);
    document.removeEventListener('pointerup', canvasPointerUp);
}
function getRelativePosition(absoluteX, absoluteY) {
    var rect = croquisDOMElement.getBoundingClientRect();
    return {x: absoluteX - rect.left, y: absoluteY - rect.top};
}
croquisDOMElement.addEventListener('pointerdown', canvasPointerDown);

//clear & fill button ui
var clearButton = document.getElementById('clear-button');
clearButton.onclick = function () {
    croquis.clearLayer();
}
var fillButton = document.getElementById('fill-button');
fillButton.onclick = function () {
    var rgb = tinycolor(brush.getColor()).toRgb();
    croquis.fillLayer(tinycolor({r: rgb.r, g: rgb.g, b: rgb.b,
        a: croquis.getPaintingOpacity()}).toRgbString());
}

//brush images
var circleBrush = document.getElementById('circle-brush');
var brushImages = document.getElementsByClassName('brush-image');
var currentBrush = circleBrush;

Array.prototype.map.call(brushImages, function (brush) {
    brush.addEventListener('pointerdown', brushImagePointerDown);
});

function brushImagePointerDown(e) {
    var image = e.currentTarget;
    currentBrush.className = 'brush-image';
    image.className = 'brush-image on';
    currentBrush = image;
    if (image == circleBrush)
        image = null;
    brush.setImage(image);
    updatePointer();
}

// checking pointer-events property support
var pointerEventsNone = document.documentElement.style.pointerEvents !== undefined;

//brush pointer
var brushPointerContainer = document.createElement('div');
brushPointerContainer.className = 'brush-pointer';

if (pointerEventsNone) {
    croquisDOMElement.addEventListener('pointerover', function () {
        croquisDOMElement.addEventListener('pointermove', croquisPointerMove);
        document.body.appendChild(brushPointerContainer);
    });
    croquisDOMElement.addEventListener('pointerout', function () {
        croquisDOMElement.removeEventListener('pointermove', croquisPointerMove);
        brushPointerContainer.parentElement.removeChild(brushPointerContainer);
    });
}

function croquisPointerMove(e) {
    if (pointerEventsNone) {
        var x = e.clientX + window.pageXOffset;
        var y = e.clientY + window.pageYOffset;
        brushPointerContainer.style.setProperty('left', x + 'px');
        brushPointerContainer.style.setProperty('top', y + 'px');
    }
}

function updatePointer() {
    if (pointerEventsNone) {
        var image = currentBrush;
        var threshold;
        if (currentBrush == circleBrush) {
            image = null;
            threshold = 0xff;
        }
        else {
            threshold = 0x30;
        }
        var brushPointer = Croquis.createBrushPointer(
            image, brush.getSize(), brush.getAngle(), threshold, true);
        brushPointer.style.setProperty('margin-left',
            '-' + (brushPointer.width * 0.5) + 'px');
        brushPointer.style.setProperty('margin-top',
            '-' + (brushPointer.height * 0.5) + 'px');
        brushPointerContainer.innerHTML = '';
        brushPointerContainer.appendChild(brushPointer);
    }
}
updatePointer();

//color picker
var colorPickerHueSlider =
    document.getElementById('color-picker-hue-slider');
var colorPickerSb = document.getElementById('color-picker-sb');
var colorPickerHSBRect = new HSBRect(150, 150);
colorPickerHSBRect.DOMElement.id = 'color-picker-hsbrect';
colorPickerSb.appendChild(colorPickerHSBRect.DOMElement);
var colorPickerThumb = document.createElement('div');
colorPickerThumb.id = 'color-picker-thumb';
colorPickerSb.appendChild(colorPickerThumb);
colorPickerHueSlider.value = tinycolor(brush.getColor()).toHsv().h;

function setColor() {
    var halfThumbRadius = 7.5;
    var sbSize = 150;
    var h = colorPickerHueSlider.value;
    var s = parseFloat(
        colorPickerThumb.style.getPropertyValue('margin-left'));
    var b = parseFloat(
        colorPickerThumb.style.getPropertyValue('margin-top'));
    s = (s + halfThumbRadius) / sbSize;
    b = 1 - ((b + halfThumbRadius + sbSize) / sbSize);
	

    brush.setColor(tinycolor({h: h, s:s, v: b}).toRgbString());
    var a = croquis.getPaintingOpacity();
    var color = tinycolor({h: h, s:s, v: b, a: a});
    colorPickerColor.style.backgroundColor = color.toRgbString();
    colorPickerColor.textContent = color.toHexString();
}

colorPickerHueSlider.onchange = function () {
    colorPickerHSBRect.hue = colorPickerHueSlider.value;
    setColor();
}

function colorPickerPointerDown(e) {
    document.addEventListener('pointermove', colorPickerPointerMove);
    colorPickerPointerMove(e);
}
function colorPickerPointerUp(e) {
    document.removeEventListener('pointermove', colorPickerPointerMove);
}
function colorPickerPointerMove(e) {
    var boundRect = colorPickerSb.getBoundingClientRect();
    var x = (e.clientX - boundRect.left);
    var y = (e.clientY - boundRect.top);
    pickColor(x, y);
}
function minmax(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function pickColor(x, y) {
    var halfThumbRadius = 7.5;
    var sbSize = 150;
    colorPickerThumb.style.setProperty('margin-left',
        (minmax(x, 0, sbSize) - halfThumbRadius) + 'px');
    colorPickerThumb.style.setProperty('margin-top',
        (minmax(y, 0, sbSize) - (sbSize + halfThumbRadius)) + 'px');
    colorPickerThumb.style.setProperty('border-color',
        (y < sbSize * 0.5)? '#000' : '#fff');
    setColor();
}
colorPickerSb.addEventListener('pointerdown', colorPickerPointerDown);
document.addEventListener('pointerup', colorPickerPointerUp);

var backgroundCheckerImage;
(function () {
    backgroundCheckerImage = document.createElement('canvas');
    backgroundCheckerImage.width = backgroundCheckerImage.height = 20;
    var backgroundImageContext = backgroundCheckerImage.getContext('2d');
    backgroundImageContext.fillStyle = '#fff';
    backgroundImageContext.fillRect(0, 0, 20, 20);
    backgroundImageContext.fillStyle = '#ccc';
    backgroundImageContext.fillRect(0, 0, 10, 10);
    backgroundImageContext.fillRect(10, 10, 20, 20);
})();

var colorPickerChecker = document.getElementById('color-picker-checker');
colorPickerChecker.style.backgroundImage = 'url(' +
    backgroundCheckerImage.toDataURL() + ')';
var colorPickerColor = document.getElementById('color-picker-color');

pickColor(0, 150);

//stabilizer shelf
var toolStabilizeLevelSlider =
    document.getElementById('tool-stabilize-level-slider');
var toolStabilizeWeightSlider =
    document.getElementById('tool-stabilize-weight-slider');
toolStabilizeLevelSlider.value = croquis.getToolStabilizeLevel();
toolStabilizeWeightSlider.value = croquis.getToolStabilizeWeight() * 100;

//brush shelf
var selectEraserCheckbox =
    document.getElementById('select-eraser-checkbox');
var brushSizeSlider = document.getElementById('brush-size-slider');
var brushOpacitySlider = document.getElementById('brush-opacity-slider');
var brushFlowSlider = document.getElementById('brush-flow-slider');
var brushSpacingSlider = document.getElementById('brush-spacing-slider');
var brushAngleSlider = document.getElementById('brush-angle-slider');
var brushRotateToDirectionCheckbox = document.getElementById('brush-rotate-to-direction-checkbox');
brushSizeSlider.value = brush.getSize();
brushOpacitySlider.value = croquis.getPaintingOpacity() * 100;
brushFlowSlider.value = brush.getFlow() * 100;
brushSpacingSlider.value = brush.getSpacing() * 100;
brushAngleSlider.value = brush.getAngle();
brushRotateToDirectionCheckbox.checked = brush.getRotateToDirection();

toolStabilizeLevelSlider.onchange = function () {
    croquis.setToolStabilizeLevel(toolStabilizeLevelSlider.value);
    toolStabilizeLevelSlider.value = croquis.getToolStabilizeLevel();
}
toolStabilizeWeightSlider.onchange = function () {
    croquis.setToolStabilizeWeight(toolStabilizeWeightSlider.value * 0.01);
    toolStabilizeWeightSlider.value = croquis.getToolStabilizeWeight() * 100;
}

selectEraserCheckbox.onchange = function () {
    croquis.setPaintingKnockout(selectEraserCheckbox.checked);
}
brushSizeSlider.onchange = function () {
    brush.setSize(brushSizeSlider.value);
    updatePointer();
}
brushOpacitySlider.onchange = function () {
    croquis.setPaintingOpacity(brushOpacitySlider.value * 0.01);
    setColor();
}
brushFlowSlider.onchange = function () {
    brush.setFlow(brushFlowSlider.value * 0.01);
}
brushSpacingSlider.onchange = function () {
    brush.setSpacing(brushSpacingSlider.value * 0.01);
}
brushAngleSlider.onchange = function () {
    brush.setAngle(brushAngleSlider.value);
    updatePointer();
}
brushRotateToDirectionCheckbox.onchange = function () {
    brush.setRotateToDirection(brushRotateToDirectionCheckbox.checked);
}

// Platform variables
var mac = navigator.platform.indexOf('Mac') >= 0;

//keyboard
document.addEventListener('keydown', documentKeyDown);
function documentKeyDown(e) {
    if (mac ? e.metaKey : e.ctrlKey) {
        switch (e.keyCode) {
        case 89: //ctrl + y
            croquis.redo();
            break;
        case 90: //ctrl + z
            croquis[e.shiftKey ? 'redo' : 'undo']();
            break;
        }
    }
}

function setPointerEvent(e) {
    if (e.pointerType !== "pen" && Croquis.Tablet.pen() && Croquis.Tablet.pen().pointerType) {//it says it's not a pen but it might be a wacom pen
        e.pointerType = "pen";
        e.pressure = Croquis.Tablet.pressure();
        if (Croquis.Tablet.isEraser()) {
            Object.defineProperties(e, {
                "button": { value: 5 },
                "buttons": { value: 32 }
            });
        }
    }
}
