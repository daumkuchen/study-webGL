precision mediump float;

// 移動方向についていろいろ計算できるシェーダー。
// 今回はなにもしてない。
// ここでVelのx y zについて情報を上書きすると、それに応じて移動方向が変わる
// #include <common>

// uniform vec2 resolution;
// uniform vec2 mouse;
// uniform float time;
//
// uniform sampler2D texturePosition;
// uniform sampler2D textureVelocity;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float idParticle = uv.y * resolution.x + uv.x;
  vec4 tmpVel = texture2D(textureVelocity, uv);
  vec3 vel = tmpVel.xyz;
  gl_FragColor = vec4(vel.xyz, 1.0);
}
