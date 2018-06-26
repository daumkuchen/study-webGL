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
      time: {
        type: 'f',
        value: 1.0
      }
    };
    this.object = this.createObject();
  }
  createObject() {

    const num = 5000;

    const geometry = new THREE.BufferGeometry();

    // 頂点座標の生成
    let positions = [];
        // positions.push(-1.0, -1.0, 0.0);
        // positions.push( 1.0, -1.0, 0.0);
        // positions.push( 1.0,  1.0, 0.0);
        // positions.push(-1.0,  1.0, 0.0);

    for (var i = 0; i < num; i++) {
      positions.push(
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0
      );
    }

    // 頂点データの生成
    // let vertices = new Float32Array(positions.length * 3);
    // for (var i = 0; i < positions.length; i++) {
    //   vertices[i * 3 + 0] = positions[i][0];
    //   vertices[i * 3 + 1] = positions[i][1];
    //   vertices[i * 3 + 2] = positions[i][2];
    // }

    // インデックスの生成
    // let indices = new Uint16Array([
    //   0, 1, 2,
    //   2, 3, 0
    // ]);

    // 頂点座標、インデックスを送る
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    // geometry.addAttribute('index', new THREE.BufferAttribute(indices,  1));

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      side: THREE.DoubleSide,
      transparent: true
    });

    return new THREE.Points(geometry, material);

  }
}
