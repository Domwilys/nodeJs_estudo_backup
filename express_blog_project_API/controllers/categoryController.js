//Importação de módulos
const CategoryModel = require('../models/Category');

const categoryController = {

    //Cria uma categoria
    create: async (req, res) => {
        try {
            const category = {
                name: req.body.name,
                slug: req.body.slug
            };

            const response = await CategoryModel.create(category);

            res.status(201).json({response, msg: 'Category registered successfully!'});
        } catch (error) {
            console.log(`Error when registering category: ${error}`);
        }
    },

    //Retorna os dados de todas as categorias
    getAll: async (req, res) => {
        try {
            //paginação
            const { page = 1 } = req.query;
            const limit = 10;
            const countCategory = await CategoryModel.countDocuments();

            if (countCategory === 0) {
                return res.status(404).json({msg: 'No categories found'});
            }

            const totalPages = Math.ceil(countCategory / limit);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({msg: 'Invalid page number'});
            }

            const startIndex = (page - 1) * limit;

            //Retorno dos dados das categorias
            const categories = await CategoryModel.find().skip(startIndex).limit(limit);

            res.json({
                categories,
                currentPage: page,
                lastpage: totalPages,
                firstPage: 1,
                nextPage: parseInt(page) + 1,
                previousPage: parseInt(page) - 1
            });
        } catch (error) {
            res.status(500).json({msg: 'Internal server error'});
            console.log(`Unable to find categories data: ${error}`);
            return;
        }
    },

    //Retorna os dados de uma categoria à partir de seu ID
    getOne: async (req, res) => {
        try {
            const id = req.params.id
            const category = await CategoryModel.findById(id);

            if (!category) {
                res.status(404).json({msg: 'Category not found'});
                return;
            }

            res.json(category);
        } catch (error) {
            console.log(`Unable to find category: ${error}`);
        }
    },

    //Deleta uma categoria à partir de seu ID
    delete: async (req, res) => {
        try {
            const id = req.params.id
            const category = await CategoryModel.findById(id);
            const deletedCategory = await CategoryModel.findByIdAndDelete(id);

            if (!category) {
                res.status(404).json({msg: 'Unable to find category'});
                return;
            }

            res.status(200).json({deletedCategory, msg: 'Category deleted successfully'});
        } catch (error) {
            console.log(`Error when deleting category: ${error}`);
        }
    },

    //Atualiza os dados de uma categoria à partir de seu ID
    update: async (req, res) => {
        try {
            const id = req.params.id
            const category = {
                name: req.body.name,
                slug: req.body.slug
            };
            const updatedCategory = await CategoryModel.findByIdAndUpdate(id, category);

            if (!updatedCategory) {
                res.status(404).json({msg: 'Unable to find category'});
            }

            res.status(200).json({category, msg: 'Category updated successfully'});
        } catch (error) {
            console.log(`Error when updating category: ${error}`);
        }
    }
}

module.exports = categoryController;