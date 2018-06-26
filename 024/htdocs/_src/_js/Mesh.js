const THREE = require('three/build/three.js');
const vert = require('./../_shader/instancing.vert');
const frag = require('./../_shader/instancing.frag');

export default class Mesh {
  constructor() {
    this.uniforms = {
      sineTime: {
        type: 'f',
        value: 1.0
      },
      time: {
        type: 'f',
        value: 1.0
      }
    };
    this.object = this.createObject();
  }
  createObject() {

    let vector = new THREE.Vector4();
    let triangles = 1;
    let instances = 50000;
    let positions = [];
    let offsets = [];
    let colors = [];
    let orientationsStart = [];
    let orientationsEnd = [];

    // triangle
    positions.push( 0.02, -0.02, 0.0);
    positions.push(-0.02,  0.02, 0.0);
    positions.push( 0.02,  0.02, 0.0);

    // quad
    // positions.push( 0.02, -0.02, 0.0);
    // positions.push(-0.02,  0.02, 0.0);
    // positions.push( 0.02,  0.02, 0.0);
    // positions.push(-0.02,  0.02, 0.0);
    // positions.push( 0.02, -0.02, 0.0);
    // positions.push(-0.02, -0.02, 0.0);

    // instanced attributes
    for (var i = 0; i < instances; i ++) {

      // offsets
      offsets.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

      // colors
      colors.push(Math.random(), Math.random(), Math.random(), Math.random());

      // vector
      vector.set(
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0
      );
      vector.normalize();

      // rotation
      orientationsStart.push(vector.x, vector.y, vector.z, vector.w);
      vector.set(
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0
      );
      vector.normalize();
      orientationsEnd.push(vector.x, vector.y, vector.z, vector.w);

    }

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.maxInstancedCount = instances;
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
    geometry.addAttribute('color', new THREE.InstancedBufferAttribute(new Float32Array(colors), 4));
    geometry.addAttribute('orientationStart', new THREE.InstancedBufferAttribute(new Float32Array(orientationsStart), 4));
    geometry.addAttribute('orientationEnd', new THREE.InstancedBufferAttribute(new Float32Array(orientationsEnd), 4));

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      side: THREE.DoubleSide,
      transparent: true
    });

    return new THREE.Mesh(geometry, material);

  }
}
