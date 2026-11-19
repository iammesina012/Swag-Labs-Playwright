import { test, expect } from "@playwright/test";

// Login successfully with valid credentials
test("should login successfully with valid credentials", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/inventory/);
});

// Display an error message when username is WRONG
test("should display error when username is wrong", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("wrong_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Username and password do not match",
  );
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when password is WRONG
test("should display error when password is wrong", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_pass");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Username and password do not match",
  );
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when username is EMPTY
test("should display error when username is empty", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert")).toContainText("Username is required");
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when password is EMPTY
test("should display error when password is empty", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert")).toContainText("Password is required");
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when both fields are EMPTY
test("should display error when both fields are empty", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("");
  await page.getByPlaceholder("Password").fill("");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert")).toContainText("Username is required");
  await expect(page).not.toHaveURL(/inventory/);
});

// Display an error message when locked-out user attempts to log in
test("should display error when locked-out user attempts to log in", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("locked_out_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Sorry, this user has been locked out",
  );
  await expect(page).not.toHaveURL(/inventory/);
});
