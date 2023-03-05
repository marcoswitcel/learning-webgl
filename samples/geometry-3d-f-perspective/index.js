import { createProgram, createShader } from './gl-utils.js';
import { createCanvas, degToRad, fetchTex, makeZToWMatrix, Mat4 } from './utils.js';

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
  
  // Compute the matrix
  const fudgeFactor = 1;
  let matrix = makeZToWMatrix(fudgeFactor);
  matrix = Mat4.multiply(matrix, Mat4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400));
  matrix = Mat4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = Mat4.xRotate(matrix, rotation[0]);
  matrix = Mat4.yRotate(matrix, rotation[1]);
  matrix = Mat4.zRotate(matrix, rotation[2]);
  matrix = Mat4.scale(matrix, scale[0], scale[1], scale[2]);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Put geometry data into buffer
  setGeometry(gl);

  // Faze de renderização
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Turn on culling. By default backfacing triangles
  // will be culled.
  gl.enable(gl.CULL_FACE);

  gl.enable(gl.DEPTH_TEST);

  // Limpa o canvas
  gl.clearColor(0, 0, 0, 0);
  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  

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

  // Turn on the color attribute
  gl.enableVertexAttribArray(colorAttributeLocation);

  // Bind the color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  
  // Put the colors in the buffer.
  setColors(gl);

  {
    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    const size = 3;                 // 3 components per iteration
    const type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    const normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    const stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset);
  }

  {
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }
};

// Fill the buffer with the values that define a rectangle.

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        // left column front
        0,   0,  0,
        0, 150,  0,
        30,   0,  0,
        0, 150,  0,
        30, 150,  0,
        30,   0,  0,

        // top rung front
        30,   0,  0,
        30,  30,  0,
        100,   0,  0,
        30,  30,  0,
        100,  30,  0,
        100,   0,  0,

        // middle rung front
        30,  60,  0,
        30,  90,  0,
        67,  60,  0,
        30,  90,  0,
        67,  90,  0,
        67,  60,  0,

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
        30,   60,  30,
        30,   30,  30,
        30,   30,   0,
        30,   60,   0,
        30,   60,  30,

        // top of middle rung
        30,   60,   0,
        67,   60,  30,
        30,   60,  30,
        30,   60,   0,
        67,   60,   0,
        67,   60,  30,

        // right of middle rung
        67,   60,   0,
        67,   90,  30,
        67,   60,  30,
        67,   60,   0,
        67,   90,   0,
        67,   90,  30,

        // bottom of middle rung.
        30,   90,   0,
        30,   90,  30,
        67,   90,  30,
        30,   90,   0,
        67,   90,  30,
        67,   90,   0,

        // right of bottom
        30,   90,   0,
        30,  150,  30,
        30,   90,  30,
        30,   90,   0,
        30,  150,   0,
        30,  150,  30,

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

// Fill the buffer with colors for the 'F'.
function setColors(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220]),
      gl.STATIC_DRAW);
}

Promise.all([
  fetchTex('./vertex-shader.glsl'),
  fetchTex('./fragment-shader.glsl')
]).then(([vertexShaderSource, fragmentShaderSource]) => {
  main(vertexShaderSource, fragmentShaderSource);
})

