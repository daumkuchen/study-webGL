#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D texture;
varying vec2 vUv;

float rnd(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main(void) {

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  vec4 samplerColor = texture2D(texture, vUv);
  vec3 color = vec3(1.0);
       color.r = 0.0;

  // gl_FragColor = samplerColor * vec4(vec3(color), 1.0);
	gl_FragColor = samplerColor;
}
