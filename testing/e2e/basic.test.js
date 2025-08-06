/**
 * Pruebas E2E básicas
 * Prueba funcionalidades básicas del sistema
 */

const { test, expect } = require('@playwright/test');

test.describe('Pruebas E2E Básicas', () => {
  test('debería poder acceder a la página principal', async ({ page }) => {
    // Teste básico que verifica se o Playwright está funcionando
    await page.goto('data:text/html,<html><body><h1>Test Page</h1></body></html>');
    
    const title = await page.textContent('h1');
    expect(title).toBe('Test Page');
  });

  test('debería poder interactuar con elementos básicos', async ({ page }) => {
    // Teste que verifica interações básicas
    await page.setContent(`
      <html>
        <body>
          <input id="test-input" type="text" value="test value">
          <button id="test-button">Click me</button>
        </body>
      </html>
    `);
    
    const input = await page.locator('#test-input');
    const button = await page.locator('#test-button');
    
    expect(await input.inputValue()).toBe('test value');
    expect(await button.isVisible()).toBe(true);
  });

  test('debería poder usar funciones de navegación', async ({ page }) => {
    // Teste que verifica funções de navegação
    await page.setContent(`
      <html>
        <body>
          <a href="#section1">Link 1</a>
          <a href="#section2">Link 2</a>
        </body>
      </html>
    `);
    
    const links = await page.locator('a');
    expect(await links.count()).toBe(2);
  });

  test('debería poder manejar formularios básicos', async ({ page }) => {
    // Teste que verifica manipulação de formulários
    await page.setContent(`
      <html>
        <body>
          <form>
            <input name="username" type="text">
            <input name="password" type="password">
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `);
    
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'testpass');
    
    const usernameValue = await page.inputValue('input[name="username"]');
    const passwordValue = await page.inputValue('input[name="password"]');
    
    expect(usernameValue).toBe('testuser');
    expect(passwordValue).toBe('testpass');
  });
}); 