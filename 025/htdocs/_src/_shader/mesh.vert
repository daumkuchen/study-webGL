precision highp float;

uniform float time;
uniform vec2 resolution;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;

varying vec3 vPosition;

void main(){
  vPosition = position;

  float px = position.x;
  float py = position.y;
  float pz = position.z;
  vec3 p = vec3(px, py, pz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

  float z = abs(position.z + 1.0) * 10.0;
  gl_PointSize = z;
}
