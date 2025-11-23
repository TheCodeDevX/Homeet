
 
 // @desc   
 // @route  
 // @access Public

import User from "../models/user.models.js";
import { createError } from "../utils/createError.js";

  export const getUser = async(req, res, next) => {
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