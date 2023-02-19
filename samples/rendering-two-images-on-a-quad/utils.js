/**
 * Cria um canvas com as dimensões especificadas e adiciona ele a algum elemnto
 * caso o parâmetro `appendTo` seja especificado
 * @param {number} width Largura inicial do canvas
 * @param {number} height Altura inicial do canvas
 * @param {HTMLElement} [appendTo] O elemento especificado através dessa propriedade
 * terá o canvas adicionado a sua lista de filhos
 * @returns {HTMLCanvasElement} Canvas recém criado
 */
export function createCanvas(width, height, appendTo = null) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    if (appendTo) {
        appendTo.appendChild(canvas);
    }

    return canvas;
}

export function fetchTex(...args) {
    return fetch(...args).then(resp => resp.text());
}

/**
 * 
 * @param {string} path Caminho da imagem
 * @returns {Image}
 */
export function fetchImage(path) {
    const image = new Image();
    image.src = path;

    return new Promise((resolve, reject) => {
        image.onload = () => { resolve(image) };
        image.onerror = () => { reject(image) };
    });
}
