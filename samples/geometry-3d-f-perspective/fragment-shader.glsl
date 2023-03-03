// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  // gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
  gl_FragColor = v_color;
}
