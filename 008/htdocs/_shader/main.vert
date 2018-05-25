// attribute vec3 position;
// attribute vec4 color;
// uniform float time;
// varying vec4 vColor;

attribute vec3 m_position;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// attribute vec3 u_position;

varying   vec4  vColor;
varying   float fogFactor;
// varying vec3 vPosition;
// varying vec3 vNormal;
// varying vec3 vWorldPosition;

//=========================
//　　UTILS
//=========================

// normal random
float rnd(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

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

// ===== PROCESSING NOISE
vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float noise(vec3 P) {
	vec3 Pi0 = floor(P),
		Pi1 = Pi0 + vec3(1.0);

	Pi0 = mod289(Pi0);
	Pi1 = mod289(Pi1);

	vec3 Pf0 = fract(P),
		Pf1 = Pf0 - vec3(1.0);

	vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x),
		iy = vec4(Pi0.yy, Pi1.yy),
		iz0 = Pi0.zzzz,
		iz1 = Pi1.zzzz,
		ixy = permute(permute(ix) + iy),
		ixy0 = permute(ixy + iz0),
		ixy1 = permute(ixy + iz1),
		gx0 = ixy0 * (1.0 / 7.0),
		gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;

	gx0 = fract(gx0);

	vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0),
		sz0 = step(gz0, vec4(0.0));

	gx0 -= sz0 * (step(0.0, gx0) - 0.5);
	gy0 -= sz0 * (step(0.0, gy0) - 0.5);

	vec4 gx1 = ixy1 * (1.0 / 7.0),
		gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;

	gx1 = fract(gx1);

	vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1),
		sz1 = step(gz1, vec4(0.0));

	gx1 -= sz1 * (step(0.0, gx1) - 0.5);
	gy1 -= sz1 * (step(0.0, gy1) - 0.5);

	vec3 g000 = vec3(gx0.x, gy0.x, gz0.x),
		g100 = vec3(gx0.y, gy0.y, gz0.y),
		g010 = vec3(gx0.z, gy0.z, gz0.z),
		g110 = vec3(gx0.w, gy0.w, gz0.w),
		g001 = vec3(gx1.x, gy1.x, gz1.x),
		g101 = vec3(gx1.y, gy1.y, gz1.y),
		g011 = vec3(gx1.z, gy1.z, gz1.z),
		g111 = vec3(gx1.w, gy1.w, gz1.w);

	vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
	g000 *= norm0.x;
	g010 *= norm0.y;
	g100 *= norm0.z;
	g110 *= norm0.w;

	vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
	g001 *= norm1.x;
	g011 *= norm1.y;
	g101 *= norm1.z;
	g111 *= norm1.w;

	float n000 = dot(g000, Pf0),
		n100 = dot(g100, vec3(Pf1.x, Pf0.yz)),
		n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z)),
		n110 = dot(g110, vec3(Pf1.xy, Pf0.z)),
		n001 = dot(g001, vec3(Pf0.xy, Pf1.z)),
		n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z)),
		n011 = dot(g011, vec3(Pf0.x, Pf1.yz)),
		n111 = dot(g111, Pf1);

	vec3 fade_xyz = fade(Pf0);
	vec4 n_z = mix(vec4(n000, n100, n010, n110),
		vec4(n001, n101, n011, n111), fade_xyz.z);
	vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);

	return mix(n_yz.x, n_yz.y, fade_xyz.x);
}

//=========================
//　　MAIN
//=========================

void main() {

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

	// ===== CLASSIC PERLIN NOISE 2D
	// 布っぽく伸び縮みする
	// float p = perlin(position.xy * 0.01 * dot((sin(time * 0.2) - cos(time * 0.2)) * 3.0, 0.1), 2.0, 1.0) * 50.0;

	float p = perlin(position.xy * 0.02, 1.0, 1.0) * 50.0;

	vec3 uv = vec3(position.x, position.y, position.z + p);
  // float p = perlin(vec2(rnd(position.xy) * 0.1), 1.0, 1.0) * 200.0;
  // vec3 uv = vec3(position.x, position.y, position.z + p);

	// ===== PROCESSING NOISE
	// float n = noise(vec3(position.x * 100.0, position.y * 100.0, 1.0));
	// vec3 uv = vec3(position.x, position.y, position.z + n);
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);

	// ===== FOG
	const float near = 0.1;
	const float far  = 30.0;
	const float linerDepth = 1.0 / (far - near);
	const vec4 lightDirection = vec4(0.0, 10.0, 0.0, 1.0);
	const vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
	// const float fogStart = 0.001;
	const float fogStart = -10.0;
	const float fogEnd = 25.0;
	// const float fogEnd = 15.0;

	vec3 invLight = normalize(viewMatrix * lightDirection).xyz;
	vec3 invEye = normalize(viewMatrix * vec4(cameraPosition, 0.0)).xyz;
	vec3 halfLE = normalize(invLight + invEye);
	float diffuse = clamp(dot(normal, invLight), 0.1, 1.0);
	float specular = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 50.0);
	vec4 amb = color * color;
	vColor = amb * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);

	vec3 pos = (modelMatrix * vec4(position, 1.0)).xyz;
	float linerPos = length(cameraPosition - pos) * linerDepth;
	fogFactor = clamp((fogEnd - linerPos) / (fogEnd - fogStart), 0.0, 1.0);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(uv, 1.0);

	// vPosition = position;
  // gl_PointSize = 1.0;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
