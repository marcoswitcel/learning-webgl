
/**
 * 
 * @param {WebGLRenderingContext} gl contexto
 * @param {GLenum} type 
 * @param {string} source GLSL shader source
 * @returns 
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

/**
 * 
 * @param {WebGLRenderingContext} gl contexto
 * @param {WebGLShader} vertexShader 
 * @param {WebGLShader} fragmentShader 
 * @returns 
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}
