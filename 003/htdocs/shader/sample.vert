varying vec2 vUv;

void main() {
  //uv => テクスチャを貼るためのUV座標
  vUv = uv;
  //projectionMatrix => カメラの各種パラメータから３次元を２次元に射影し、クリップ座標系に変換する行列
  //modelViewMatrix => modelMatrix(オブジェクト座標からワールド座標へ変換する行列)とviewMatrix(ワールド座標から視点座標へ変換する行列)の積算
  //position => 頂点座標
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
