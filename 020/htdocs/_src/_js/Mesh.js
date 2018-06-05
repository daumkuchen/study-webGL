const THREE = require('three/build/three.js');
const SVGLoader = require('./SVGLoader.js')(THREE);

export default class Mesh {
  constructor() {
    this.object = null;
  }
  createObject() {

    const loader = new THREE.SVGLoader();
    const path = './img/logo.svg';
    loader.load(path,(object) => {

      let group = new THREE.Group();
			group.scale.multiplyScalar(0.005);
			group.scale.y *= -1;

			for (let i = 0; i < object.length; i ++) {
				let svgpath = object[i];
				let material = new THREE.MeshBasicMaterial( {
					color: svgpath.color,
					side: THREE.DoubleSide,
					depthWrite: false
				});
				let shapes = svgpath.toShapes(false);
				for (let j = 0; j < shapes.length; j ++) {
					let shape = shapes[j];
					let geometry = new THREE.ShapeBufferGeometry(shape);
					let mesh = new THREE.Mesh(geometry, material);
					group.add(mesh);
          mesh.position.x -= 600.0;
          mesh.position.y -= 217.0;
				}
			}
			// this.scene.add(group);
      this.object = group;
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
      console.log('An error happened');
    });

  }
}
