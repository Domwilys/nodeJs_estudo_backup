const PostModel = require('../models/Post');

const postController = {

    //Cria uma postagem
    create: async (req, res) => {
        try {
            const post = {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                category: req.body.category
            }

            const response = await PostModel.create(post);

            res.status(201).json({response, msg: 'Post created successfully'});
        } catch (error) {
            console.log(`Error when registering post: ${error}`);
        }
    },

    //Retorna todos os dados de todas as postagens
    getAll: async (req, res) => {
        try {
            //Paginação
            const { page = 1 } = req.query;
            const limit = 10;
            const countPost = PostModel.countDocuments();

            if (countPost === 0) {
                return res.status(404).json({msg: 'No posts found'});
            }

            const totalPages = Math.ceil(countPost / limit);

            if (page < 1 || page > totalPages) {
                return res.status(400).json({msg: 'Invalid page number'});
            }

            const startIndex = (page - 1) * limit;

            //Retorno dos dados das postagens
            const posts = await PostModel.find().skip(startIndex).limit(limit);

            res.json({
                posts,
                currentPage: page,
                lastPage: totalPages,
                firstPage: 1,
                nextPage: parseInt(page) + 1,
                previousPage: parseInt(page) - 1
            });
        } catch (error) {
            
        }
    },

    //Retorna os dados de uma postagem à partir de seu ID
    getOne: async (req, res) => {
        try {
            const id = req.params.id
            const post = await PostModel.findById(id);

            if (!post) {
                return res.status(404).json({msg: 'Unable do find post'});
            }

            res.json(post);
        } catch (error) {
            console.log(`Unable to find post: ${error}`);
        }
    },

    //Deleta uma postagem à partir de seu ID
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const post = await PostModel.findById(id);
            const deletedPost = await PostModel.findByIdAndDelete(id);

            if (!post) {
                return res.status(404).json({msg: 'Unable to find post'});
            }

            res.json({deletedPost, msg: 'Post deleted successfully'});
        } catch (error) {
            console.log('Internal server error');
        }
    },

    //Atualiza os dados de uma postagem à partir de seu ID
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const post = {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                category: req.body.category
            }
            
            const updatedPost = await PostModel.findByIdAndUpdate(id, post);

            if (!updatedPost) {
                res.status(404).json({msg: 'Unable to find post'});
            }

            res.json({post, msg: 'Post updated successfully'});
        } catch (error) {
            console.log(`Internal server error: ${error}`);
        }
    }
}

module.exports = postController;