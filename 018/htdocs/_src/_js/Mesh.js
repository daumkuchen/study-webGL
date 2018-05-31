const THREE = require('three/build/three.js');
const OBJLoader = require('three-obj-loader')(THREE);

export default class Mesh {
  constructor() {
    this.object = null;
  }
  createObject(cubeTexture) {

    const loader = new THREE.OBJLoader();
    const path = './img/common/bunny.obj';
    loader.load(path, (object) => {
      object.traverse((object) => {
        if(object instanceof THREE.Mesh) {
          object.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            specular: 0x999999,
            shininess: 30,
            envMap: cubeTexture,
            refractionRatio: 0.98,
            reflectivity: 1
          });
        }
        object.position.y = -0.5;
        object.rotation.y = -Math.PI * 0.9;
      });
      // this.scene.add(object);
      this.object = object;
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
      console.log('An error happened');
    });
  }

  // createObject() {
  //
  //   return new THREE.Mesh(
  //     // new THREE.SphereGeometry(2.0, 128.0, 128.0),
  //     this.geometry,
  //     new THREE.MeshPhongMaterial({
  //       color:0xffffff,
  //     	specular: 0x999999,
  //     	shininess: 30
  //     })
  //   );
  //
  // }

}
