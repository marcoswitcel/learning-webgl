// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

// The texture.
uniform sampler2D u_texture;

// Passed in from the vertex shader.
varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord);
}
