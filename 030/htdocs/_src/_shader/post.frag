#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D texture;
varying vec2 vUv;

varying float vR;
varying float vG;
varying float vB;

void main(void) {
  vec4 samplerColor = texture2D(texture, vUv);
  vec3 color = vec3(vR, vG, vB);
  gl_FragColor = samplerColor * vec4(color, 1.0);
}
