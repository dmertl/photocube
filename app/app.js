
function RubiksFace(canvasName) {
	this.canvas_name = canvasName;
	this.cube_size = 100;
	this.cube_spacing = 10;
	this.cubes = Array();

	this.init(canvasName);
}
RubiksFace.prototype.init = function(canvasName) {
	c3dl.addModel("models/cube/cube.dae");
	this.initScene(canvasName);
}
RubiksFace.prototype.initScene = function(canvasName) {
	console.log('initScene');
	// Create new c3dl.Scene object
	scn = new c3dl.Scene();
	scn.setCanvasTag(canvasName);

	// Create GL context
	renderer = new c3dl.WebGL();
	renderer.createRenderer(this);

	// Attach renderer to the scene
	scn.setRenderer(renderer);

	//Turn ambient lighting off
	scn.setAmbientLight([0, 0, 0, 0]);

	scn.init(canvasName);

	this.createCubes();

	// Create a camera
	var cam = new c3dl.FreeCamera();
	cam.setPosition(new Array(200.0, 300.0, 500.0));
	cam.setLookAtPoint(new Array(0.0, 0.0, 0.0));
	scn.setCamera(cam);

	//Add light
	var diffuse = new c3dl.PositionalLight();
	diffuse.setName('diffuse');
	diffuse.setPosition([0, 300, 0]);
	diffuse.setDiffuse([0.5, 0.5, 0.5, 1]);
	diffuse.setOn(true);
	scn.addLight(diffuse);

	// Start the scene
	scn.startScene();
}
RubiksFace.prototype.createCubes = function() {
	this.cubes = new Array(3);
	console.log(this.cubes);
	for(var i=0; i<3; i++) {
		this.cubes[i] = new Array(3);
		for(var j=0; j<3; j++) {
			this.cubes[i][j] = new Array(3);
			for(var k=0; k<3; k++) {
				var cube = new c3dl.Collada();

				cube.init("models/cube/cube.dae");

				//Add material
				var material = new c3dl.Material();
				material.setDiffuse([1, 1, 1]);
				cube.setMaterial(material);

				cube.setPosition([(this.cube_size + this.cube_spacing) - k * (this.cube_size + this.cube_spacing),
					(this.cube_size + this.cube_spacing) - i * (this.cube_size + this.cube_spacing),
					(this.cube_size + this.cube_spacing) - j * (this.cube_size + this.cube_spacing)]);

				scn.addObjectToScene(cube);

				this.cubes[i][j][k] = cube;
			}
		}
	}
}
RubiksFace.prototype.setDiffuse = function(i, j, k, diffuse) {
	var material = new c3dl.Material();
	material.setDiffuse(diffuse);
	this.cubes[i][j][k].setMaterial(material);
}
RubiksFace.prototype.rotateSlice = function(slice, angle) {
	//DEBUG top slice
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			//this.cubes[0][i][j].rotateOnAxis([0, 1, 0], angle);
			var result;
			console.log(this.cubes[0][i][j].getTransform());
			console.log([angle, 0, 0, 0]);
			result = c3dl.multiplyMatrixByVector(this.cubes[0][i][j].getTransform(), [angle, 0, 0, 0]);
			console.log(result);
			break;
		}
	}
	//need to figure out how to rotate about vector other than axis of actor
}
