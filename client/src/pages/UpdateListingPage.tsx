import { Check, Loader, PenBox, Upload, X } from "lucide-react"
import { amenities, type Facilities } from "../constants"
import {motion} from 'framer-motion'
import {  useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { useListingStore, type FormData } from "../store/listingStore"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import CounterBtn from "../components/CounterBtn"
import i18n from "../config/reacti18next"


 interface ImageType {url :string}

const UpdateListingPage = () => {

  const {t} = useTranslation()

  let {id} = useParams()

  // const [unit, setUnit] = useState<Exclude<FormData["pricingType"], "">>("monthly")
    const {isLoading, updateListing, listing, getListing, error, message} = useListingStore()
   
  
    useEffect(() => {
      if(id){
        getListing(id)
      }
    }, [])

    





    const [imagesPreview, setImagesPreview] = useState<({url : string} | string)[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null)  
  const [formState, setFormState] = useState<FormData>({
    title: "",
    description:  "",
    location: "",
    images: [],
    pricingType:  "placeholder",
    amenities : [],
    price: 0,
    bedrooms:0,
    beds: 0,
    size: 0,
    floor: 0,
    bathrooms:0,
  });

      useEffect(() => {
      if(listing) {
    setFormState({
    title:listing?.title ?? "",
    description: listing?.description ?? "",
    location:listing?.location ?? "",
    images: listing.images ?? [],
    pricingType: listing?.pricingType ?? "placeholder",
    amenities : listing?.amenities ?? [],
    price: listing?.price ?? 0,
    bedrooms:listing?.bedrooms ?? 0,
    beds:listing?.beds ?? 0,
    size:listing?.size ?? 0,
    floor:listing?.floor ?? 0,
    bathrooms:listing?.bathrooms ?? 0,
        })
      }
      setImagesPreview(listing?.images ?? [])
    }, [listing])



 

  // useEffect(() => { console.log(formState.rental) }, [formState.rental])

  // const handleKeyUp = () => {
  //   setIsTyping((prev) => !prev)
  // }


  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const {name, value, type} = e.target;
  setFormState(prev => ({...prev, [name] : type === "number" ? 
    /^0/.test(value) ? value.replace(/^0/, "") :
    +value : value}))
  }

  const handleChangeAmenities = (checked:boolean , label:string) => {
    setFormState(prev => {
      const amenities = prev.amenities || [];
      if(checked) {
       return {...prev, amenities: [...amenities, label]}
      } else {
      return {...prev, amenities: amenities.filter(amenities => amenities !== label)}
      }
    })
  }
    

  const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()


    if(!formState.pricingType) console.log("please pick a renatl type!")
    
    try {
       const data = {...formState}
      if(!id) return; 
      await updateListing(id, data)
    } catch (error) {
      console.error(error);
    }
  }


  const handleImageChange = (e:ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const fileList = e.target.files;
    if(!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if(!file.type.startsWith("image/")) { console.error("please select an image file.") }
    const fileArray = Array.from(fileList);
    const readers = fileArray.map((file) => {
      return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        } 
        reader.readAsDataURL(file);
       
      })
    });
    

    Promise.all(readers).then((results) => {
       setImagesPreview((prev) => [...prev, ...results]);
       setFormState((prev) => ({...prev,images:[...prev.images, ...results]}))
       })
    
  }


  const removeImg = (index:number) => {
   setImagesPreview((prev) => prev.filter((_, i) => i !== index))
   setFormState((p) => ({...p, images:p.images.filter((_,i) => i !== index )}))
   if(fileInputRef.current){ fileInputRef.current.value = '' }
  }


   const handleDragOver = (e:React.DragEvent<HTMLLabelElement>) => e.preventDefault()
  

  
   const handleDrop = (e:React.DragEvent<HTMLLabelElement>) => {
     e.preventDefault();
     if(!e.dataTransfer.files) return;
    const fileArray = Array.from(e.dataTransfer.files);
    const newImages = fileArray.map(file => ( URL.createObjectURL(file)))
    const readers = fileArray.map((file) => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result?.toString());
        } 
        reader.readAsDataURL(file);

       
      })
    });
    Promise.all(readers).then(results => {
      const Results = results as string[] 
      setFormState((prev) => ({...prev, images:[...prev.images, ...Results]}))
    }).catch(err => console.error("one failed", err))
    setImagesPreview((prev) => [...prev, ...newImages]);
    
    
   }
 
   const lang = i18n.language;
    const messages = t("backendMessages", {ns:"messages", returnObjects:true}) as Record<string , string>
  const msg = messages[message ?? "default"];
  const errMsg = messages[error ?? "default"]


    //  translations 
  
    const facilities = t("card.facilities", {ns:"card", returnObjects:true}) as Record<string, Facilities>

  return (
 
    <motion.div
    initial={{opacity:0, y:20}}
    animate={{y:0, opacity:1}}
    transition={{duration:0.5}} className="relative h-auto mt-24 p-2 sm:p-4 ">
       
        <div className="max-w-5xl mx-auto space-y-0 py-4 sm:py-8">
          <div className="pb-4">
            
          </div>
            <div className="bg-base-300 rounded-xl p-6 shadow-2xl">
              
               <div className="text-center pb-10">
              <h1 className="lg:text-4xl md:text-3xl text-2xl font-black mb-4">
                  {t("updateListing.titles.header", {ns : "headers"})}
                </h1>
                <p className="md:text-lg text-sm">
                    {t("updateListing.titles.subheader", {ns : "headers"})}
                </p>
               </div>

            <form onKeyDown={e => e.key === "Enter" && e.target instanceof HTMLInputElement && e.preventDefault()}
               onSubmit={handleSubmit} className="flex flex-col gap-6 h-auto">
                <label>
                <p className="lg:text-lg md:text-md text-sm font-semibold mb-2">
                  {t("labels.title", {ns:"common"})}
                </p>
                <input value={formState.title} name="title" onChange={handleChange}
                 type="text" className="input input-bordered w-full lg:text-md text-sm placeholder-base-content/60"
                 placeholder={ t("placeholders.title", {ns:"common"})} />
               </label>

                <label>
                <p className="lg:text-lg md:text-md text-sm font-semibold mb-2">
                   {t("labels.description", {ns:"common"})}
                </p>
                <textarea value={formState.description} name="description" onChange={handleChange}
                 className="textarea textarea-bordered w-full lg:text-md text-sm !pt-2.5 placeholder-base-content/60
                 resize-none "
                 rows={3} placeholder={ t("placeholders.description", {ns:"common"})} />
               </label>

                <label>
                <p className="lg:text-lg md:text-md text-sm font-semibold mb-2">
                   {t("labels.location", {ns:"common"})}
                </p>
                <input value={formState.location} name="location" onChange={handleChange}
                  type="text" className="input input-bordered w-full lg:text-md text-sm placeholder-base-content/60
                  "
                  placeholder={ t("placeholders.location", {ns:"common"})} />
               </label>

                <label>
                <p className="lg:text-lg md:text-md text-sm font-semibold mb-2">
                   {t("labels.pricingType", {ns:"common"})}
                </p>
              <select className={`select select-bordered w-full lg:text-md text-sm 
              ${formState.pricingType === "placeholder" ? "text-bseplaceholder-base-content/60":"text-base-content"}
              `} name="pricingType"
               value={formState.pricingType} 
                onChange={handleChange}>
              <option disabled value="placeholder" className="">
                {t("placeholders.pricingType", {ns:"common"})}
              </option>
               <option className="text-base-content" value="nightly">
                {t("content.filters.category.content.options.nightly", {ns:"sidebar"})}
               </option>
                <option  className="text-base-content" value="monthly">
                  {t("content.filters.category.content.options.monthly", {ns:"sidebar"})}
                </option>
                 <option  className="text-base-content" value="one_time">
                  {t("content.filters.category.content.options.forSale", {ns:"sidebar"})}
                 </option>
              </select>
              </label>
              

               <div className="flex flex-col w-full ">
                 <p className="lg:text-lg md:text-md text-sm font-semibold mb-2">
                 {t("labels.uploadImages.title", {ns:"common"})}
                 </p>
                <label onDrop={handleDrop} onDragOver={handleDragOver}
                 className="cursor-pointer border border-dashed border-base-content
                 px-4 py-20 rounded-xl text-center flex flex-col items-center 
                 justify-center group hover:border-primary transition-colors duration-300 mb-2">
                 <div className="p-4 bg-base-content text-base-300 bg-opacity-50 rounded-full group-hover:bg-primary group-hover:text-primary-content
                  transition-colors duration-300 mb-2"> 
                 <Upload size={30}/></div>
                <p className=" lg:text-md text-sm"> 
                  <span className="text-primary">{t("labels.uploadImages.label", {ns:"common"}).split(",")[0]}</span>
                   {t("labels.uploadImages.label", {ns:"common"}).split(",")[1]}</p>

                   
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple
                 name="images" onChange={handleImageChange} />
               </label>
               </div>

               {imagesPreview.length === 0 ? (<></>) : (
               <div className="space-y-2">
                   <h1 className="text-xl">{t("labels.uploadImages.gallery", {ns:"common"})}</h1>
                  <div className="w-full bg-base-content/10 border border-base-content/20 p-4 rounded-md overflow-hidden">
                 <div className="flex flex-wrap items-center gap-2  ">
                  { imagesPreview && (imagesPreview.map((image, index) => (
                    <div key={index} className="relative">
                        <img className={`max-w-[200px] max-h-[80px] pointer-events-none select-none
                         object-contain rounded-lg border border-zinc-500`} src={image.toString()} alt="Preview" />
                         <button onClick={() => removeImg(index)}
                          className="absolute -top-1 -right-1 p-1
                           bg-white hover:text-white hover:bg-red-500 
                           transition-colors duration-200 text-black rounded-full"><X className="size-3" /></button>
                    </div>
                  ))) }
                 </div>
                 
               </div>
               </div>
               )}

                
              <div>
              <h1 className="lg:text-lg text-md font-bold mb-1">
                {t("labels.amenities.text", {ns:"common"})}
              </h1>
  <span className="lg:text-sm text-xs">
      {t("labels.amenities.subtext", {ns:"common"})}
  </span>
              

                 <div className="flex flex-wrap gap-2 mt-4">
                            {amenities.map(({icon:Icon, label}, index) => (
                            <label key={index} className='flex items-center gap-2 cursor-pointer
                           bg-base-300 text-base-content border border-base-content/50 p-2 px-4 
                             rounded-md hover:bg-base-200 select-none transition-all duration-200 '>
                            <input type="checkbox" className='hidden peer' name="amenities"
                             checked={formState.amenities?.includes(label)}
                             onChange={(e) => handleChangeAmenities(e.target.checked, label)}
                             />
                             <span className='peer-checked:text-green-600'>
                              {facilities[label]}
                              </span>
                             <Icon className='peer-checked:text-green-600'/>
                             </label>
                            ))}
                       
                       </div>
              </div>

              <div>
  <h1 className="lg:text-lg text-md font-bold mb-1">  {t("labels.specs.text", {ns:"common"})}</h1>
  <span className="lg:text-sm text-xs">{t("labels.specs.subtext", {ns:"common"})}</span>
  <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
    <div>
      <span className="mb-2 md:text-md text-sm">{t("labels.specs.beds", {ns:"common"})}</span>
      <label className="flex flex-col relative">
        <input type="number" name="beds" value={formState.beds} 
       onChange={handleChange} min={0} className={`input input-bordered ${lang === "ar" ? "pr-2" : "pr-28"}`} />

        <CounterBtn onClick={(e) => {e.preventDefault;
          setFormState(prev => ({...prev, beds: prev.beds ? prev.beds + 1 : 1 }))}} btnType="increasement"/>

       {!formState.beds || formState.beds < 1 ? (<></>) : (
        <>
           <CounterBtn btnType="decreasement"  onClick={(e) => {e.preventDefault;
             setFormState(prev => ({...prev, beds: prev.beds &&
          prev.beds <= 0 ? 0 : prev.beds && prev.beds - 1  }))}}/>
        </>
       )}
      </label>
    </div>

    <div className="relative">
      <span className="mb-2 md:text-md text-sm ">{t("labels.specs.bathrooms", {ns:"common"})}</span>
      <label className="flex flex-col relative">
        <input type="number"  name="bathrooms" value={formState.bathrooms} 
        onChange={handleChange} min={0} max={1000} className={`input input-bordered ${lang === "ar" ? "pr-2" : "pr-28"}`} />
       <CounterBtn btnType="increasement" onClick={(e) => {e.preventDefault();
         setFormState(prev => ({...prev, bathrooms: prev.bathrooms ? prev.bathrooms + 1 : 1 }))}}/>
        

          {!formState.bathrooms || formState.bathrooms < 1 ? (<></>) : (
        <>
           <CounterBtn btnType="decreasement"  onClick={(e) => {e.preventDefault();
            setFormState(prev => ({...prev, bathrooms: prev.bathrooms &&
          prev.bathrooms <= 0 ? 0 : prev.bathrooms && prev.bathrooms - 1  }))}}/>
          </>
       )}
      </label>
    </div>

    <div>
      <span className="mb-2 md:text-md text-sm">{t("labels.specs.bedrooms", {ns:"common"})}</span>
      <label className="flex flex-col relative">
        <input type="number"  name="bedrooms" value={formState.bedrooms} 
         onChange={handleChange} min={0} max={1000} className={`input input-bordered ${lang === "ar" ? "pr-2" : "pr-28"}`} />
       <CounterBtn  onClick={(e) => {e.preventDefault();
         setFormState(prev => ({...prev, bedrooms: prev.bedrooms ? prev.bedrooms + 1 : 1 }))}} btnType="increasement"/>

           {!formState.bedrooms || formState.bedrooms < 1 ? (<></>) : (
        <>
          <CounterBtn onClick={(e) => {e.preventDefault();
            setFormState(prev => ({...prev, bedrooms: prev.bedrooms &&
          prev.bedrooms <= 0 ? 0 : prev.bedrooms && prev.bedrooms - 1  }))}} btnType="decreasement"/>
        </>
           )}
      </label>
    </div>

    <div>
      <span className="mb-2 md:text-md text-sm">{t("labels.specs.size", {ns:"common"})}</span>
      <label className="flex flex-col relative">
        <input type="number"  name="size" value={formState.size} 
         onChange={handleChange} min={0} max={1000} className={`input input-bordered ${lang === "ar" ? "pr-2" : "pr-28"}`} />
       <CounterBtn onClick={(e) => {e.preventDefault(); 
        setFormState(prev => ({...prev, size: prev.size ? prev.size + 1 : 1 }))}} btnType="increasement"/>

            {!formState.size || formState.size < 1 ? (<></>) : (
        <>
           <CounterBtn  onClick={(e) => {e.preventDefault; setFormState(prev => ({...prev, size: prev.size &&
          prev.size <= 0 ? 0 : prev.size && prev.size - 1  }))}} btnType="decreasement"/>
        </>
          )}
      </label>
    </div>

    <div>
      <span className="mb-2 md:text-md text-sm">{t("labels.specs.floors", {ns:"common"})}</span>
      <label className="flex flex-col relative">
        <input type="number"  name="floor" value={formState.floor}
         onChange={handleChange} min={0} max={1000} className={`input input-bordered ${lang === "ar" ? "pr-2" : "pr-28"}`} />
       <CounterBtn onClick={(e) => {e.preventDefault();
         setFormState(prev => ({...prev, floor: prev.floor ? prev.floor + 1 : 1 }))}} btnType="increasement" />

           {!formState.floor || formState.floor < 1 ? (<></>) : (
        <>
          <CounterBtn onClick={(e) => {e.preventDefault();
            setFormState(prev => ({...prev, floor: prev.floor &&
          prev.floor <= 0 ? 0 : prev.floor && prev.floor - 1  }))}} btnType="decreasement" />
        </>
        )}
      </label>
    </div>

    <div>
      <span className="mb-2 md:text-md text-sm">{t("labels.specs.rentalPrice", {ns:"common"})}</span>
      <label className="flex flex-col relative">
        <input type="number" name="price" value={formState.price}
        onChange={handleChange} min={0} max={1000} className={`input input-bordered ${lang === "ar" ? "pr-2" : "pr-28"}`} />
       <CounterBtn onClick={(e) => 
        {e.preventDefault; setFormState(prev => ({...prev, price: prev.price ? prev.price + 1 : 1 }))}} btnType="increasement"/>

            {!formState.price || formState.price < 1 ? (<></>) : (
        <>
           <CounterBtn onClick={(e) => { 
            e.preventDefault()
            setFormState(prev => ({...prev, price: prev.price &&
          prev.price <= 0 ? 0 : prev.price && prev.price - 1 }))
           }} btnType="decreasement" />
        </>
        )}
      </label>
    </div>

  </div>
</div>
 <button type="submit" className="btn w-full btn-primary ">{!isLoading ?
                (<>{t("buttons.updateListing", {ns:"common"})} <PenBox/></>) : (
                <><Loader className="animate-spin text-center mx-auto size-5"/></>
               )}</button>
              
              </form>
            </div>
        </div>
      
    </motion.div>
   

  )
}

export default UpdateListingPage
