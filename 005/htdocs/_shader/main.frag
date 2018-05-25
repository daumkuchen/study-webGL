precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

varying vec3 vPosition;

const float duration = 8.0;
const float delay = 4.0;

// 3D noise
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec3 x) {
	const vec3 step = vec3(110, 241, 171);
	vec3 i = floor(x);
	vec3 f = fract(x);
  float n = dot(i, step);
	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
  	mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
    mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
    mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

void main(){

  vec2 uv = gl_FragCoord.xy / resolution.xy;

  // float r = 0.5 + 0.5 * cos((time * 0.2) + uv.x);
  // float g = 0.5 + 0.5 * cos((time * 0.3) + uv.y);
  // float b = 0.5 + 0.5 * cos((time * 0.4) + uv.x);

  // float r = cos((time * 0.2) + uv.y) * 0.2;
  // float g = cos((time * 0.2) + uv.y) * 0.2;
  // float b = cos((time * 0.2) + uv.y) * 0.2;
  // vec3 color = vec3(r, g, b);
  // gl_FragColor = vec4(color, 1.0);

  // float now = clamp((time - delay) / duration, 0.0, 1.0);
  // float opacity = (1.0 - length(vPosition.xy / vec2(512.0))) * 0.6 * now;
  // vec3 v = normalize(vPosition);
  // vec3 rgb = sin(vec3(0.5 + (v.x + v.y + v.x) / 40.0 + time * 0.1, 0.4, 1.0));
  // gl_FragColor = vec4(rgb, opacity);

  // vec3 color = vec3(noise(vPosition.xyy)) * 1.1;
  // gl_FragColor = vec4(color, 1.0);

	gl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);
}
