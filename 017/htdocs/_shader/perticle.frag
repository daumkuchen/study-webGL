precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(void) {

  // 丸い形に色をぬるための計算
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if (f > 0.1) {
    discard;
  }

  // gradient
  // vec2 uv = gl_FragCoord.xy / resolution.xy;
  // vec3 color = 0.5 + 0.5 * cos((time * 1.0) + uv.xyx + vec3(0.0, 2.0, 4.0));
  // gl_FragColor = vec4(color, 1.0);

  // white
  vec3 color = vec3(1.0, 1.0, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
