#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;

uniform float colorR;
uniform float colorG;
uniform float colorB;
varying float vR;
varying float vG;
varying float vB;

void main(void) {
  vUv = uv;
  vR = colorR;
  vG = colorG;
  vB = colorB;
  gl_Position = vec4(position, 1.0);
}
