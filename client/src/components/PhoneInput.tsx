import { t } from "i18next"
import { countries } from "../constants";
import clsx from "clsx";
import i18n from "../config/reacti18next";
import type { ControllerRenderProps } from "react-hook-form";
import * as types from '../../../backend/src/shared/types/types'
import PhoneInput from 'react-phone-number-input'


interface PhoneInputProps {
    field : ControllerRenderProps<types.ProfileData, "phoneNumber">
}
 
 const PhoneInputComponent = ({field} : PhoneInputProps) => {
    const labels = countries.reduce((acc, item) => 
    ({...acc, [item.code] : t(`countries.${item.code}`, {ns : "countries"})}), {});
    const lng = i18n.language;
   return (
    <PhoneInput
    labels={{...labels, ZZ : t("countries.INT", {ns:"countries"} )}}
    onCountryChange={(country) =>  {console.log(country)}
    }

    {...field}  
    id={lng === 'ar' && 'phone-number'}            
    className={clsx(
    "relative",
    "input input-bordered",
    )}
    placeholder={t("labels.phoneNumber", {ns:"common"})}
    /> 
   )
 }
 
 export default PhoneInputComponent
 