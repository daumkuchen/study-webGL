precision mediump float;
varying vec2 vUv;

void main(){
  // テクスチャ座標をカラーに出力
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
