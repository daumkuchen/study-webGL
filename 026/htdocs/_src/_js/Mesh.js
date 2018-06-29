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

    const num = 500000;

    const geometry = new THREE.BufferGeometry();

    let positions = [];
    let feedbackPosition = [];

    // function create_vbo(data){
    //   var vbo = gl.createBuffer();
    //   gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    //   gl.bindBuffer(gl.ARRAY_BUFFER, null);
    //   return vbo;
    // }
    //
    // function create_vbo_feedback(data){
    //   var vbo = gl.createBuffer();
    //   gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_COPY);
    //   gl.bindBuffer(gl.ARRAY_BUFFER, null);
    //   return vbo;
    // }
    //
    // let transformOutVBO = [
    //   create_vbo(positions)
    // ];
    //
    // let feedbackInVBO = [
    //   create_vbo_feedback(feedbackPosition)
    // ];
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

    // 法線の生成
    // function faceNormal(v0, v1, v2){
    //   var n = new Array();
    //   var vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
    //   var vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
    //   n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
    //   n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
    //   n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
    //   return n;
    // }

    // 頂点座標、インデックスを送る
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // geometry.addAttribute('index', new THREE.BufferAttribute(indices,  1));
    // geometry.addAttribute('normal', new THREE.BufferAttribute(normals,  1));

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
