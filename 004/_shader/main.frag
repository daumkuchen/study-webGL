precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){

  // vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  // vec3 color = vec3(sin(time * 2.0), 0.0, cos(time * 2.0));
  vec3 color = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0, 2, 4));

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(vec3(1.0, 0.0, 1.0), 1.0);

}
