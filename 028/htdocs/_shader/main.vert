// attribute vec3 position;
// attribute vec4 color;
// uniform float time;
// varying vec4 vColor;

// attribute vec3 position;
// attribute vec3 normal;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// attribute vec3 u_position;

varying vec4  vColor;
varying float fogFactor;
// varying vec3 vPosition;
// varying vec3 vNormal;
// varying vec3 vWorldPosition;

//=========================
//　　UTILS
//=========================

//=========================
//　　MAIN
//=========================

void main() {

  // float p = abs(rnd(vec2(normal.zz)) * sin(time * 0.2) * 0.8);
	vec3 uv = vec3(position);
       uv.x += 3.0 * smoothstep(
         sin(time * 0.5) + position.y * 0.8,
         sin(time * 0.5) + position.y * 0.8,
         position.y
       );

	// ===== FOG
	const float near = 0.1;
	const float far  = 50.0;
	const float linerDepth = 1.0 / (far - near);
	const vec4 lightDirection = vec4(0.0, 10.0, 0.0, 1.0);
	const vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
	const float fogStart = -10.0;
	const float fogEnd = 10.0;

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
