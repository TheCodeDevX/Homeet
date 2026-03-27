import { useTranslation } from "react-i18next";
import i18n from "../../config/reacti18next";
import type { CurrencyCode, UserData } from "../../types/types";
import Button from "../Button";
import { Loader } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useAuthStore } from "../../store/authStore";
import { currencies } from "../../constants";

 type OfferPrice = { amount_usd?: number;
    amount_local: number | string; currency:CurrencyCode} | undefined

 interface MakeOfferFormProps {
    handleSubmit : (e: FormEvent<HTMLFormElement>) => Promise<void>
    setOfferPrice:Dispatch<SetStateAction<OfferPrice>>
    offerPrice:OfferPrice
    user:UserData | null
    message:string
    setMessage: Dispatch<SetStateAction<string>>
    isBookingLoading:boolean
    currencies: {
    code: CurrencyCode;
    symbol: string;
    name: string;
    rate: number;
    }[]
 }

 const MakeOfferForm = ({handleSubmit, setOfferPrice, offerPrice, user, message, setMessage, isBookingLoading} : MakeOfferFormProps) => {
  const lang = i18n.language  
  const { t } = useTranslation();
  const {user:authUser} = useAuthStore()
   const isArabic = i18n.language === "ar"
  const getCurrency = (user:UserData | null) => currencies.find(
    c => c.code.toLowerCase() === user?.currency
  )

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      {/* Offer Price */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide opacity-60">
          {t("labels.offerPrice", { ns: "common" })}
        </label>
       <div className="relative">
  <input
    type="number"
    min={0}
    value={(offerPrice?.amount_local)}
    onChange={({ target: { value } }) => setOfferPrice({
    amount_local:/^0/.test(value) ? (value.replace(/^0/,'')) : +value, 
    currency:user?.currency?.toUpperCase() as CurrencyCode,
   })}
    placeholder={t("placeholders.offerPrice", { ns: "common" })}
    className={`input input-bordered rounded-lg w-full text-sm placeholder:opacity-50
      ${lang === "ar" ? "pl-16" : "pr-16"}`}
  />

  <div className={`absolute top-1/2 -translate-y-1/2 opacity-60 text-sm font-medium uppercase
    ${lang === "ar" ? "left-3" : "right-3"}`}>
    {isArabic ? t(`currencies.${getCurrency(authUser)?.code}`, {ns:"common"}) : user?.currency}
  </div>
</div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide opacity-60">
          {t("labels.message", { ns: "common" })}
        </label>
        <textarea
          name="message"
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          placeholder={t("placeholders.message", { ns: "common" })}
          className="textarea textarea-bordered rounded-lg w-full text-sm resize-none placeholder:opacity-50"
          rows={3}
        />
      </div>

      <Button type="submit" classes="w-full !mt-5">
        {isBookingLoading
          ? <Loader className="animate-spin mx-auto size-4" />
          : <span className="text-sm font-medium">{t("buttons.submitOffer", { ns: "common" })}</span>
        }
      </Button>
    </form>
  );
};

export default MakeOfferForm