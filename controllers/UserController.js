const knex = require('../database/knex');

// Criar um novo usuário
exports.createUser = async (req, res) => {
  const { name, email, ra, phone, type, permission, isSuperAdmin } = req.body;

  try {
    // Verificar se o e-mail já está sendo utilizado
    const existingUser = await knex('users').where('email', email).first();
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso' });
    }

    // Criar um novo usuário
    const [id] = await knex('users').insert({
      name,
      email,
      ra,
      phone,
      type,
      permission,
      is_super_admin: isSuperAdmin,
    });

    const user = await knex('users').where('id', id).first();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await knex('users').select('*');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obter um usuário por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where('id', id).first();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, ra, phone, type, permission, isSuperAdmin } = req.body;

  try {
    const user = await knex('users').where('id', id).first();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o e-mail já está sendo utilizado por outro usuário
    const existingUser = await knex('users').where('email', email).whereNot('id', id).first();
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso' });
    }

    await knex('users')
      .where('id', id)
      .update({
        name,
        email,
        ra,
        phone,
        type,
        permission,
        is_super_admin: isSuperAdmin,
      });

    const updatedUser = await knex('users').where('id', id).first();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Excluir um usuário
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where('id', id).first();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await knex('users').where('id', id).del();
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Conceder permissão a um usuário
exports.grantPermission = async (req, res) => {
  const { userId, permission } = req.body;

  try {
    const user = await knex('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário atual é super admin
    if (!user.is_super_admin) {
      return res.status(403).json({ message: 'Você não tem permissão para executar esta ação' });
    }

    // Lógica para conceder permissão ao usuário
    const updatedPermissions = [...user.permission.split(','), permission];
    await knex('users')
      .where('id', userId)
      .update({ permission: updatedPermissions.join(',') });

    res.json({ message: 'Permissão concedida com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Revogar permissão de um usuário
exports.revokePermission = async (req, res) => {
  const { userId, permission } = req.body;

  try {
    const user = await knex('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário atual é super admin
    if (!user.is_super_admin) {
      return res.status(403).json({ message: 'Você não tem permissão para executar esta ação' });
    }

    // Lógica para revogar permissão do usuário
    const updatedPermissions = user.permission.split(',').filter(p => p !== permission);
    await knex('users')
      .where('id', userId)
      .update({ permission: updatedPermissions.join(',') });

    res.json({ message: 'Permissão revogada com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obter todas as permissões de um usuário
exports.getAllPermissions = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await knex('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const permissions = user.permission.split(',');
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Conceder status de super admin a um usuário
exports.grantSuperAdminStatus = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await knex('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o usuário atual é super admin
    if (!user.is_super_admin) {
      return res.status(403).json({ message: 'Você não tem permissão para executar esta ação' });
    }

    await knex('users')
      .where('id', userId)
      .update({ is_super_admin: true });

    res.json({ message: 'Status de super admin concedido com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Revogar status de super admin de um usuário
exports.revokeSuperAdminStatus = async (req, res) => {
    const { userId } = req.body;
  
    try {
      const user = await knex('users').where('id', userId).first();
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Verificar se o usuário atual é super admin
      if (!user.is_super_admin) {
        return res.status(403).json({ message: 'Você não tem permissão para executar esta ação' });
      }
  
      await knex('users')
        .where('id', userId)
        .update({ is_super_admin: false });
  
      res.json({ message: 'Status de super admin revogado com sucesso' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // Verificar se um usuário é super admin
  exports.isSuperAdmin = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await knex('users').where('id', userId).first();
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      res.json({ isSuperAdmin: user.is_super_admin });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };