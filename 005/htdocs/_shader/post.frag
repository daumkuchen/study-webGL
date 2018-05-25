precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D uTex;
varying vec2 vUv;

// normal rad
float rnd(vec2 n){
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {

  // vec2 ratio = vec2(
  //   min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
  //   min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
  // );

  vec2 ratio = vec2(
    min((resolution.x / resolution.y) / (resolution.x / resolution.y), 1.0),
    min((resolution.y / resolution.x) / (resolution.y / resolution.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // vec4 color = vec4(1.0, 0.0, 1.0, 1.0);
  // gl_FragColor = texture2D(uTex, uv) * color;

  // ===== nomal rnd
  // float r = rnd(gl_FragCoord.st + mod(time, 1.0));
  // vec4 samplerColor = texture2D(uTex, uv);
  // gl_FragColor = vec4(samplerColor.rgb * r, 1.0);

  // ===== color dest
  vec4 destColor = texture2D(uTex, uv);
  // vec4 R = texture2D(uTex, uv + vec2( 0.002 * sin(mouse.x * 10.0), 0.0));
  // vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(mouse.x * 10.0), 0.0));
  // vec4 B = texture2D(uTex, uv + vec2(-0.002 * sin(mouse.x * 10.0), 0.0));
  vec4 R = texture2D(uTex, uv + vec2( 0.01 * sin(floor(mouse.x)), 0.0));
  vec4 G = texture2D(uTex, uv + vec2( 0.00  * cos(floor(mouse.x)), 0.0));
  vec4 B = texture2D(uTex, uv + vec2(-0.01 * sin(floor(mouse.x)), 0.0));
  gl_FragColor = vec4(vec3(R.r, G.g, B.b), 1.0);

  // gl_FragColor = texture2D(uTex, uv);

  // ===== tv noise

}
