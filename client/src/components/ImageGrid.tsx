

//  import React, {  type SetStateAction } from 'react'
// import type { ApiData } from '../store/listingStore'
//  interface ImageGridProps {
//     setCarousel : React.Dispatch<SetStateAction<boolean>>
//     images : ApiData["images"]
//  }

//  const ImageGrid = ({setCarousel, images } : ImageGridProps) => {
//    const handleCarouselClick = (length : number) => {
//  if(length < 2) return; 
//   setCarousel((prev) => !prev)
//  }
//    return (
//     <button onClick={() => handleCarouselClick(images.length)} className={`overflow-hidden rounded-2xl
//               ${images.length < 2 ? "cursor-default" : "hover:scale-[0.98]"} transition-all duration-300`}>
//                <div className={`grid ${images.length === 3 ? "lg:grid-cols-2" : "grid-cols-1"} `}>
//                  {images.map((img, index) => (
//                   <div key={index} className={`${images.length === 3 && index === images.length - 1 
//                   ? "last:col-span-2" : "last:col-span-1"} `}>
//                     <img className="size-full object-cover" src={typeof img === "string"? img :
//                        img?.url.toString()} alt="image" />
                   
//                   </div>
//                 ))}
//                </div>
//               </button>
//    )
//  }
 
//  export default ImageGrid
 