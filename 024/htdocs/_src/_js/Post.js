const THREE = require('three/build/three.js');
const vert = require('./../_shader/post.vert');
const frag = require('./../_shader/post.frag');

export default class Post {
  constructor(texture) {
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
      },
      texture: {
        type: 't',
        value: texture
      }
    };
    this.object = this.createObject(texture);
  }
  createObject() {
    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }
}
