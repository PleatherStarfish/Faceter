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
light.position.set( 10, 10, 10 );
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

var oneFaceBuffer = new THREE.Geometry();
var face = geometry.faces[0];
oneFaceBuffer.faces.push( face );


oneFaceBuffer.vertices.push(geometry.vertices[face.a]);
oneFaceBuffer.vertices.push(geometry.vertices[face.b]);
oneFaceBuffer.vertices.push(geometry.vertices[face.c]);

var centroid = new THREE.Vector3( 0, 0, 0 );
centroid.add( oneFaceBuffer.vertices[ 0 ] );
centroid.add( oneFaceBuffer.vertices[ 1 ] );
centroid.add( oneFaceBuffer.vertices[ 2 ] );
centroid.divideScalar( 3 );

var sphereGeo = new THREE.SphereGeometry( 1, 32, 32 );
var materialSphere = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
var sphere = new THREE.Mesh( sphereGeo, materialSphere );
sphere.position.x = -2.309401035308838
sphere.position.y = 2.309401035308838
sphere.position.z = 2.309401035308838
scene.add( sphere );




var newMaterial = new THREE.MeshBasicMaterial( { color: "#ff0000" } );
newMesh = new THREE.Mesh( oneFaceBuffer, newMaterial );
newMesh.material.side = THREE.DoubleSide;
scene.add( newMesh );
console.log(computeFaceCentroids( oneFaceBuffer ))


mesh = new THREE.Mesh( geometry, material );
mesh.material.side = THREE.DoubleSide;

// Add cube to Scene
scene.add( mesh );


// Render Loop
var render = function () {
  requestAnimationFrame( render );

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

function getRandomWithinRange(min, max) {
  return Math.random() * (max - min) + min;
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

render();
