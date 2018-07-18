precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying float vPositiony;
varying float vPositionz;

void main(){

  float py = vPositiony * 0.025 + 1.0;
  float pz = vPositionz + 1.0;

  // vec3 color = vec3(py, py, py);
  vec3 color = vec3(0.9);

  gl_FragColor = vec4(color, 1.0);
}
