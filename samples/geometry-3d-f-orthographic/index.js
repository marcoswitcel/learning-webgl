import { createProgram, createShader } from './gl-utils.js';
import { createCanvas, degToRad, fetchTex, Mat4 } from './utils.js';

const canvas = createCanvas(600, 500, document.body);

const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL não suportado nesse navegador');
  throw new Error('WebGL não suportado nesse navegador');
}

const main = (vertexShaderSource, fragmentShaderSource) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  const program = createProgram(gl, vertexShader, fragmentShader);

  const translation = [45, 150, 0];
  const rotation = [degToRad(40), degToRad(25), degToRad(325)];
  const scale = [1, 1, 1];
  const width = 100;
  const height = 30;
  const color = [Math.random(), Math.random(), Math.random(), 1];
  
  // Compute the matrix
  let matrix = Mat4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
  matrix = Mat4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = Mat4.xRotate(matrix, rotation[0]);
  matrix = Mat4.yRotate(matrix, rotation[1]);
  matrix = Mat4.zRotate(matrix, rotation[2]);
  matrix = Mat4.scale(matrix, scale[0], scale[1], scale[2]);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Put geometry data into buffer
  setGeometry(gl);

  // Faze de renderização
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Limpa o canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  

  // Seta o nosso programa para execução
  gl.useProgram(program);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Setup a rectangle
  //setRectangle(gl, translation[0], translation[1], width, height);
 
  // Configura o atributo para saber como extrair dados do buffer array
  const size = 3;          // 3 components per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  {
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }
};

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]),
    gl.STATIC_DRAW);
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column front
      0,   0,  0,
      30,   0,  0,
      0, 150,  0,
      0, 150,  0,
      30,   0,  0,
      30, 150,  0,

      // top rung front
      30,   0,  0,
      100,   0,  0,
      30,  30,  0,
      30,  30,  0,
      100,   0,  0,
      100,  30,  0,

      // middle rung front
      30,  60,  0,
      67,  60,  0,
      30,  90,  0,
      30,  90,  0,
      67,  60,  0,
      67,  90,  0,

      // left column back
      0,   0,  30,
      30,   0,  30,
      0, 150,  30,
      0, 150,  30,
      30,   0,  30,
      30, 150,  30,

      // top rung back
      30,   0,  30,
      100,   0,  30,
      30,  30,  30,
      30,  30,  30,
      100,   0,  30,
      100,  30,  30,

      // middle rung back
      30,  60,  30,
      67,  60,  30,
      30,  90,  30,
      30,  90,  30,
      67,  60,  30,
      67,  90,  30,

      // top
      0,   0,   0,
      100,   0,   0,
      100,   0,  30,
      0,   0,   0,
      100,   0,  30,
      0,   0,  30,

      // top rung right
      100,   0,   0,
      100,  30,   0,
      100,  30,  30,
      100,   0,   0,
      100,  30,  30,
      100,   0,  30,

      // under top rung
      30,   30,   0,
      30,   30,  30,
      100,  30,  30,
      30,   30,   0,
      100,  30,  30,
      100,  30,   0,

      // between top rung and middle
      30,   30,   0,
      30,   30,  30,
      30,   60,  30,
      30,   30,   0,
      30,   60,  30,
      30,   60,   0,

      // top of middle rung
      30,   60,   0,
      30,   60,  30,
      67,   60,  30,
      30,   60,   0,
      67,   60,  30,
      67,   60,   0,

      // right of middle rung
      67,   60,   0,
      67,   60,  30,
      67,   90,  30,
      67,   60,   0,
      67,   90,  30,
      67,   90,   0,

      // bottom of middle rung.
      30,   90,   0,
      30,   90,  30,
      67,   90,  30,
      30,   90,   0,
      67,   90,  30,
      67,   90,   0,

      // right of bottom
      30,   90,   0,
      30,   90,  30,
      30,  150,  30,
      30,   90,   0,
      30,  150,  30,
      30,  150,   0,

      // bottom
      0,   150,   0,
      0,   150,  30,
      30,  150,  30,
      0,   150,   0,
      30,  150,  30,
      30,  150,   0,

      // left side
      0,   0,   0,
      0,   0,  30,
      0, 150,  30,
      0,   0,   0,
      0, 150,  30,
      0, 150,   0]),
    gl.STATIC_DRAW);
}

Promise.all([
  fetchTex('./vertex-shader.glsl'),
  fetchTex('./fragment-shader.glsl')
]).then(([vertexShaderSource, fragmentShaderSource]) => {
  main(vertexShaderSource, fragmentShaderSource);
})

