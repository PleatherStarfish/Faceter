# fractal_geometry_from_face_centroids
This is a small test of a fractal noise algorithm in Three.js. The idea here is that for each face in a specific geometry, we find the centroid of that face and then replace that face with three new faces with each vertex being displaced by a small pseudo-random offset. For any input geometry, the function can be applied recursively an arbitrary number of times. However, the number of vertices in the geometry is cubed with each application of the function, so rendering time quickly becomes impractical. However, dramatic and interesting results can be achieved with just a few recursions.

![rock.gif](rock.gif)
