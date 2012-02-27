function FaceCubeManager(canvas) {
	this.canvas = canvas;
	this.gl = null;
	//Init web GL context
	if(this.initWebGL()) {
		this.initCanvas();
		this.initShaders();
	}
}
FaceCubeManager.prototype.initWebGL = function() {
	this.gl = null;
	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	if (!this.gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		return false;
	}
	return true;
};
FaceCubeManager.prototype.initCanvas = function() {
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
	this.gl.enable(this.gl.DEPTH_TEST);                               // Enable depth testing
	this.gl.depthFunc(this.gl.LEQUAL);                                // Near things obscure far things
	this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
};
FaceCubeManager.prototype.initShaders = function() {
	var fragmentShader = this.getShader('shader-fs');
	var vertexShader = this.getShader('shader-vs');

	var shaderProgram = this.gl.createProgram();
	this.gl.attachShader(shaderProgram, vertexShader);
	this.gl.attachShader(shaderProgram, fragmentShader);
	this.gl.linkProgram(shaderProgram);

	if(!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program');
	}
	this.gl.useProgram(shaderProgram);
};
FaceCubeManager.prototype.getShader = function(id) {
	var shaderScript, theSource, currentChild, shader;
	shaderScript = document.getElementById(id);
	if(!shaderScript) {
		console.error('Unable to find shader "'+id+'"');
		return null;
	}

	//Get shader source from script
	theSource = $('#'+id).html();

	//Create shader
	if(shaderScript.type == 'x-shader/x-fragment') {
		shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
	} else if(shaderScript.type == 'x-shader/x-vertex') {
		shader = this.gl.createShader(this.gl.VERTEX_SHADER);
	} else {
		console.error('Unknown shader type "'+shaderScript.type+'" on shader "'+id+'"');
		return null;
	}

	//Set shader source
	this.gl.shaderSource(shader, theSource);
	//Compile shader program
	this.gl.compileShader(shader);
	//Check shader compile sucessful
	if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		console.error('An error occurred during shader compilation: '+this.gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
};

function FaceCube() {

}
FaceCube.prototype.cube_vertices = [
	// Front face
	-1.0, -1.0,  1.0,
	1.0, -1.0,  1.0,
	1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,

	// Back face
	-1.0, -1.0, -1.0,
	-1.0,  1.0, -1.0,
	1.0,  1.0, -1.0,
	1.0, -1.0, -1.0,

	// Top face
	-1.0,  1.0, -1.0,
	-1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
	1.0,  1.0, -1.0,

	// Bottom face
	-1.0, -1.0, -1.0,
	1.0, -1.0, -1.0,
	1.0, -1.0,  1.0,
	-1.0, -1.0,  1.0,

	// Right face
	1.0, -1.0, -1.0,
	1.0,  1.0, -1.0,
	1.0,  1.0,  1.0,
	1.0, -1.0,  1.0,

	// Left face
	-1.0, -1.0, -1.0,
	-1.0, -1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0,  1.0, -1.0
];