const THREE = require('three/build/three.js');
const postVert = require('./../_shader/post.vert');
const postFrag = require('./../_shader/post.frag');

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
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: postVert,
        fragmentShader: postFrag,
        transparent: true
      })
    );
  }
}
