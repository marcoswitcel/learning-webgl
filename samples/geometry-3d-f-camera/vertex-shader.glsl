
// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

// todos os shaders tem um função 'main'
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  v_color = a_color;
}
