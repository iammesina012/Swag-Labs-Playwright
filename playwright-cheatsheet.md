# Playwright Cheatsheet

## Basic Test Codes

### 1. Check if page has title

```javascript
// expects a title "to contain" a substring.
await expect(page).toHaveTitle(/Playwright/);
```

### 2. Click the link

```javascript
// Click the get started link.
await page.getByRole("link", { name: "Get started" }).click();
```

### 3. Check if heading is visible

```javascript
// Expects page to have a heading with the name of Installation.
await expect(page.getByRole("heading", { name: "Installation" })).toBeVisible();
```
