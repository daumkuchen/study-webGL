const THREE = require('three/build/three.js');
const vert = require('./../_shader/mesh.vert');
const frag = require('./../_shader/mesh.frag');

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
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0, -1.0,  1.0
    ]);
    geometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, 3)
    );
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      side: THREE.DoubleSide
    });
    return new THREE.Mesh(geometry, material);
  }
}
