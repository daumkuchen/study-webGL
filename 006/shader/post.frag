precision mediump float;
uniform sampler2D texture;
uniform float time;
uniform vec2 resolution;
varying vec2 vTexCoord;

uniform float audio1;
uniform float audio2;

//---------------------------------------------------------
// UTILS
//---------------------------------------------------------

const vec4 monoColor = vec4(1.0, 1.0, 1.0, 1.0);

float rnd(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

//---------------------------------------------------------
// MAIN
//---------------------------------------------------------

void main(){

  vec2 p = (gl_FragCoord.st / resolution) * 2.0 - 1.0;

  vec4 samplerColor = texture2D(texture, vTexCoord);

  float dest = (samplerColor.r + samplerColor.g + samplerColor.b) * 1.0;

  float vignette = 1.5 - length(p) * 1.0 * (audio1) * 1.5;
  dest *= vignette;

  float noise = rnd(gl_FragCoord.st + mod(time, 10.0)) * 2.0 * (audio1) * 1.5;
  dest *= noise * 0.5 + 0.5;

  // float scanLine = abs(sin(p.y * 200.0 + time * 5.0)) * (audio1);
  // dest *= scanLine;

  // vec4 R = texture2D(texture, vTexCoord + vec2(0.1, 0.0)) * audio1 * 1.0;
  // vec4 G = texture2D(texture, vTexCoord + vec2(0.0, 0.0)) * audio1 * 1.0;
  // vec4 B = texture2D(texture, vTexCoord + vec2(-0.1, 0.0)) * audio1 * 1.0;
  // gl_FragColor = samplerColor * vec4(vec3(dest * (R.r * audio1), dest * (G.g * audio1), dest * (B.b * audio1)), 1.0);

  gl_FragColor = samplerColor * vec4(vec3(dest), 1.0);

}
