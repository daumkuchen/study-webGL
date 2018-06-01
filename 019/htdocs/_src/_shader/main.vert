#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// attribute vec3 normal;
// uniform mat3 normalMatrix;
// varying vec3 vNormal;
// varying vec4 nMatrix;

void main(void) {

  // vNormal = normal;
  // nMatrix = normalMatrix;

  gl_Position = normalMatrix * projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
