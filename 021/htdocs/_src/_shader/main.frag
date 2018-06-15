#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying float vPos;

void main(void) {

  float r = vPos * cos(time * 0.2);
  float g = vPos * cos(time * 0.4);
  float b = vPos * cos(time * 0.7);

  vec3 color = vec3(r, g, b);
  gl_FragColor = vec4(color, 1.0);

  // vec2 p = gl_FragCoord.xy / resolution.xy;
  // vec3 color = 0.5 - 0.5 * cos(time + p.xyx + vec3(0, 2, 4));
	// gl_FragColor = vec4(color, 1.0);

}
