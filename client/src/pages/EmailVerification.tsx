import { useEffect, useRef, useState, type FormEvent } from "react"
import {motion} from 'framer-motion'
import Button from "../components/Button";
import { useAuthStore } from "../store/auhStore";
import {useNavigate } from "react-router-dom";
import DotAnimation from "../components/DotAnimation";
import { useTranslation } from "react-i18next";
import i18n from "../config/reacti18next";
import clsx from "clsx";

  
  const EmailVerification = () => {
    const {t} = useTranslation()
    const {isLoading, verifyEmail, user} = useAuthStore()
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const formRef = useRef<HTMLFormElement | null>(null);

    const navigate = useNavigate();



    const moveCursorToStart = (i:number) => {
      requestAnimationFrame(() => {
        if(inputRefs.current){
          const inputRef = inputRefs.current[i];
          if(inputRef) {
            inputRef?.focus();
            inputRef?.setSelectionRange(1,1)
          }
        }
      })
    } 

    const handleChange = (i:number, value:string) => {
      const newCode = [...code];
     if(value.length > 1) {
     const pastedCode = value.slice(0,6).split("");

     for(let i = 0; i < 6 ; i++){
      newCode[i] = pastedCode[i] || "";
     }
     setCode(newCode);
     const lastFilledIndex = newCode.findLastIndex(digit => digit !== "");
     const focusedIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
     inputRefs.current[focusedIndex]?.focus(); 
     } else {
      newCode[i] = value;
      setCode(newCode);
      if(value && i < 5) {
        inputRefs.current[i + 1]?.focus();
      }
     }
    }

    const handleKeyDown = (i:number, e:React.KeyboardEvent<HTMLInputElement>) => {
      switch(e.key) {
        case "Backspace" : 
        if(!code[i] && i > 0) {
          inputRefs.current[i - 1]?.focus()
        }
        break; 

        case "ArrowRight" : 
        if(i < code.length - 1 ) {
          inputRefs.current[i + 1]?.focus()
        } else if(i = code.length - 1){
          inputRefs.current[0]?.focus()
        }
        break;

         case "ArrowLeft" : 
        if(i > 0) {
          inputRefs.current[i - 1]?.focus()
          moveCursorToStart(i - 1)
        } else{
          inputRefs.current[code.length - 1]?.focus()
          moveCursorToStart(code.length - 1)
        }

        break;
      }
    }

    useEffect(() => {
      if(code.every(digit => digit !== "")){
        formRef.current?.requestSubmit();
      }
    } , [code])

    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     try {
      const verificationCode = code.join("");
      await verifyEmail(verificationCode);
      navigate("/onboarding", { replace: true })
     } catch (error) {
      console.error(error)
     }
    }

    return (
   
      <motion.div
     initial={{opacity:0, y:20}}
     animate={{opacity:1, y:0, transition:{duration:.5}}}
     className='w-full max-w-xl  bg-base-300 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-[40px] shadow-xl 
     border border-base-content/20 overflow-hidden px-20'
     >

     <div className="p-8 ">
       <h1 className='text-3xl font-bold text-base-content text-center'>
        {t("verification.title", {ns:"auth"})}
       </h1>
       <p className="text-base-content text-center my-6">
        {t("verification.subtitle", {ns:"auth"})}
       </p>
       <form onSubmit={handleSubmit} ref={formRef}
         >
        <div className={clsx(i18n.language === "ar" && "flex-row-reverse",
         "flex flex-wrap justify-center gap-3")}
       >
          {code.map((value, index) => (
            <input
             type="text"
             onFocus={() => moveCursorToStart(index)}
             value={value}
             key={index}
             onChange={(e) => handleChange(index, e.target.value)}
             ref={(el) => { inputRefs.current[index] = el} }
             maxLength={6}
             onKeyDown={(e) => handleKeyDown(index, e)}
             
             className="cursor-default caret-transparent w-12 h-12 text-center text-2xl font-bold bg-base-100
            border-base-content/10 text-base-content border rounded-lg focus:outline-none
             focus:ring-offset-1 focus:ring-offset-base-300
              focus:ring-2 focus:ring-primary"
             />
          ))}
        </div>
      
      <Button classes="!py-3 mt-6">
       {isLoading
       ? (<> <span className="flex items-center justify-center gap-1">
        {t("buttons.verifying", {ns:"common"})}
        <DotAnimation/> </span> </>)
       : <>{t("buttons.verifyEmail", {ns:"common"})}</>}
      </Button>
       </form>
      </div>
      
      </motion.div>
     
    )
  }
  
  export default EmailVerification
  