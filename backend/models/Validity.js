import * as yup from 'yup';
import { setLocale } from 'yup';

const Resource = require('./Resource.js');

setLocale({
  mixed: {
    default: 'Não é válido',
  },
  number: {
    min: 'Deve ser maior que ${min}',
  },
});


let schema = yup.object().shape({
  name: yup.string().required(),
  schema: yup.array().required(),
  data: yup.array().required(),
  number: yup.number().min(1).required(),
  userId: yup.string().required(),
  projectId: yup.string().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }),
});

schema.validate(Resource).catch(function (err) {
    err.name; // => 'ValidationError'
    err.errors; // => ['Deve ser maior que 18']
});