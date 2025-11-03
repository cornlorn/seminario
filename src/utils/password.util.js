import bcrypt from 'bcrypt';

export const generarContrasena = (longitud = 12) => {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const especiales = '!@#$%&*';
  const todos = mayusculas + minusculas + numeros + especiales;

  let contrasena = '';

  contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
  contrasena += numeros[Math.floor(Math.random() * numeros.length)];
  contrasena += especiales[Math.floor(Math.random() * especiales.length)];

  for (let i = 4; i < longitud; i++) {
    contrasena += todos[Math.floor(Math.random() * todos.length)];
  }

  return contrasena
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

export const hashearContrasena = async (contrasena, rounds = 10) => {
  return await bcrypt.hash(contrasena, rounds);
};

export const compararContrasena = async (contrasena, hash) => {
  return await bcrypt.compare(contrasena, hash);
};
