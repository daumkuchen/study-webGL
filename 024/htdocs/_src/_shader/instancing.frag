precision highp float;

uniform float time;
varying vec3 vPosition;
varying vec4 vColor;

float rnd(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
  vec4 color = vec4(vColor);
  // color.r += sin(vPosition.z * 4.0 + time) * 1.0;
  gl_FragColor = color * vec4(1.0 + vec3(rnd(vPosition.xy) * 2.0), 1.0);
}
