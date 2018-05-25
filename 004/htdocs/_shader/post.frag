precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform sampler2D textureUnit;

varying vec2 vTexCoord;

float rnd(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
  float r = rnd(gl_FragCoord.st + mod(u_time, 1.0));
  vec4 samplerColor = texture2D(textureUnit, vTexCoord);
  gl_FragColor = vec4(samplerColor.rgb * r, samplerColor.a);
}
