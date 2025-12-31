const Joi = require('joi');

// Middleware de validation générique
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Retourne toutes les erreurs, pas seulement la première
            stripUnknown: true // Supprime les champs non définis dans le schéma
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors: errors
            });
        }

        // Remplace req.body par les données validées et nettoyées
        req.body = value;
        return next();
    };
};

// Schémas de validation

// Validation pour l'inscription
const signupSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.alphanum': 'Le nom d\'utilisateur ne peut contenir que des caractères alphanumériques',
            'string.min': 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
            'string.max': 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères',
            'any.required': 'Le nom d\'utilisateur est obligatoire'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'L\'email doit être valide',
            'any.required': 'L\'email est obligatoire'
        }),
    
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'string.max': 'Le nom ne peut pas dépasser 100 caractères',
            'any.required': 'Le nom est obligatoire'
        }),
    
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
            'string.max': 'Le mot de passe ne peut pas dépasser 128 caractères',
            'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
            'any.required': 'Le mot de passe est obligatoire'
        }),
    
    passwordConfirm: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Les mots de passe ne correspondent pas',
            'any.required': 'La confirmation du mot de passe est obligatoire'
        })
});

// Validation pour la connexion
const signinSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'L\'email doit être valide',
            'any.required': 'L\'email est obligatoire'
        }),
    
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Le mot de passe est obligatoire'
        })
});

// Validation pour le formulaire de contact
const contactSchema = Joi.object({
    title: Joi.string()
        .valid('Mr', 'Mrs', 'Ms', 'Dr', 'Prof')
        .required()
        .messages({
            'any.only': 'Le titre doit être Mr, Mrs, Ms, Dr ou Prof',
            'any.required': 'Le titre est obligatoire'
        }),
    
    first_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Le prénom doit contenir au moins 2 caractères',
            'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
            'any.required': 'Le prénom est obligatoire'
        }),
    
    last_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'string.max': 'Le nom ne peut pas dépasser 50 caractères',
            'any.required': 'Le nom est obligatoire'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'L\'email doit être valide',
            'any.required': 'L\'email est obligatoire'
        }),
    
    subject: Joi.string()
        .min(5)
        .max(200)
        .required()
        .messages({
            'string.min': 'Le sujet doit contenir au moins 5 caractères',
            'string.max': 'Le sujet ne peut pas dépasser 200 caractères',
            'any.required': 'Le sujet est obligatoire'
        }),
    
    message: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Le message doit contenir au moins 10 caractères',
            'string.max': 'Le message ne peut pas dépasser 2000 caractères',
            'any.required': 'Le message est obligatoire'
        })
});

// Validation pour la newsletter
const subscribeSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'L\'email doit être valide',
            'any.required': 'L\'email est obligatoire'
        }),
    
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'string.max': 'Le nom ne peut pas dépasser 100 caractères'
        })
});

// Validation pour la mise à jour d'utilisateur (admin)
const updateUserSchema = Joi.object({
    role: Joi.string()
        .valid('admin', 'author')
        .optional()
        .messages({
            'any.only': 'Le rôle doit être admin ou author'
        }),
    
    status: Joi.string()
        .valid('pending', 'active', 'suspended')
        .optional()
        .messages({
            'any.only': 'Le statut doit être pending, active ou suspended'
        })
}).min(1).messages({
    'object.min': 'Au moins un champ (role ou status) doit être fourni'
});

module.exports = {
    validate,
    signupSchema,
    signinSchema,
    contactSchema,
    subscribeSchema,
    updateUserSchema
};
