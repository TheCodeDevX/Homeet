import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";

 interface GsapAnimationProps {
    
    ctx : RefObject<gsap.Context | null>
    tl: RefObject<gsap.core.Timeline | null>
    containerRef:RefObject<HTMLDivElement | null>
    parentRef : RefObject<HTMLDivElement | null>
    state:boolean
    isOpenRef: RefObject<boolean>
    withoutStagger?: boolean


 }

 const useGsapAnimation = ({containerRef, state, isOpenRef, ctx, tl, parentRef, withoutStagger}: GsapAnimationProps) => {
    const Initialvars = {opacity:0, y:100, ease:"back.in", visibility:"visible"};

   useGSAP(() => {
    const elements = gsap.utils.toArray(containerRef.current?.getElementsByTagName("button") as HTMLCollection)
    tl.current = gsap.timeline()
    ctx.current = gsap.context(() => {
    const {current} = tl; 
    if(!state){
    current?.to(containerRef.current, Initialvars)
    .to(containerRef.current, {visibility:"hidden"})
    } else {
     current?.fromTo(containerRef.current, Initialvars,
         { opacity:1, y:0, visibility:"visible", ease:"back.out", duration:1})
      .fromTo(elements,
        {opacity:0, yPercent:100},
      {
      stagger:withoutStagger ? 0 : 0.15,
      opacity:1,
      duration:0.3,
      yPercent:0,
      ease : "circ.inOut"
    }, "<")
    } 
     
    }, parent);
    return () => {
      ctx.current?.revert()
    };
   }, {dependencies:[state], scope:parentRef});

    useEffect(() => {
    isOpenRef.current = state;
    }, [state]);

    

 }

 
  
 
 
 export default useGsapAnimation
 