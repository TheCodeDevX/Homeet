import asyncHandler from "express-async-handler";


 export const ControllerWrapper = (fn) => asyncHandler(fn)