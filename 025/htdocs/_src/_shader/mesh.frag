precision highp float;

uniform float time;

varying vec3 vPosition;

void main() {

	float f = length(gl_PointCoord - vec2(0.5, 0.5));
	if (f > 0.5) {
		discard;
	}

	// vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	// float p = float(-vPosition.z);
  // vec4 color = vec4(vec3(1.0, p, 1.0), 1.0);

	// vec4 color = vec4(vec3(1.0 - vPosition), 1.0);

	vec4 color = vec4(vec3(1.0), 1.0);

	gl_FragColor = color;

	if(vPosition.z < 0.5) {
		// discard;
		gl_FragColor = vec4(vec3(0.75, 0.75, 0.78), 1.0);
	} else {
		gl_FragColor = color;
	}

}
