import { expect, test } from "@playwright/test";

test("complete free diagnostic flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /descobrir meu ponto de virada/i }).first().click();

  for (let index = 0; index < 18; index += 1) {
    await page.getByRole("button", { name: /4\s+Muito/i }).click();
    await page.getByRole("button", { name: "Avançar", exact: true }).click();
  }

  await page.getByRole("button", { name: /Tenho direção/i }).click();
  await page.getByRole("button", { name: "Avançar", exact: true }).click();

  await page.getByRole("textbox", { name: "Nome", exact: true }).fill("Demo Virada");
  await page.getByRole("textbox", { name: "E-mail", exact: true }).fill("demo@viradaia.local");
  await page.getByRole("button", { name: /ver resultado gratuito/i }).click();
  await expect(page.getByText(/resultado gratuito/i).first()).toBeVisible();
});
