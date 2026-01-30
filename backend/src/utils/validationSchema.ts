import { body, check } from "express-validator";



 export const signupValidationSchema = [
     body('firstName')
     .custom((value) => {
        if(!isNaN(value) && value.trim() !== "") {
            throw new Error("CANNOT_BE_NUM")
        }
        return true;
     })
    .trim().notEmpty().withMessage(``).bail()
    .isString().withMessage(`FIRST_NAME_REQUIRED`),

     body('lastName').trim()
    .notEmpty().withMessage(`LAST_NAME_REQUIRED`).bail()
    .isString().withMessage(`LAST_NAME_MUSTBE_STRING`),


   body('email').trim().notEmpty().withMessage('EMAIL_REQUIRED').bail()
   .isEmail().withMessage('INVALID_EMAIL')
   .normalizeEmail(),

    body('password').trim().notEmpty().withMessage('PASS_REQUIRED').bail()
    .isString().withMessage("PASS_MUSTBE_STRING")
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase:1,
        minSymbols:1,
        minNumbers:1,
    }).withMessage("TIP"),

 ]

 
 export const loginValidationSchema = [
    

   body('email').trim().notEmpty().withMessage('EMAIL_REQUIRED').bail()
   .isEmail().withMessage('INVALID_EMAIL')
   .trim()
   .normalizeEmail(),

    body('password').trim().notEmpty().withMessage('PASS_REQUIRED').bail()

 ];


 export const ListingValidationSchema = [
    check("title").trim().notEmpty().withMessage("TITLE_REQUIRED"),
    check("description").trim().notEmpty().withMessage("DESC_REQUIRED"),
    check("location").trim().notEmpty().withMessage("LOC_REQUIRED"),
     check("pricingType").trim().notEmpty().isIn(["nightly", "monthly", "one_time"]).withMessage("ENTER_RENTALPRICE"),
    check("images").custom((image) => {
        if(Array.isArray(image)){
            if(image.length < 1) {
                throw new Error("ATLEAST_ONE_IMAGE")
            }

        }else if(typeof image === "string"){
          if(image.trim() === "") {
            throw new Error("IMG_MUSTBE_NOTEMTY")
          }
        }else {
           throw new Error("IMAGES_MUSTBE_STRINGS")
        }
        return true;
    }),
    check("amenities.*").optional().isIn(["Wi-Fi","Furnished","Parking","Air Conditioning",
    "Kitchen Access","Pet-Friendly", "Washer / Dryer","Balcony","Garden","Gym","Fireplace","Pool"]),
    check("beds").trim().optional().isNumeric(),
    check("bathrooms").trim().optional().isNumeric(),
    check("bedrooms").trim().optional().isNumeric(),
    check("size").trim().optional().isNumeric(),
    check("floor").trim().optional().isNumeric(),
    check("price")
    .custom(val => {
        if(val === 0) {
            throw new Error("RENTAL_PRICE_REQUIRED")
        } 
        return true;
    }).trim().notEmpty().withMessage("RENTAL_PRICE_REQUIRED"),
    check("adults").trim().isLength({min:1}).withMessage("ADULTS_REQUIRED"),
    check("children").trim().isNumeric().withMessage("CHILDREN_REQUIRED"),
    check("pets").trim().isNumeric().withMessage("PETS_REQUIRED"),
   
 ]

 export const ProfileSchema = [
    check("firstName").trim().notEmpty().withMessage("FIRST_NAME_REQUIRED"),
    check("lastName").trim().notEmpty().withMessage("LAST_NAME_REQUIRED"),
    check("email").trim().notEmpty().withMessage("EMAIL_REQUIRED"),
    check("profilePic").trim().notEmpty().withMessage("PROFILE_REQUIRED"),
    check("phoneNumber").trim().notEmpty().withMessage("PHONE_NUMBER_REQUIRED"),
    check("bio").trim().optional(),
    check("role").trim().isIn(["tenant", "homeowner", "seller"]).withMessage("ROLE_REQUIRED"),
    check("gender").trim().isIn(["male", "female"]).withMessage("GENDER_REQUIRED"),
    check("address").trim().optional(),
    check("currency").trim().optional()
 ]