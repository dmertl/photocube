function FaceCubeManager(canvas) {
	this.canvas = canvas;
	this.gl = null;
	this.vertexPositionAttribute = null;
	this.perspectiveMatrix = null;
	this.shaderProgram = null;
	this.test_square = null;
	//Init web GL context
	if(this.initWebGL()) {
		this.initCanvas();
		this.initShaders();

		this.test_square = new TestSquare(this.gl);
		this.drawScene();
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

	this.shaderProgram = this.gl.createProgram();
	this.gl.attachShader(this.shaderProgram, vertexShader);
	this.gl.attachShader(this.shaderProgram, fragmentShader);
	this.gl.linkProgram(this.shaderProgram);

	if(!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program');
	}
	this.gl.useProgram(this.shaderProgram);

	this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
	this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
};
FaceCubeManager.prototype.getShader = function(id) {
	var shaderScript, theSource, shader;
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
	//Check shader compile successful
	if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		console.error('An error occurred during shader compilation: '+this.gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
};
FaceCubeManager.prototype.drawScene = function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
	loadIdentity();
	mvTranslate([-0.0, 0.0, -6.0]);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.test_square.squareVerticesBuffer);
	this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
	setMatrixUniforms(this.gl, this.perspectiveMatrix, this.shaderProgram);
	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
};

function TestSquare(gl) {
	this.gl = gl;
	this.initBuffers();
}
TestSquare.prototype.initBuffers = function() {
	this.squareVerticesBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);
	var vertices = [
		1.0,  1.0,  0.0,
		-1.0, 1.0,  0.0,
		1.0,  -1.0, 0.0,
		-1.0, -1.0, 0.0
	];
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
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