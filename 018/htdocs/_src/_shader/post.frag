precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D texture;
varying vec2 vUv;

// normal rad
float rnd(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {

  vec2 p = (gl_FragCoord.st / resolution) * 2.0 - 1.0;

  // vec2 ratio = vec2(
  //   min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),
  //   min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)
  // );

  // vec2 uv = vec2(
  //   vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
  //   vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  // );

  // 乗算?
  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);
  // gl_FragColor = texture2D(texture, uv) * color;

  // ===== color dest
  // vec4 destColor = texture2D(texture, uv);
  // vec4 R = texture2D(texture, uv + vec2( 0.01, 0.0));
  // vec4 G = texture2D(texture, uv + vec2( 0.00, 0.0));
  // vec4 B = texture2D(texture, uv + vec2(-0.01, 0.0));
  // gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);

  // ===== vignette
  vec4 samplerColor = texture2D(texture, vUv);
  float dest = (samplerColor.r + samplerColor.g + samplerColor.b);

  // float vignette = 1.0 - length(p) * 0.5;
  // dest *= vignette * 0.5 + 0.5;

  // ===== white noise
  // float noise = rnd(gl_FragCoord.st);
  // dest *= noise * 1.0 + 0.5;

  // gl_FragColor = samplerColor * vec4(vec3(dest), 1.0);

  // ===== default
  gl_FragColor = texture2D(texture, vUv);

}
