const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

function sendSuccessResponse(res, data) {
    return res.json({ status: "success", data });
}

function sendErrorResponse(res, statusCode, message) {
    return res.status(statusCode).json({ status: "error", message });
}

exports.list = async (req, res) => {
    try {
        const eventos = await db('eventos')
                        .join('locais', 'eventos.local_id', '=', 'locais.id')
                        .join('ingressos', 'eventos.local_id', '=', 'ingressos.id')                 
                        .select('eventos.*', 'locais.*');

        sendSuccessResponse(res, eventos);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Falha ao listar eventos.");
    }
};

exports.create = async (req, res) => {
    const { usuario_id, nome, data, local_id, descricao, capacidade, categoria } = req.body;

    if (!usuario_id || !nome || !data || !local_id || !descricao || !capacidade || !categoria) {
        return sendErrorResponse(res, 400, "Campos obrigatórios não preenchidos.");
    }

    try {
        // Adicione o evento ao banco de dados e obtem o ID do evento
        const evento = await db('eventos')
            .insert({ usuario_id, nome, data, local_id, descricao, capacidade, categoria })
            .returning('*');

        // Crie os ingressos diretamente no banco de dados usando um array de objetos
        const ingressos = [];
        for (let i = 1; i <= capacidade; i++) {
            ingressos.push({ evento_id: evento[0].id, usuario_id: usuario_id });
        }

        // Use o método .insert() do Knex para inserir todos os ingressos de uma vez
        await db('ingressos').insert(ingressos);

        sendSuccessResponse(res, "Evento adicionado com sucesso.");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Falha ao adicionar evento.");
    }
};

exports.get = async (req, res) => {
    const id = req.params.id;
    try {
        const evento = await db('eventos').where('id', id).first();
        if (evento) {
            sendSuccessResponse(res, evento);
        } else {
            sendErrorResponse(res, 404, "Evento não encontrado.");
        }
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Falha ao obter evento.");
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const { nome, data, local_id, descricao, capacidade, categoria } = req.body;

    if (!nome || !data || !local_id || !descricao || !capacidade || !categoria) {
        return sendErrorResponse(res, 400, "Campos obrigatórios não preenchidos.");
    }

    try {
        const updated = await db('eventos').where('id', id).update({ nome, data, local_id, descricao, capacidade, categoria });
        if (updated) {
            sendSuccessResponse(res, "Evento atualizado com sucesso.");
        } else {
            sendErrorResponse(res, 404, "Evento não encontrado.");
        }
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Falha ao atualizar evento.");
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await db('eventos').where('id', id).del();
        if (deleted) {
            sendSuccessResponse(res, "Evento deletado com sucesso.");
        } else {
            sendErrorResponse(res, 404, "Evento não encontrado.");
        }
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Falha ao deletar evento.");
    }
};
