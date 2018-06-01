const THREE = require('three/build/three.js');
const OBJLoader = require('three-obj-loader')(THREE);

const mainVert = require('./../_shader/main.vert');
const mainFrag = require('./../_shader/main.frag');

export default class Mesh {
  constructor() {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      time: {
        type: 'f',
        value: 1.0
      }
    };
    this.object = null;
  }
  createObject() {

    // let phongShader = THREE.ShaderLib.phong;
    // let uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
    // uniforms.resolution = this.uniforms.resolution;
    // uniforms.mouse = this.uniforms.mouse;
    // uniforms.time = this.uniforms.resolution;

    const loader = new THREE.OBJLoader();
    const path = './img/common/man.obj';
    loader.load(path,(object) => {
      object.traverse((object) => {
        if(object instanceof THREE.Mesh) {
          // object.material = new THREE.MeshPhongMaterial({
          //   color: 0xffffff,
          //   side: THREE.DoubleSide,
          //   specular: 0x999999,
          //   shininess: 30
          // });
          // object.geometry = new THREE.BufferGeometry();
          object.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: mainVert,
            fragmentShader: mainFrag,
            transparent: true,

            // uniforms: uniforms,
            // vertexShader: phongShader.vertexShader,
            // fragmentShader: phongShader.fragmentShader,
            // vertexShader: mainVert,
            // fragmentShader: mainFrag,
            // lights: true
          });
        }
        object.position.y = -8.0;
        object.rotation.y = -Math.PI * 0.0;
      });
      this.object = object;
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
      console.log('An error happened');
    });

  }
}
