
 
 // @desc   
 // @route  
 // @access Public

import User from "../models/user.models.ts";
import { createError } from "../utils/createError.ts";
import {Response, Request, NextFunction} from 'express'

  export const getUser = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if(!user) {
          createError("USER_FINDING_FAILED", 400);
          return;
        }
        res.status(200).json(user)
    } catch (error) {
        console.error("error in getUser controller");
        next(error)
    }
  }