import { z } from "zod";

// 🔹 Definição do schema com regras de validação
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório") // não pode estar vazio
    .email("Formato de e-mail inválido"), // valida se é email válido
  techs: z
    .string()
    .min(1, "Informe ao menos uma tecnologia"), // campo obrigatório
});

// 🔹 TypeScript: gera os tipos automaticamente com base no schema
export type LoginFormData = z.infer<typeof loginSchema>;