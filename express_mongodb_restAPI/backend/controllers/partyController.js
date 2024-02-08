//Importação de módulos
const PartyModel = require('../models/Party');

//Funções auxiliares

//Função que verifica se o orçamento é suficiente para contratar os serviços
const checkPartyBudget = (budget, services) => {
    const priceSum = services.reduce((sum, service) => sum + service.price, 0);

    if (priceSum > budget) {
        return false;
    }

    return true;
}

//Controller de festas
const partyController = {

    //Cadastra uma festa no banco de dados
    create: async (req, res) => {
        try {
            const party = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                budget: req.body.budget,
                image: req.body.image,
                services: req.body.services
            };

            if (party.services && !checkPartyBudget(party.budget, party.services)) {
                res.status(406).json({msg: 'The budget is insufficient'});
                return;
            }

            const response = await PartyModel.create(party);

            res.status(201).json({response, msg: 'Party registered successfully'});
        } catch (error) {
            console.log(`Error registering party: ${error}`);
        }
    },

    //Retorna todos os dados do banco de dados
    getAll: async (req, res) => {
        try {
            const parties = await PartyModel.find();
            res.json(parties);
        } catch (error) {
            console.log(`Error returning data from parties: ${error}`);
        }
    },

    //Retorna um dado do banco de dados à partir de seu ID
    getOne: async (req, res) => {
        try {
            const id = req.params.id
            const party = await PartyModel.findById(id);

            if (!party) {
                res.status(404).json({msg: 'Party not found'});
                return;
            }

            res.json(party);

        } catch (error) {
            console.log(`Unable to find party: ${error}`);
        }
    },

    //Deleta um dado do banco de dados à partir de seu ID
    delete: async (req, res) => {
        try {
            const id = req.params.id
            const party = await PartyModel.findById(id);

            if (!party) {
                res.status(404).json({msg: 'Party not found'});
                return;
            }

            const deletedParty = await PartyModel.findByIdAndDelete(id);

            res.status(200).json({deletedParty, msg: 'Party deleted successfully!'});
        } catch (error) {
            console.log(`Error when deleting party: ${error}`);
        }
    },

    //Atualiza um dado no banco de dados à partir de seu ID
    update: async (req, res) => {
        try {
            const id = req.params.id;

            const party = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                budget: req.body.budget,
                image: req.body.image,
                services: req.body.services
            };

            if (party.services && !checkPartyBudget(party.budget, party.services)) {
                res.status(406).json({msg: 'The budget is insufficient'});
                return;
            }

            const updatedParty = await PartyModel.findByIdAndUpdate(id, party);

            if (!updatedParty) {
                res.status(404).json({msg: 'Party not found'});
                return;
            }

            res.status(200).json({party, msg: 'Party updated successfully!'});

        } catch (error) {
            console.log(`Error when updating party: ${error}`);
        }
    }
};

module.exports = partyController;