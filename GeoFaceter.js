class GeoFaceter {
  constructor(geometry, depth) {
    this.geometry = geometry;
    this.depth = depth;
    this.counter = 0;
  }

// Random floats within a range
// ------------------------------------------------------------------------------------------------------------------
randomRange(min, max, fixed=4, integers=false) {
    if (integers) {
      return (Math.floor(Math.random() * (max - min) + min));
    }
    else {
      return (parseFloat((Math.random() * (max - min) + min).toFixed(fixed)));
    }
  }
// ------------------------------------------------------------------------------------------------------------------


// Random number n such that (min < n < max)
// ------------------------------------------------------------------------------------------------------------------
randomExcludingZero(min, max) {
    const n = Math.random() * (max - min) + min;
    if (n > 0) {
      return n;
    }
    else {
      return this.randomExcludingZero(min, max);
    }
  }
// ------------------------------------------------------------------------------------------------------------------

offset(distanceToCenter, normal) {
  const pointOffset = ((distanceToCenter / this.randomRange(5, 10)) * normal) / (this.counter + 1);
  return pointOffset;
}

distanceToCenter( v, geometry, boundingBox ) {
    var dx = v.x - boundingBox.getCenter().x;
    var dy = v.y - boundingBox.getCenter().y;
    var dz = v.z - boundingBox.getCenter().z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

  // Find a random point a face and pushes it into the facetedGeo
  // ------------------------------------------------------------------------------------------------------------------
  getPointWithinFace(theFace, geometry) {
    const r = this.randomExcludingZero(0.0, 1.0);
    const s = this.randomExcludingZero(0.0, 1.0-r);
    const t = (1.0 - r - s);
    let v1 = geometry.vertices[ theFace.a ].clone();
    let v2 = geometry.vertices[ theFace.b ].clone();
    let v3 = geometry.vertices[ theFace.c ].clone();
    let point = ( v1.multiplyScalar(r) );
    point.add( v2.multiplyScalar(s) );
    point.add( v3.multiplyScalar(t) );
    return point;
  }
  // ------------------------------------------------------------------------------------------------------------------


  returnFaceted(geometry=this.geometry) {
    var facetedGeo = new THREE.Geometry();   // Create empty geometry which will be the output list

    while (this.counter < this.depth) {
      facetedGeo.vertices = geometry.vertices;
      let faces = geometry.faces.length;
      for ( let i = 0; i < faces; i++ ) {

            const theFace = geometry.faces[i];   // set a variable to the 0 index of the starting geometry
            const pointWithinFace = this.getPointWithinFace(theFace, geometry);
            facetedGeo.vertices.push(pointWithinFace);

            const lastVertexIndex = (facetedGeo.vertices.length - 1) // This is the index of the vertex on the face

            const face1 = new THREE.Face3( theFace.c, theFace.a, lastVertexIndex ); // add three new faces to facetedGeo
            const face2 = new THREE.Face3( theFace.b, theFace.c, lastVertexIndex );
            const face3 = new THREE.Face3( theFace.a, theFace.b, lastVertexIndex );

            facetedGeo.faces.push( face1 );
            facetedGeo.faces.push( face2 );
            facetedGeo.faces.push( face3 );

            const skew = 1.0 / (60 * (this.counter+2));
            for (let h = 0; h < facetedGeo.faces.length; h++) {

              let p1 = facetedGeo.vertices[facetedGeo.faces[h].a];
              p1.multiplyScalar(this.randomRange((1-skew), (1+skew)), this.randomRange((1-skew), (1+skew)), this.randomRange((1-skew), (1+skew)));
              let p2 = facetedGeo.vertices[facetedGeo.faces[h].b];
              p2.multiplyScalar(this.randomRange((1-skew), (1+skew)), this.randomRange((1-skew), (1+skew)), this.randomRange((1-skew), (1+skew)));
              let p3 = facetedGeo.vertices[facetedGeo.faces[h].c];
              p3.multiplyScalar(this.randomRange((1-skew), (1+skew)), this.randomRange((1-skew), (1+skew)), this.randomRange((1-skew), (1+skew)));
            }

      }

      // method recurses until we reach the "depth" passed to it by the constructor
      this.counter += 1;
      geometry = facetedGeo.clone();
    }

    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const boundingBox = new THREE.Box3().setFromPoints( geometry.vertices );

    return geometry;

    // if (this.counter < this.depth) { this.returnFaceted(geometry); } else { return geometry; }
  }
}
