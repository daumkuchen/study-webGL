// attribute vec3 position;
// attribute vec4 color;
// uniform float time;
// varying vec4 vColor;

attribute vec3 m_position;

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
// float rand(vec2 st) {
//   return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
// }

// ===== LINEAR NOISE
// float random (in vec2 st) {
//   return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
// }
//
// float noise(vec2 st) {
//   vec2 i = floor(st);
//   vec2 f = fract(st);
//   vec2 u = f*f*(3.0-2.0*f);
//   return mix( mix( random( i + vec2(0.0,0.0) ),
//                    random( i + vec2(1.0,0.0) ), u.x),
//               mix( random( i + vec2(0.0,1.0) ),
//                    random( i + vec2(1.0,1.0) ), u.x), u.y);
// }
//
// mat2 rotate2d(float angle){
//   return mat2(cos(angle),-sin(angle), sin(angle),cos(angle));
// }
//
// float lines(in vec2 pos, float b){
//   float scale = 10.0;
//   pos *= scale;
//   return smoothstep(0.0,.5+b*.5,abs((sin(pos.x*3.1415)+b*2.0))*.5);
// }

// ===== CLASSIC PERLIN NOISE 2D
#define M_PI 3.14159265358979323846

float rand (vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}
float rand (vec2 co, float l) {return rand(vec2(rand(co), l));}
float rand (vec2 co, float l, float t) {return rand(vec2(rand(co, l), t));}

float perlin(vec2 p, float dim, float time) {
	vec2 pos = floor(p * dim);
	vec2 posx = pos + vec2(1.0, 0.0);
	vec2 posy = pos + vec2(0.0, 1.0);
	vec2 posxy = pos + vec2(1.0);
	float c = rand(pos, dim, time);
	float cx = rand(posx, dim, time);
	float cy = rand(posy, dim, time);
	float cxy = rand(posxy, dim, time);
	vec2 d = fract(p * dim);
	d = -0.5 * cos(d * M_PI) + 0.5;
	float ccx = mix(c, cx, d.x);
	float cycxy = mix(cy, cxy, d.x);
	float center = mix(ccx, cycxy, d.y);
	return center * 2.0 - 1.0;
}

//
// // p must be normalized!
// float perlin(vec2 p, float dim) {
// 	/*vec2 pos = floor(p * dim);
// 	vec2 posx = pos + vec2(1.0, 0.0);
// 	vec2 posy = pos + vec2(0.0, 1.0);
// 	vec2 posxy = pos + vec2(1.0);
// 	// For exclusively black/white noise
// 	/*float c = step(rand(pos, dim), 0.5);
// 	float cx = step(rand(posx, dim), 0.5);
// 	float cy = step(rand(posy, dim), 0.5);
// 	float cxy = step(rand(posxy, dim), 0.5);*/
// 	/*float c = rand(pos, dim);
// 	float cx = rand(posx, dim);
// 	float cy = rand(posy, dim);
// 	float cxy = rand(posxy, dim);
// 	vec2 d = fract(p * dim);
// 	d = -0.5 * cos(d * M_PI) + 0.5;
// 	float ccx = mix(c, cx, d.x);
// 	float cycxy = mix(cy, cxy, d.x);
// 	float center = mix(ccx, cycxy, d.y);
// 	return center * 2.0 - 1.0;*/
// 	return perlin(p, dim, 0.0);
// }

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

  // float c1 = sin(cnoise(vec2(rand(position.xy) * 5.0)) * (time * 1.0)) * 5.0;
  // float c2 = cos(cnoise(vec2(rand(position.yx) * 5.0)) * (time * 1.0)) * 5.0;

  // ===== LINEAR NOISE
  // vec2 st = position.xy/resolution.xy;
  // st.y *= resolution.y/resolution.x;
  // vec2 pos = st.yx*vec2(10.,3.);
  // float pattern1 = pos.x;
  // float pattern2 = pos.y;
  // pos = rotate2d(noise(pos)) * pos;
  // pattern1 = lines(pos,.5) * 1.0;
  // pattern2 = lines(pos,.5) * 2.0;
  // vec3 uv = vec3(position.x, position.y, position.z + (pattern1 + pattern2) * 10.0);
  // vPosition = position;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);

  // ===== CLASSIC PERLIN NOISE
  // float c1 = float(cnoise(position.xy)) * 10.0;
  // vec3 uv = vec3(position.x, position.y, position.z + c1);
  // vPosition = position;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);

  //
  float c1 = perlin(position.xy * 0.006, 6.0, 1.0) * 25.0;
  float c2 = perlin(position.xy * 0.006, 6.0, 1.0) * 5.0;
  vec3 uv = vec3(position.x, position.y, position.z + (c1 * c2));
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);
  gl_PointSize = 1.0;

  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
