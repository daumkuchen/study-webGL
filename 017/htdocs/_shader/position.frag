precision mediump float;

// uniform vec2 resolution;
// uniform vec2 mouse;
// uniform float time;
//
// uniform sampler2D texturePosition;
// uniform sampler2D textureVelocity;

// 現在の位置情報を決定する
#define delta (1.0 / 60.0)

void main(void) {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec3 pos = tmpPos.xyz;
  vec4 tmpVel = texture2D(textureVelocity, uv);

  // velが移動する方向(もう一つ下のcomputeShaderVelocityを参照)
  vec3 vel = tmpVel.xyz;

  // 移動する方向に速度を掛け合わせた数値を現在地に加える。
  pos += vel * delta;

  gl_FragColor = vec4(pos, 1.0);
}
