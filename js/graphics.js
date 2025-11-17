import "./three.js"

var geometry;
var object;
var cube;
var sphereOfPoints;


/* 
Switches shape from cube to sphere of points or vice versa
 */
function switchShape(){
	if(object != null){
		if(object==cube){
			scene.remove(cube);
			scene.add( sphereOfPoints );
			object=sphereOfPoints;
		}else if(object==sphereOfPoints){
			scene.remove(sphereOfPoints);
			scene.add(cube);
			object=cube;
		}
		
	}
}

/** rotates the current object */
function animate() {
	//causes animate to be called again.
	requestAnimationFrame( animate );
	object.rotation.x += 0.01;
	object.rotation.y += 0.01;
	renderer.render( scene, camera );
}
/**draws a cube */
function drawCube(){
	//First make geometry, then material, 
	//then finally a shape from geometry and material
	geometry = new THREE.BoxGeometry( 1, 1, 1 );
	let material = new THREE.MeshBasicMaterial({color: 0xff0000});
	
	cube = new THREE.Mesh( geometry, material );
}

/**draws a particle cube */
function drawParticleSphere(){
	//Set up a particle sphere
	let vertexCoords = new Float32Array([ 0,0,0, 1,0,0, 0,1,0 ]);//location of the sphere
	let vertexAttrib = new THREE.BufferAttribute(vertexCoords, 3);
	geometry = new THREE.BufferGeometry();
	geometry.setAttribute( "position", vertexAttrib );

	let pointsBuffer = new Float32Array( 30000 ); // 3 numbers per vertex!
	let colorBuffer = new Float32Array( 30000 );
	let i = 0;
	while ( i < 10000 ) {
		let x = 2*Math.random() - 1;
		let y = 2*Math.random() - 1;
		let z = 2*Math.random() - 1;
		if ( x*x + y*y + z*z < 1 ) {
			// only use points inside the unit sphere
			pointsBuffer[3*i] = x;
			pointsBuffer[3*i+1] = y;
			pointsBuffer[3*i+2] = z;
			colorBuffer[3*i] = 0.25 + 0.75*Math.random();
			colorBuffer[3*i+1] = 0.25 + 0.75*Math.random();
			colorBuffer[3*i+2] = 0.25 + 0.75*Math.random();
			i++;
		}
	}
	let pointsGeom = new THREE.BufferGeometry();
	pointsGeom.setAttribute("position", new THREE.BufferAttribute(pointsBuffer,3));
	pointsGeom.setAttribute("color", new THREE.BufferAttribute(colorBuffer,3));
	geometry.setAttribute( "position", vertexAttrib );
	//create material for points.
	let pointsMat = new THREE.PointsMaterial( {
		color: "white",
		size: 2,
		sizeAttenuation: false,
		vertexColors: true
		} );
	//finally create the sphere with the geometry and material
	sphereOfPoints = new THREE.Points( pointsGeom, pointsMat );
	
}

//Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();

//set up the renderer
var location=document.getElementById("three");
renderer.setSize(window.innerWidth-100,window.innerHeight-100);
location.appendChild( renderer.domElement );

//set button to change shapes
var button=document.getElementById("shape");
button.onclick=switchShape;


//Render the shapes and then select the first shape. Start animation.
drawCube();
drawParticleSphere();
object=cube;
scene.add(object);
//set light to some color
let light= new THREE.DirectionalLight(0xffffff,1.0); 
light.position.set(-2,2,0);
scene.add(light);

animate();