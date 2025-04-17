import { ValidationSchema } from '@/lib/validation';
import { LoginRequestBody } from './route';

const schema = new ValidationSchema<LoginRequestBody>([
  {
    name: 'username',
    fn: value =>
      typeof value.username === 'string' && value.username.length > 0,
  },
  {
    name: 'password',
    fn: value =>
      typeof value.password === 'string' && value.password.length > 0,
  },
]);

export default schema;
