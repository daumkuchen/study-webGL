precision mediump float;

// uniform vec2 resolution;
// uniform vec2 mouse;
// uniform float time;

void main(void) {
  // 丸い形に色をぬるための計算
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if (f > 0.1) {
    discard;
  }
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
