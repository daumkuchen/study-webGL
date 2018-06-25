// #ifdef GL_ES
// precision mediump float;
// #endif

precision mediump float;

attribute vec4 position;
varying vec2 vUv;

void main() {
  gl_Position = position;
  vUv = vec2( (position.x + 1.)/2., (-position.y + 1.)/2.);
}
