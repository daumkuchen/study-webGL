#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// varying vec3 vNormal;
// varying vec4 nMatrix;
const vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));

void main(void) {

  // vec3 n = (nMatrix * vec4(vNormal, 0.0)).xyz;
  //
  // float diffuse = max(dot(n, lightDirection), 0.0);
  // float shade = 1.0;
  //
  // // 拡散光の強度を少ない階調に制限する @@@
  // if(diffuse < 0.1){
  //   shade = 0.5;
  // } else if(diffuse < 0.3) {
  //   shade = 0.7;
  // } else if(diffuse < 0.7) {
  //   shade = 0.9;
  // }
  //
  // vec2 color = vec3(1.0);

  // gl_FragColor = vec4(color * shade, 1.0);

  gl_FragColor = vec4(1.0);

  // vec2 p = gl_FragCoord.xy / resolution.xy;
  // vec3 color = 0.5 - 0.5 * cos(time + p.xyx + vec3(0, 2, 4));
	// gl_FragColor = vec4(color, 1.0);

}
