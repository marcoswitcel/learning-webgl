// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

uniform vec4 u_color;
uniform float u_timestamp;

varying vec4 v_color;

void main() {
  // gl_FragColor is a special variable a fragment shader
  float percentage = mod(u_timestamp, 2000.0) / 2000.0;
  gl_FragColor = (u_color * (v_color * 1.1)) * (percentage * percentage) ;
}
