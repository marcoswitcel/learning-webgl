
// an attribute will receive data from a buffer
attribute vec2 a_position;

uniform mat3 u_matrix;

// todos os shaders tem um função 'main'
void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
