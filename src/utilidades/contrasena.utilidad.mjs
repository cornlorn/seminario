import bcrypt from 'bcrypt';

/**
 * Genera una contraseña aleatoria segura
 * Incluye mayúsculas, minúsculas, números y caracteres especiales
 * 
 * @param {number} longitud - Longitud de la contraseña (por defecto 12)
 * @returns {string} Contraseña generada
 */
export const generarContrasena = (longitud = 12) => {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const especiales = '!@#$%&*';
  const todos = mayusculas + minusculas + numeros + especiales;

  let contrasena = '';
  
  // Asegurar que incluya al menos un carácter de cada tipo
  contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
  contrasena += numeros[Math.floor(Math.random() * numeros.length)];
  contrasena += especiales[Math.floor(Math.random() * especiales.length)];

  // Completar el resto de la longitud
  for (let i = 4; i < longitud; i++) {
    contrasena += todos[Math.floor(Math.random() * todos.length)];
  }

  // Mezclar los caracteres
  return contrasena
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Hashea una contraseña usando bcrypt
 * 
 * @param {string} contrasena - Contraseña en texto plano
 * @param {number} rounds - Número de rondas de salt (por defecto 10)
 * @returns {Promise<string>} Contraseña hasheada
 */
export const hashearContrasena = async (contrasena, rounds = 10) => {
  return await bcrypt.hash(contrasena, rounds);
};

/**
 * Compara una contraseña en texto plano con un hash
 * 
 * @param {string} contrasena - Contraseña en texto plano
 * @param {string} hash - Hash de contraseña
 * @returns {Promise<boolean>} True si coinciden
 */
export const compararContrasena = async (contrasena, hash) => {
  return await bcrypt.compare(contrasena, hash);
};
