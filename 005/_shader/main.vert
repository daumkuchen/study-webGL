// attribute vec3 position;
// attribute vec4 color;
// uniform float time;
// varying vec4 vColor;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// attribute vec3 u_position;

varying vec3 vPosition;

// varying vec3 vNormal;
// varying vec3 vWorldPosition;

//=========================
//　　UTILS
//=========================

// normal random
float rand(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D perlin noise
vec4 permute(vec4 x){
  return mod(((x*34.0)+1.0)*x, 289.0);
}

vec4 taylorInvSqrt(vec4 r){
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P){

  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);

  Pi = mod(Pi, 289.0);

  // vec4 ix = Pi.xzxz;
  // vec4 iy = Pi.yyww;
  // vec4 fx = Pf.xzxz;
  // vec4 fy = Pf.yyww;
  vec4 ix = Pi.xyxy;
  vec4 iy = Pi.zzww;
  vec4 fx = Pf.xyxy;
  vec4 fy = Pf.zzww;

  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  // vec2 g00 = vec2(gx.x,gy.x);
  // vec2 g10 = vec2(gx.y,gy.y);
  // vec2 g01 = vec2(gx.z,gy.z);
  // vec2 g11 = vec2(gx.w,gy.w);
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.z,gy.z);
  vec2 g01 = vec2(gx.y,gy.y);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));

  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);

  return 2.3 * n_xy;
}

//=========================
//　　MAIN
//=========================

void main() {

  // float sin1 = sin((position.x + position.y) * 0.2 + time * 0.5);
  // float sin2 = sin((position.x - position.y) * 0.4 + time * 2.0);
  // float sin3 = sin((position.x + position.y) * -0.6 + time);
  // vec3 uv = vec3(position.x, position.y, position.z + sin1 * 50.0 + sin2 * 10.0 + sin3 * 8.0);
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);

  // float s = float(rand(position.xy)) * sin(time * 4.0) * 10.0;
  // float s = float(sin((cnoise(position.xy) * 10.0) * (time * 0.05))) * 10.0;
  // vec3 uv = vec3(position.x, position.y, s);

  // float s1 = float(rand(position.xy)) * sin(0.5) * 30.0;
  // float s2 = float(rand(position.xy)) * sin(2.0) * 30.0;
  // float s3 = float(rand(position.xy)) * sin(1.0) * 30.0;

  // 仮パーリン
  // float c1 = float(cnoise(vec2(rand(position.xy)))) * 100.0;
  // float c2 = float(cnoise(vec2(rand(position.yx)))) * 100.0;

  // float c1 = float(cnoise(position.xy * sin(time * 0.0001))) * 20.0;
  // float c2 = float(cnoise(position.yx * sin(time * 0.0001))) * 10.0;
  // float c1 = mod((time * 0.05) * cnoise(vec2(rand(position.xy))), 1.0) * 40.0;
  // float c2 = mod((time * 0.05) * cnoise(vec2(rand(position.yx))), 1.0) * 40.0;

  // float c1 = cnoise(vec2(rand(position.xy))) * 128.0;
  // float c2 = cnoise(vec2(rand(position.yx))) * 128.0;

  float c1 = sin(cnoise(vec2(rand(position.xy) * 5.0)) * (time * 1.0)) * 5.0;
  float c2 = cos(cnoise(vec2(rand(position.yx) * 5.0)) * (time * 1.0)) * 5.0;

  // float s1 = float(cnoise(position.xx)) * sin(0.5) * 30.0;
  // float s2 = float(cnoise(position.yy)) * sin(2.0) * 30.0;
  // float s3 = float(cnoise(position.xy)) * sin(1.0) * 30.0;

  vec3 uv = vec3(position.x, position.y, c1 + c2);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);

  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
