
// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec4 a_color;

uniform float u_fudgeFactor;
uniform mat4 u_matrix;

varying vec4 v_color;

// todos os shaders tem um função 'main'
void main() {
  // Multiply the position by the matrix.
  vec4 position = u_matrix * a_position;

  // Adjust the z to divide by
  float zToDivideBy = 1.0 + position.z * u_fudgeFactor;

  // Divide x and y by z.
  gl_Position = vec4(position.xyz, zToDivideBy);

  v_color = a_color;
}
