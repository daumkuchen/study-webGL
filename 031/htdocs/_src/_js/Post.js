import * as THREE from 'three';

import vert from './../_shader/post.vert';
import frag from './../_shader/post.frag';

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
      },
      colorR: {
        type: 'f',
        value: 1.0
      },
      colorG: {
        type: 'f',
        value: 1.0
      },
      colorB: {
        type: 'f',
        value: 1.0
      }
    };
    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }
  setup() {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}
