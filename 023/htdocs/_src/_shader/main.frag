// #ifdef GL_ES
// precision mediump float;
// #endif

precision mediump float;

uniform float uTrans;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uDisp;
varying vec2 vUv;
float quarticInOut(float t) {
  return t < 0.5
    ? +8.0 * pow(t, 4.0)
    : -8.0 * pow(t - 1.0, 4.0) + 1.0;
}

void main() {

  // https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/gl_FragCoord.xhtml

  vec4 disp = texture2D(uDisp, vec2(0., 0.5) + (vUv - vec2(0., 0.5)) * (0.2 + 0.8 * (1.0 - uTrans)) );
  float trans = clamp(1.6  * uTrans - disp.r * 0.4 - vUv.x * 0.2, 0.0, 1.0);
  trans = quarticInOut(trans);
  vec4 color0 = texture2D(uTexture0, vec2(0.5 - 0.3 * trans, 0.5) + (vUv - vec2(0.5)) * (1.0 - 0.2 * trans));
  vec4 color1 = texture2D(uTexture1, vec2(0.5 + sin( (1. - trans) * 0.1), 0.5 ) + (vUv - vec2(0.5)) * (0.9 + 0.1 * trans));
  gl_FragColor = mix(color0, color1 , trans);
}
