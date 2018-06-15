#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying float vPos;

void main(void) {

  float px = position.x;
  float py = position.y;
  float pz = position.z + cos(float(position.xy + (time * 2.0)));

  vPos = pz * 2.0;

  vec3 p = vec3(px, py, pz);
  gl_Position =  projectionMatrix * modelViewMatrix * vec4(p, 1.0);

}
