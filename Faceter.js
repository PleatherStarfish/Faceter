class Faceter {
  constructor(geometry, depth=3) {
    this.geometry = geometry;
    this.depth = depth;
  }

  returnFaceted() {
    let masterGeometry = this.geometry.clone();    // copy oneFaceBuffer into a new geometry -> facetedGeometry
    let geometryFacesCounter= this.geometry.clone();
    let facetedGeometry = new THREE.Geometry();   // output list

    for ( var j = 0; j < this.geometry.vertices.length; j++ ) {
      facetedGeometry.vertices.push(this.geometry.vertices[j]);
    }

    var faceter = 0; // This is the while-loop control variable. How many times should we facet the shape?

    while (faceter < this.depth) {
        for ( var i = 0; i < this.geometry.faces.length; i++ ) {

              var oneFaceBuffer = new THREE.Geometry(); // create a buffer to hold one geometric face
              var face = masterGeometry.faces[0];       // set a variable to the 0 index of the starting geometry
              oneFaceBuffer.faces.push( face );         // push the 0 index face from the starting geometry to the buffer

              if ( face instanceof THREE.Face3 ) {

                oneFaceBuffer.vertices.push(masterGeometry.vertices[face.a]);  // get the nth vertex for the face and buffer it
                oneFaceBuffer.vertices.push(masterGeometry.vertices[face.b]);
                oneFaceBuffer.vertices.push(masterGeometry.vertices[face.c]);

                var centroid = new THREE.Vector3( 0, 0, 0 );  // create a vector
                centroid.add( oneFaceBuffer.vertices[ 0 ] );  // push the associated vertices into Centroid vector
                //centroid.add( oneFaceBuffer.vertices[ 1 ] );
                centroid.add( oneFaceBuffer.vertices[ 2 ] );
                centroid.divideScalar( 2 );                   // devide Centroid vector by 3
                facetedGeometry.vertices.push(centroid);      // add Centroid as vertex a oneFaceBuffer's index 3
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

              let lastVertex = (facetedGeometry.vertices.length - 1)

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
              //if ((Math.random() < 0.5 ? -1 : 1) < 0) {
                  facetedGeometry.vertices[lastVertex].addScalar(randomRange(0.0, (1/(faceter+1))), randomRange(0.0, (1/(faceter+1))), randomRange(0.0, (1/(faceter+1))));
              //}
              facetedGeometry.verticesNeedUpdate = true;

              facetedGeometry.computeFaceNormals();
              facetedGeometry.computeVertexNormals();
              facetedGeometry.verticesNeedUpdate = true;
              facetedGeometry.normalsNeedUpdate = true;

              //testing sphere is to check centroid
              //testingSphere(facetedGeometry.vertices[lastVertex].x, facetedGeometry.vertices[lastVertex].y, facetedGeometry.vertices[lastVertex].z);

        masterGeometry.faces.shift();
        //console.log(facetedGeometry.faces);

        }

      this.geometry = facetedGeometry.clone();
      masterGeometry = facetedGeometry.clone();
      faceter += 1;

      }
      return facetedGeometry;
  }
}
