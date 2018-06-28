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

  float sx = sin(float(position.yz) * time * 20.0) * 0.005;
  float sy = sin(float(position.xz) * time * 20.0) * 0.005;
  float sz = sin(float(position.xy) * time * 20.0) * 0.005;

  vec3 p = vec3(px + sx, py + sy, pz + sz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

  // z.position
  // float z = abs(position.z + 1.0) * 10.0;
  // gl_PointSize = z;

  // default
  gl_PointSize = 10.0;
}
