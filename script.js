// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

//Orbit Control
var controls = new THREE.OrbitControls( camera );

// Create light
var light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( randomRange(-50.0, 50.0), randomRange(-50.0, 50.0), randomRange(-50.0, 50.0) );
scene.add( camera );
camera.add( light );

//Light helper
var helper = new THREE.DirectionalLightHelper( light );
scene.add( helper );

//Axes Helper
axis = new THREE.AxisHelper(75);
scene.add(axis);

//grid helper xz
var gridXZ = new THREE.GridHelper(100, 100);
scene.add(gridXZ);

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#cccccc");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

var divisor = 4;

// ------------------------------------------------
// GEOMETRY
// ------------------------------------------------

// Create a convex hull
var points = [];
for (var i = 0; i < 15; i++) {
    var randomX = -25 + Math.round(Math.random() * 50);
    var randomY = -25 + Math.round(Math.random() * 50);
    var randomZ = -25 + Math.round(Math.random() * 50);
    points.push(new THREE.Vector3(randomX, randomY, randomZ));
}

var geometry = new THREE.ConvexGeometry(points);
let subdivisionModifier = new THREE.SubdivisionModifier( 2, true );
subdivisionModifier.modify(geometry);

const faceter = new GeoFaceter(geometry, 1, 200, 2);
facetedGeometry = faceter.returnFaceted();

facetedGeometry.computeFaceNormals();
facetedGeometry.mergeVertices()
facetedGeometry.computeVertexNormals();

var buffer_g = new THREE.BufferGeometry();
buffer_g.fromGeometry(geometry);

//wall texture
var texture = new THREE.TextureLoader().load( 'concrete.png' );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 1, 1 );

let material = new THREE.MeshPhongMaterial( { map: texture, bumpMap: texture } );

mesh = new THREE.Mesh( buffer_g, material );
mesh.castShadow = true;
mesh.receiveShadow = true;
scene.add(mesh);


// newMesh = new THREE.Mesh( facetedGeometry, material );
// newMesh.material.side = THREE.DoubleSide;
// newMesh.geometry.mergeVertices();
//
// scene.add( newMesh );

// normals helpers
// normalsHelper = new THREE.FaceNormalsHelper( newMesh, 2, 0x00ff00, 1 );
// scene.add( normalsHelper );
// var vertexNormalsHelper = new THREE.VertexNormalsHelper( newMesh, 2, 0x00ff00, 1 );
// scene.add( vertexNormalsHelper );




// Render Loop
var render = function () {
  requestAnimationFrame( render );

  //newMesh.rotation.x += 0.01;
  //newMesh.rotation.y += 0.01;
  renderer.sortObjects = false;
  // Render the scene
  renderer.render(scene, camera);
};

// other functions

function randomRange(min, max, plusMin = (Math.random() < 0.5 ? 1 : 1)) {
  return Math.random() * ((max - min) + min) * plusMin
}

function distToCentroidScaling( distance, divisor ) {
  // get the distance between faces 0, 1, 2
  // get only the shortest distance
  // get the point halfway to the nearest point
  // get the distance to this mid point
  // return that value devided by a constant
  return distance / divisor;
}

function testingSphere( x, y, z ) {
  var sphereGeo = new THREE.SphereGeometry( .1, 32, 32 );
  var materialSphere = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
  var sphere = new THREE.Mesh( sphereGeo, materialSphere );
  sphere.position.x = x;
  sphere.position.y = y;
  sphere.position.z = z;
  scene.add( sphere );
}

render();
