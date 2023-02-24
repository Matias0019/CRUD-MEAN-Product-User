import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';
import axios from 'axios';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  axios({
    method:'POST',
    url: 'http://localhost:3001/v1/users',
    headers: {authorization:req.headers.authorization},
    data: {
      _id: user._id,
      name: user.name,
      email:user.email,
      password: user.password,
      role: user.role
    },
  }).then(res => {
    if (res.status === 200) {
      console.log('Usuario Replicado')           
    }
  })
  .catch(e => {
    console.log(e+'Error en replicacion de usuario')
  })
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
    axios({
      method:'PATCH',
      url: (`http://localhost:3001/v1/users/${req.params['userId']}`),
      headers: {authorization:req.headers.authorization},
      data: {
        name: user?.name,
        email:user?.email,
        password: user?.password
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Usuario Modificado')           
      }
    })
    .catch(e => {
      console.log(e+'Error en la modificacion de usuario')
    })
    res.send(user);
  }
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']));
    axios({
      method:'DELETE',
      url: (`http://localhost:3001/v1/users/${req.params['userId']}`),
      headers: {authorization:req.headers.authorization},
      data: {
      },
    }).then(res => {
      if (res.status === 200) {
        console.log('Usuario Eliminado')           
      }
    })
    .catch(e => {
      console.log(e+'Error en la eliminacion de usuario')
    })
    res.status(httpStatus.NO_CONTENT).send();
  }
});
