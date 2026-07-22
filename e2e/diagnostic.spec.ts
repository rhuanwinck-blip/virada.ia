import { expect, test } from "@playwright/test";

test("organize a natural-language command in the proactive assistant", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /um assessor pessoal/i })).toBeVisible();
  await page.getByRole("link", { name: /abrir demo/i }).click();

  await expect(page.getByRole("heading", { name: /fale o que precisa fazer/i })).toBeVisible();
  await page.getByLabel("Mensagem para o assessor").fill("Me lembra de ligar para o Joao sexta.");
  await page.getByRole("button", { name: /organizar/i }).click();

  await expect(page.getByText(/ligar para o Joao sexta/i).first()).toBeVisible();
  await expect(page.getByText(/qual horario fica melhor/i).first()).toBeVisible();
  await page.getByRole("button", { name: /confirmar/i }).click();
  await expect(page.getByText(/confirmado/i).first()).toBeVisible();
});
