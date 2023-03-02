
// an attribute will receive data from a buffer
attribute vec4 a_position;

uniform mat4 u_matrix;

// todos os shaders tem um função 'main'
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
}
