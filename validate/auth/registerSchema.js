const { z } = require('zod');

// Esquema de validação para os dados de registro
const registerSchema = z.object({
  username: z.string().min(3), // O username é obrigatório e deve ter no mínimo 3 caracteres
  email: z.string().email(), // O email é obrigatório e deve ser um email válido
  password: z.string().min(6), // A senha é obrigatória e deve ter no mínimo 6 caracteres
});

module.exports = registerSchema;