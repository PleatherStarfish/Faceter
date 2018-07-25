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

var divisor = 4;

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
var geometry = new THREE.TetrahedronGeometry( 60 );
var material = new THREE.MeshLambertMaterial( { color: "#ffffff" } );
var tetra = new THREE.Mesh( geometry, material );
tetra.material.side = THREE.DoubleSide;
//scene.add( tetra );

var masterGeometry = geometry.clone();    // copy oneFaceBuffer into a new geometry -> facetedGeometry
geometryFacesCounter= geometry.clone();
facetedGeometry = new THREE.Geometry();   // output list

for ( var j = 0; j < geometry.vertices.length; j++ ) {
  facetedGeometry.vertices.push(geometry.vertices[j]);
}

var faceter = 0; // This is the while-loop control variable. How many times should we facet the shape?

//----------------------------------------------------------------------------------------------------------
while (faceter < 3) {
    for ( var i = 0; i < geometry.faces.length; i++ ) {

          var oneFaceBuffer = new THREE.Geometry(); // create a buffer to hold one geometric face
          var face = masterGeometry.faces[0];       // set a variable to the 0 index of the starting geometry
          oneFaceBuffer.faces.push( face );         // push the 0 index face from the starting geometry to the buffer

          if ( face instanceof THREE.Face3 ) {

            oneFaceBuffer.vertices.push(masterGeometry.vertices[face.a]);  // get the nth vertex for the face and buffer it
            oneFaceBuffer.vertices.push(masterGeometry.vertices[face.b]);
            oneFaceBuffer.vertices.push(masterGeometry.vertices[face.c]);

            var centroid = new THREE.Vector3( 0, 0, 0 );  // create a vector
            centroid.add( oneFaceBuffer.vertices[ 0 ] );  // push the associated vertices into Centroid vector
            centroid.add( oneFaceBuffer.vertices[ 1 ] );
            centroid.add( oneFaceBuffer.vertices[ 2 ] );
            centroid.divideScalar( 3 );                   // devide Centroid vector by 3
            facetedGeometry.vertices.push(centroid);        // add Centroid as vertex a oneFaceBuffer's index 3
          }
          else if ( face instanceof THREE.Face4 ) {

            oneFaceBuffer.vertices.push(masterGeometry.vertices[face.a]);
            oneFaceBuffer.vertices.push(masterGeometry.vertices[face.b]);
            oneFaceBuffer.vertices.push(masterGeometry.vertices[face.c]);
            oneFaceBuffer.vertices.push(masterGeometry.vertices[face.d]);

            var centroid = new THREE.Vector3( 0, 0, 0 );
            centroid.add( oneFaceBuffer.vertices[ 0 ] );
            centroid.add( oneFaceBuffer.vertices[ 1 ] );
            centroid.add( oneFaceBuffer.vertices[ 2 ] );
            centroid.add( oneFaceBuffer.vertices[ 3 ] );
            centroid.divideScalar( 4 );
            facetedGeometry.vertices.push(centroid);
          }

          lastVertex = (facetedGeometry.vertices.length - 1)

          var face1 = new THREE.Face3( face.c, face.a, lastVertex );          // add three new faces to facetedGeometry
          facetedGeometry.faces.push( face1 );
          var face2 = new THREE.Face3( face.b, face.c, lastVertex );
          facetedGeometry.faces.push( face2 );
          var face3 = new THREE.Face3( face.a, face.b, lastVertex );
          facetedGeometry.faces.push( face3 );

          // give the 4th vertex (the centroid) a random offset

          //var distanceToCentroid = facetedGeometry.vertices[0].distanceTo( facetedGeometry.vertices[3] );
          //var range = distToCentroidScaling( distanceToCentroid, divisor );

          lastVertex = (facetedGeometry.vertices.length - 1)
          facetedGeometry.vertices[lastVertex].addScalar(randomRange(0.0, 10.0/(faceter+1)), randomRange(0.0, 10.0/(faceter+1)), randomRange(0.0, 10.0/(faceter+1)));
          facetedGeometry.verticesNeedUpdate = true;

          facetedGeometry.computeFaceNormals();
          facetedGeometry.computeVertexNormals();
          facetedGeometry.verticesNeedUpdate = true;
          facetedGeometry.normalsNeedUpdate = true;

          //testing sphere is to check centroid
          testingSphere(facetedGeometry.vertices[lastVertex].x, facetedGeometry.vertices[lastVertex].y, facetedGeometry.vertices[lastVertex].z);

    masterGeometry.faces.shift();
    //console.log(facetedGeometry.faces);

    }

var geometry = facetedGeometry.clone();
var masterGeometry = facetedGeometry.clone();
faceter += 1;

}
//----------------------------------------------------------------------------------------------------------


var newMaterial = new THREE.MeshPhongMaterial( { color: "#ff0000" } );
newMesh = new THREE.Mesh( facetedGeometry, newMaterial );
newMesh.material.side = THREE.DoubleSide;
scene.add( newMesh );

// normals helpers
// normalsHelper = new THREE.FaceNormalsHelper( newMesh, 2, 0x00ff00, 1 );
// scene.add( normalsHelper );
// var vertexNormalsHelper = new THREE.VertexNormalsHelper( newMesh, 2, 0x00ff00, 1 );
// scene.add( vertexNormalsHelper );




// Render Loop
var render = function () {
  requestAnimationFrame( render );

  newMesh.rotation.x += 0.01;
  newMesh.rotation.y += 0.01;
  renderer.sortObjects = false;
  // Render the scene
  renderer.render(scene, camera);
};

// other functions

function randomRange(min, max, plusMin = (Math.random() < 0.5 ? -1 : 1)) {
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
