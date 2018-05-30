precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D texturePosition;
uniform float cameraConstant;
uniform float density;
varying vec2 vUv;
uniform float radius;

void main(void) {

  vec4 posTemp = texture2D(texturePosition, uv);
  vec3 pos = posTemp.xyz;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // ポイントのサイズを決定
  // gl_PointSize = 0.5 * cameraConstant / (- mvPosition.z);

  // uv情報の引き渡し
  vUv = uv;

  // 変換して格納
  gl_Position = projectionMatrix * mvPosition;
}
