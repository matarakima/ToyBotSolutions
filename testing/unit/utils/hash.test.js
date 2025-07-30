/**
 * Pruebas unitarias para las funciones de hash
 * Prueba las funciones hashPassword y comparePassword del módulo utils/hash
 */

const { hashPassword, comparePassword } = require('../../../backend/src/utils/hash');

describe('Funciones de Hash', () => {
  const testPassword = 'testPassword123';
  const testPassword2 = 'anotherPassword456';

  describe('hashPassword', () => {
    test('debería generar un hash válido para una contraseña', async () => {
      const hash = await hashPassword(testPassword);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
      expect(hash).not.toBe(testPassword);
    });

    test('debería generar hashes diferentes para la misma contraseña', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      
      expect(hash1).not.toBe(hash2);
    });

    test('debería manejar contraseñas vacías', async () => {
      const hash = await hashPassword('');
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    test('debería manejar contraseñas con caracteres especiales', async () => {
      const specialPassword = 'p@ssw0rd!#$%^&*()';
      const hash = await hashPassword(specialPassword);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(specialPassword);
    });

    test('debería lanzar error para contraseñas null o undefined', async () => {
      await expect(hashPassword(null)).rejects.toThrow();
      await expect(hashPassword(undefined)).rejects.toThrow();
    });
  });

  describe('comparePassword', () => {
    let validHash;

    beforeEach(async () => {
      validHash = await hashPassword(testPassword);
    });

    test('debería retornar true para contraseña correcta', async () => {
      const isValid = await comparePassword(testPassword, validHash);
      
      expect(isValid).toBe(true);
    });

    test('debería retornar false para contraseña incorrecta', async () => {
      const isValid = await comparePassword('wrongPassword', validHash);
      
      expect(isValid).toBe(false);
    });

    test('debería retornar false para hash inválido', async () => {
      const isValid = await comparePassword(testPassword, 'invalidHash');
      
      expect(isValid).toBe(false);
    });

    test('debería manejar contraseñas vacías', async () => {
      const emptyHash = await hashPassword('');
      const isValid = await comparePassword('', emptyHash);
      
      expect(isValid).toBe(true);
    });

    test('debería manejar contraseñas con espacios', async () => {
      const passwordWithSpaces = ' password with spaces ';
      const hash = await hashPassword(passwordWithSpaces);
      const isValid = await comparePassword(passwordWithSpaces, hash);
      
      expect(isValid).toBe(true);
    });

    test('debería lanzar error para parámetros null o undefined', async () => {
      await expect(comparePassword(null, validHash)).rejects.toThrow();
      await expect(comparePassword(testPassword, null)).rejects.toThrow();
      await expect(comparePassword(undefined, validHash)).rejects.toThrow();
      await expect(comparePassword(testPassword, undefined)).rejects.toThrow();
    });
  });

  describe('Integración hashPassword y comparePassword', () => {
    test('debería poder verificar una contraseña hasheada', async () => {
      const password = 'mySecurePassword';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    test('debería fallar con contraseña incorrecta después del hash', async () => {
      const password = 'mySecurePassword';
      const wrongPassword = 'myWrongPassword';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });

    test('debería funcionar con múltiples contraseñas', async () => {
      const passwords = [
        'password1',
        'password2',
        'password3',
        'p@ssw0rd!#$',
        'contraseña con ñ y áccentos'
      ];

      for (const password of passwords) {
        const hash = await hashPassword(password);
        const isValid = await comparePassword(password, hash);
        
        expect(isValid).toBe(true);
      }
    });
  });

  describe('Rendimiento', () => {
    test('debería completar el hash en un tiempo razonable', async () => {
      const startTime = Date.now();
      await hashPassword(testPassword);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000); // Menos de 1 segundo
    });

    test('debería completar la comparación en un tiempo razonable', async () => {
      const hash = await hashPassword(testPassword);
      
      const startTime = Date.now();
      await comparePassword(testPassword, hash);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000); // Menos de 1 segundo
    });
  });

  describe('Casos edge', () => {
    test('debería manejar contraseñas muy largas', async () => {
      const longPassword = 'a'.repeat(1000);
      const hash = await hashPassword(longPassword);
      const isValid = await comparePassword(longPassword, hash);
      
      expect(isValid).toBe(true);
    });

    test('debería manejar contraseñas con caracteres Unicode', async () => {
      const unicodePassword = 'contraseña con emoji 🚀 y símbolos 中文';
      const hash = await hashPassword(unicodePassword);
      const isValid = await comparePassword(unicodePassword, hash);
      
      expect(isValid).toBe(true);
    });

    test('debería manejar hashes muy largos', async () => {
      const password = 'test';
      const hash = await hashPassword(password);
      
      // Verificar que el hash tenga una longitud razonable
      expect(hash.length).toBeGreaterThan(50);
      expect(hash.length).toBeLessThan(200);
    });
  });
}); 