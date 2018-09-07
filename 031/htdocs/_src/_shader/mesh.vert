#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void) {

	gl_PointSize = 1.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

}
