precision mediump float;

// 移動方向についていろいろ計算できるシェーダー。
// 今回はなにもしてない。
// ここでVelのx y zについて情報を上書きすると、それに応じて移動方向が変わる
// #include <common>

// uniform vec2 resolution;
// uniform vec2 mouse;
uniform float time;
//
// uniform sampler2D texturePosition;
// uniform sampler2D textureVelocity;

void main(void) {

  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 tmpVel = texture2D(textureVelocity, uv);
  // float idParticle = uv.y * resolution.x + uv.x;

  // default
  // vec3 vel = tmpVel.xyz;
  // gl_FragColor = vec4(vel.xyz, 1.0);

  // using glsl
  float posX = tmpVel.x;
  float posY = tmpVel.y;
  float posZ = tmpVel.z;
  vec3 pos = vec3(posX, posY, posZ);
  gl_FragColor = vec4(pos, 1.0);

}
