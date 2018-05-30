const THREE = require('three/build/three.js');
const OBJLoader = require('three-obj-loader')(THREE);

export default class Mesh {
  constructor() {
    // this.object = this.createObject();
    this.object = null;
  }
  loadObject() {

    const loader = new THREE.OBJLoader();
    loader.load('../img/common/bunny.obj',(object) => {
      object.traverse(function(object) {
        if(object instanceof THREE.Mesh) {
          object.material = THREE.MeshPhongMaterial({
            color:0xffffff
          });
          this.object = object;
          this.flg = true;
        }
      });
    });

    // function(xhr) {
    //   console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    // },
    // function(error) {
    //   console.log('An error happened');
    // });
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
