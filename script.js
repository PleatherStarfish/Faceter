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
light.position.set( randomRange(-110.0, 110.0), randomRange(-110.0, 110.0), randomRange(-110.0, 110.0) );
scene.add( light );

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

// ------------------------------------------------
// GEOMETRY
// ------------------------------------------------

// Create a Cube Mesh with basic material
//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshLambertMaterial( { color: "#ffffff" } );
//var cube = new THREE.Mesh( geometry, material );

// Add cube to Scene
//scene.add( cube );

// Create a Tetrahedron Mesh with basic material
var geometry = new THREE.TetrahedronGeometry( 12 );
var material = new THREE.MeshLambertMaterial( { color: "#ffffff" } );
var tetra = new THREE.Mesh( geometry, material );

//var material = new THREE.MeshBasicMaterial( { color : 0xffcccc } );

//var geometry = new THREE.Geometry();
//geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
//geometry.vertices.push( new THREE.Vector3(  0, 10, 0 ) );
//geometry.vertices.push( new THREE.Vector3(  0,  10, 10 ) );

//var face = new THREE.Face3( 0, 1, 2 );
//geometry.faces.push( face );

var oneFaceBuffer = new THREE.Geometry(); // create a buffer to hold one geometric face
var face = geometry.faces[0];             // set a variable to the 0 index of the starting geometry
oneFaceBuffer.faces.push( face );         // push the 0 index face from the starting geometry to the buffer

if ( face instanceof THREE.Face3 ) {

  oneFaceBuffer.vertices.push(geometry.vertices[face.a]);  // get the nth vertex for the face and buffer it
  oneFaceBuffer.vertices.push(geometry.vertices[face.b]);
  oneFaceBuffer.vertices.push(geometry.vertices[face.c]);

  var centroid = new THREE.Vector3( 0, 0, 0 );  // create a vector
  centroid.add( oneFaceBuffer.vertices[ 0 ] );
  centroid.add( oneFaceBuffer.vertices[ 1 ] );
  centroid.add( oneFaceBuffer.vertices[ 2 ] );
  centroid.divideScalar( 3 );
  oneFaceBuffer.vertices.push(centroid);
}
else if ( face instanceof THREE.Face4 ) {

  oneFaceBuffer.vertices.push(geometry.vertices[face.a]);
  oneFaceBuffer.vertices.push(geometry.vertices[face.b]);
  oneFaceBuffer.vertices.push(geometry.vertices[face.c]);
  oneFaceBuffer.vertices.push(geometry.vertices[face.d]);

  var centroid = new THREE.Vector3( 0, 0, 0 );
  centroid.add( oneFaceBuffer.vertices[ 0 ] );
  centroid.add( oneFaceBuffer.vertices[ 1 ] );
  centroid.add( oneFaceBuffer.vertices[ 2 ] );
  centroid.add( oneFaceBuffer.vertices[ 3 ] );
  centroid.divideScalar( 4 );
  oneFaceBuffer.vertices.push(centroid);
}

//testing sphere is to check centroid
//testingSphere( centroid.x, centroid.y, centroid.z );

var facetedGeometry = oneFaceBuffer.clone();
facetedGeometry.faces = [];

var face1 = new THREE.Face3( 0, 1, 3 )
facetedGeometry.faces.push( face1 );
var face2 = new THREE.Face3( 1, 2, 3 )
facetedGeometry.faces.push( face2 );
var face3 = new THREE.Face3( 0, 2, 3 )
facetedGeometry.faces.push( face3 );

//var p = facetedGeometry.vertices[3];
facetedGeometry.vertices[3].addScalar(randomRange(0.0, 6.0), randomRange(0.0, 6.0), randomRange(0.0, 6.0));
facetedGeometry.verticesNeedUpdate = true;

// reset order of normals
for ( var i = 0; i < facetedGeometry.faces.length-1; i ++ ) {

    var face = facetedGeometry.faces[ i ];
    var temp = face.a;
    face.a = face.c;
    face.c = temp;

}

facetedGeometry.computeFaceNormals();
facetedGeometry.computeVertexNormals();
facetedGeometry.computeMorphNormals();
facetedGeometry.verticesNeedUpdate = true;
facetedGeometry.normalsNeedUpdate = true;

var newMaterial = new THREE.MeshPhongMaterial( { color: "#ff0000" } );
newMesh = new THREE.Mesh( facetedGeometry, newMaterial );
newMesh.material.side = THREE.DoubleSide;
scene.add( newMesh );
normalsHelper = new THREE.FaceNormalsHelper( newMesh, 2, 0x00ff00, 1 );
scene.add( normalsHelper );
var vertexNormalsHelper = new THREE.VertexNormalsHelper( newMesh, 2, 0x00ff00, 1 );
scene.add( vertexNormalsHelper );


mesh = new THREE.Mesh( geometry, material );
mesh.material.side = THREE.DoubleSide;

// Add main mesh to Scene
scene.add( mesh );


// Render Loop
var render = function () {
  requestAnimationFrame( render );

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

function randomRange(min, max) {
  return ((Math.random() * (max - min) + min)) * (Math.random() < 0.5 ? -1 : 1);
}
function computeFaceCentroids( geometry ) {
    var f, fl, face;
    for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {
        face = geometry.faces[ f ];
        face.centroid = new THREE.Vector3( 0, 0, 0 );
        if ( face instanceof THREE.Face3 ) {
            face.centroid.add( geometry.vertices[ face.a ] );
            face.centroid.add( geometry.vertices[ face.b ] );
            face.centroid.add( geometry.vertices[ face.c ] );
            face.centroid.divideScalar( 3 );
        } else if ( face instanceof THREE.Face4 ) {
            face.centroid.add( geometry.vertices[ face.a ] );
            face.centroid.add( geometry.vertices[ face.b ] );
            face.centroid.add( geometry.vertices[ face.c ] );
            face.centroid.add( geometry.vertices[ face.d ] );
            face.centroid.divideScalar( 4 );
        }
    }
}

function testingSphere( x, y, z ) {
  var sphereGeo = new THREE.SphereGeometry( 1, 32, 32 );
  var materialSphere = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
  var sphere = new THREE.Mesh( sphereGeo, materialSphere );
  sphere.position.x = centroid.x
  sphere.position.y = centroid.y
  sphere.position.z = centroid.z
  scene.add( sphere );
}

render();
