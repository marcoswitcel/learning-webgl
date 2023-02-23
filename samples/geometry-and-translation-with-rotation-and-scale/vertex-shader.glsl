
// an attribute will receive data from a buffer
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

// todos os shaders tem um função 'main'
void main() {
  // gl_Position e a variável especial que o vertex shader deve definir
  // a expressão abaixo traduz a posição absoluta em pixels para o espaço de -1 e 1. 

  // Rotate the position
  vec2 rotatedPosition = vec2(
    a_position.x * u_rotation.y + a_position.y * u_rotation.x,
    a_position.y * u_rotation.y - a_position.x * u_rotation.x);

  // Add in the translation.
  vec2 position = rotatedPosition + u_translation;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clip space)
  vec2 clipSpace = zeroToTwo - 1.0;

  // no final ainda multiplica o clipspace por vec2(1, -1) para inverter o eixo Y
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
