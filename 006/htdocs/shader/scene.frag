precision mediump float;
uniform vec2  resolution;
uniform vec2  mouse;
// uniform float time;
uniform sampler2D backbuffer;
uniform vec4 globalColor;
// varying vec4 vColor;

// uniform float audio1;
// uniform float audio2;

//---------------------------------------------------------
// UTILS
//---------------------------------------------------------

//---------------------------------------------------------
// MAIN
//---------------------------------------------------------

void main(){
  // gl_FragColor = vColor * globalColor;
  gl_FragColor = vec4(255, 255, 255, 255);
}
