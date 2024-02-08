//Importação de módulos
const { Service: ServiceModel } = require('../models/Service');

//Controller de serviços
const serviceController = {

    //Cria um serviço
    create: async (req, res) => {
        try {
            const service = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.body.image
            };

            const response = await ServiceModel.create(service);

            res.status(201).json({response, msg: 'Service added successfully'});
        } catch (error) {
            console.log(`Error when registering service: ${error}`);
        };
    },

    //Retorna dados de todos os serviços
    getAll: async (req, res) =>  {
        try {
            const services = await ServiceModel.find();
            res.json(services);
        } catch (error) {
            console.log(`Error returning data from services: ${error}`);
        };
    },

    //Retorna dados de um serviço à partir de seu ID
    getOne: async (req, res) => {
        try {
            const id = req.params.id
            const service = await ServiceModel.findById(id);

            if (!service) {
                res.status(404).json({msg: 'Service not found'});
                return;
            }

            res.json(service);
        } catch (error) {
            console.log(`Unable to find service: ${error}`);
        }
    },

    //Deleta um serviço à partir de seu ID
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const service = await ServiceModel.findById(id);
            const deletedService = await ServiceModel.findByIdAndDelete(id);

            if (!service) {
                res.status(404).json({msg: 'Service not found'});
                return;
            }

            res.status(200).json({deletedService, msg: 'Service deleted successfully'});
        } catch (error) {
            console.log(`Error when deleting service: ${error}`);
        };
    },

    //Atualiza os dados de um serviço à partir de seu ID
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const service = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.body.image
            };
            const updatedService = await ServiceModel.findByIdAndUpdate(id, service);

            if (!updatedService) {
                res.status(404).json({msg: 'Service not found'});
                return;
            }

            res.status(200).json({service, msg: 'Service updated successfully'});
        } catch (error) {
            console.log(`Error when updating service: ${error}`);
        };
    }
};

module.exports = serviceController;