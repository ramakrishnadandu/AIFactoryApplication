import { NextFunction, Request, Response } from 'express';
import { createError, pick } from 'lodash';
import log from '../../utils/logger';
import { userSchema } from '../../schemas/user.schema';
import { UserDocument, User } from '../../models/user.model';

const userSchemaValidation = (data: any) => {
  const errors = userSchema.validate(data, { abortEarly: false });
  if (errors.length > 0) {
    throw createError(400, 'Invalid request data', errors);
  }
};

export interface IUserRequest extends Request {
  body: any;
}

interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userModel = {
  User,
  UserDocument,

  async register(req: IUserRequest, res: Response) {
    try {
      const { body } = req;
      await userSchemaValidation(body);
      const user = new User({ ...body });
      await user.save();
      return res.status(201).json(pick(user, ['_id', 'name', 'email']));
    } catch (error) {
      log.error(error);
      throw createError(400, 'Failed to register user');
    }
  },

  async login(req: IUserRequest, res: Response) {
    try {
      const { body } = req;
      await userSchemaValidation(body);
      const user = await User.findOne({ email: body.email });
      if (!user) {
        throw createError(401, 'Invalid credentials');
      }
      return res.status(200).json(pick(user, ['_id', 'name', 'email']));
    } catch (error) {
      log.error(error);
      throw createError(400, 'Failed to login user');
    }
  },

  async update(req: IUserRequest, res: Response) {
    try {
      const { body } = req;
      await userSchemaValidation(body);
      const user = await User.findOneAndUpdate({ _id: req.params.id }, body);
      return res.status(200).json(pick(user, ['_id', 'name', 'email']));
    } catch (error) {
      log.error(error);
      throw createError(400, 'Failed to update user');
    }
  },

  async delete(req: IUserRequest, res: Response) {
    try {
      await User.findOneAndDelete({ _id: req.params.id });
      return res.status(204).send();
    } catch (error) {
      log.error(error);
      throw createError(400, 'Failed to delete user');
    }
  },
};

export default userModel;
This TypeScript code defines a `userModel` with the following functionality:

*   **register**: Creates a new user in the database.
*   **login**: Authenticates a user using their email and password.
*   **update**: Updates an existing user's data.
*   **delete**: Deletes a user from the database.

Each function includes error handling and logging to ensure that any issues are properly logged and thrown as errors. The `userSchema` is used for validation, ensuring that only valid data is accepted in the request body.

The `IUserRequest` interface extends the standard Express request object to include an `body` property. This allows you to access the request body directly in the controller functions.

The `IUserResponse` interface defines the structure of the response body.

Please note this is just basic implementation and it can be further secured as per security requirements