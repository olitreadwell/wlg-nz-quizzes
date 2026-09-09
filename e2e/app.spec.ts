import { expect, test } from '@playwright/test';
import { siteConfig } from '../src/lib/site-config';

test('homepage renders and health answers', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'WLG NZ Quizzes' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search listings' })).toBeVisible();

  const health = await request.get('/health');
  expect(health.status()).toBe(200);
  await expect(health.json()).resolves.toMatchObject({ status: 'ok' });
});

test('directory pages render from the snapshot', async ({ page }) => {
  await page.goto('/items');
  await expect(page.getByRole('heading', { name: `All ${siteConfig.thingPlural}` })).toBeVisible();
  await expect(page.getByRole('link', { name: '1841 Bar Restaurant' })).toBeVisible();
});

test('item detail shows community and data provenance', async ({ page }) => {
  await page.goto('/items/1841-bar-restaurant');
  await expect(page.getByRole('heading', { name: '1841 Bar Restaurant' })).toBeVisible();
  await expect(page.getByText('Last verified')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Help keep this listing right' })).toBeVisible();
});

test('openapi spec is served and swagger ui renders', async ({ page, request }) => {
  const spec = await request.get('/api/openapi.json');
  expect(spec.status()).toBe(200);
  const body = (await spec.json()) as { openapi: string; paths: Record<string, unknown> };
  expect(body.openapi).toBe('3.1.0');
  expect(body.paths['/api/hello']).toBeDefined();
  expect(body.paths['/api/v1/items']).toBeDefined();

  await page.goto('/docs');
  await expect(page.locator('.swagger-ui .info .title')).toContainText(`${siteConfig.name} API`, {
    timeout: 15_000,
  });
  await expect(page.locator('.swagger-ui .opblock').first()).toBeVisible();
});
