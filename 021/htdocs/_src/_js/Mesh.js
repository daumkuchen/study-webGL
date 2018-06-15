const THREE = require('three/build/three.js');
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
    this.object = this.createObject();
  }
  createObject() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(64, 64, 128, 128),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: mainVert,
        fragmentShader: mainFrag,
        transparent: true,
        side: THREE.DoubleSide
        // wireframe: true,
      })
    );
  }
}
