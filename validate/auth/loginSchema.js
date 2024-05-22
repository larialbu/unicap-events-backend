const { z } = require('zod');

// Esquema de validação para os dados de login
const loginSchema = z.object({
  email: z.string().email(), // O email é obrigatório e deve ser um email válido
  password: z.string(), // A senha é obrigatória
});

module.exports = loginSchema;