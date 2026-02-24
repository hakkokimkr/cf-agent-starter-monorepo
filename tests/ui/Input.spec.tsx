import { test, expect } from '@playwright/experimental-ct-react';
import { Input } from '@repo/ui';

test.describe('Input Component', () => {
  test('renders input with label', async ({ mount }) => {
    const component = await mount(<Input label="Email" />);
    await expect(component.locator('label')).toContainText('Email');
  });

  test('shows error message', async ({ mount }) => {
    const component = await mount(<Input label="Email" error="Invalid email" />);
    await expect(component.locator('text=Invalid email')).toBeVisible();
    await expect(component.locator('input')).toHaveClass(/border-red-300/);
  });

  test('shows helper text', async ({ mount }) => {
    const component = await mount(
      <Input label="Password" helperText="At least 8 characters" />
    );
    await expect(component.locator('text=At least 8 characters')).toBeVisible();
  });

  test('handles disabled state', async ({ mount }) => {
    const component = await mount(<Input label="Email" disabled />);
    await expect(component.locator('input')).toBeDisabled();
  });
});
