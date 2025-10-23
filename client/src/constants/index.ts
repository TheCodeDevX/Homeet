import { AirVent, BedDouble, Bell, BellIcon, Building2, Car, Cat, Dumbbell,
    Flame, Languages, Menu, MessageCircle, Palette, PieChart, PlusCircle,
  TreeDeciduousIcon, Utensils, WashingMachine, Waves, Wifi } from "lucide-react";
import {  type ComponentType, type SVGProps } from "react";
import { RiHome2Line, RiLogoutCircleLine } from "react-icons/ri";
import type { Lang } from "../store/languagesStore";

 export type Links = "HOME" | "POST_LISTING" | "DASHBOARD" | "NOTIFICATION" | "CHAT"
 export type Tooltips = "NAV" | "NOTIFS" | "CHANGE_THEME" | "CHANGE_LANG" | "LOGOUT" | "PROFILE"
 
 interface Link {
    href : string
    icon : ComponentType<SVGProps<SVGSVGElement>>
    key: Links
    classes: string
    size : string
    id:number
 }

  interface IconButton {
    icon? : ComponentType<SVGProps<SVGSVGElement>>
    key: Tooltips
    classes: string
    iconClasses?: string
    action?: "logout" | "navigate" | "changeTheme" | "changeLang"
 }
 export type FacilitiesKeys =
  | "WIFI"
  | "FURNISHED"
  | "PARKING"
  | "AIR_CONDITIONING"
  | "KITCHEN_ACCESS"
  | "PET_FRIENDLY"
  | "WASHER_DRYER"
  | "BALCONY"
  | "GARDEN"
  | "GYM"
  | "FIREPLACE"
  | "POOL";


 export type Facilities = "Wi-Fi"|
                "Furnished"|
                "Parking"|
                "Air Conditioning"|
                "Kitchen Access"|
                "Pet-Friendly"|
                "Washer / Dryer"|
                "Balcony"|
                "Garden"|
                "Gym"|
                "Fireplace"|
                "Pool"



 interface Amenities {
    icon: ComponentType<SVGProps<SVGSVGElement>>
    label:  Facilities
    key: FacilitiesKeys
 }

 export const links : Link[] = [
    {id:0, href : "/", icon : RiHome2Line, size :"size-5",
       key: "HOME", classes : "flex items-center gap-2 text_hover" },

    {id:1, href : "/post-listing", icon : PlusCircle, size :"size-5",
       key: "POST_LISTING", classes : "flex items-center gap-2 text_hover text-nowrap" },

    {id:2, href : "/notification", icon : BellIcon, size :"size-5",
       key: "NOTIFICATION", classes : "flex items-center gap-2 text_hover" },

    {id:3, href : "/chat", icon : MessageCircle, size :"size-5", key: "CHAT",
       classes : "flex items-center gap-2 text_hover" },

    {id:4, href : "/dashboard", icon : PieChart, size :"size-5", key: "DASHBOARD",
       classes : "flex items-center gap-2 text_hover" },
 ]

 export const iconButtons : IconButton[] = [
  
    {classes: "icon_hover", icon:Menu, key : "NAV",
   iconClasses: "group-hover:scale-110 duration-100 ease-in-out size-5", action:"navigate" },

   {classes: "icon_hover", icon:Palette, key : "CHANGE_THEME", action: "changeTheme",
   iconClasses: "group-hover:scale-110 duration-100 ease-in-out size-5", },

    {classes: "icon_hover", icon:Languages, key : "CHANGE_LANG", action:"changeLang",
   iconClasses: "group-hover:scale-110 duration-100 ease-in-out size-5", },

  //   {classes: "icon_hover", icon:Bell, key : "NOTIFS",
  //  iconClasses: "group-hover:scale-110 duration-100 ease-in-out size-5", },

    {classes: "icon_hover", icon:RiLogoutCircleLine, key : "LOGOUT",
   iconClasses: "group-hover:scale-110 duration-100 ease-in-out size-5", action:"logout"  },

    {classes:"", key : "PROFILE", icon:undefined},

 ]

export const amenities: Amenities[] = [
  { icon: Wifi, label: "Wi-Fi", key:"WIFI" },
  { icon: BedDouble, label: "Furnished", key:"FURNISHED" },
  { icon: Car, label: "Parking", key:"PARKING" },
  { icon: AirVent, label: "Air Conditioning", key:"AIR_CONDITIONING" },
  { icon: Utensils, label: "Kitchen Access", key: "KITCHEN_ACCESS" },
  { icon: Cat, label: "Pet-Friendly", key:"PET_FRIENDLY" },
  { icon: WashingMachine, label: "Washer / Dryer", key:"WASHER_DRYER" },
  { icon: Building2, label: "Balcony", key:"BALCONY" },
  { icon: TreeDeciduousIcon, label: "Garden", key:"GARDEN" },
  { icon: Dumbbell, label: "Gym", key:"GYM" },
  { icon: Flame, label: "Fireplace", key:"FIREPLACE" },
  { icon: Waves, label: "Pool", key:"POOL" },
];



export const specs = [
  { key : "beds", label : "Beds"},
  { key : "bathrooms", label : "Bathrooms"},
  { key : "bedrooms", label : "Bedrooms"},
  { key: "size", label: "Size (m²)"},
  { key: "floor", label: "Floor"},
  { key : "price", label :"Rent price ($)"},
]


 export type Theme = 
  | "light"
  | "dark"
  | "cupcake"
  | "forest"
  | "bumblebee"
  | "emerald"
  | "corporate"
  | "synthwave"
  | "retro"
  | "cyberpunk"
  | "valentine"
  | "halloween"
  | "garden"
  | "aqua"
  | "lofi"
  | "pastel"
  | "fantasy"
  | "wireframe"
  | "black"
  | "luxury"
  | "dracula"
  | "cmyk"
  | "autumn"
  | "business"
  | "acid"
  | "lemonade"
  | "night"
  | "coffee"
  | "winter"
  | "dim"
  | "nord"
  | "sunset";


interface ThemeOptionsTypes {
     name: Theme;
    label: string;
    colors: string[];
 }

export const THEMES : ThemeOptionsTypes[] = [
  {
    name: "light",
    label: "Light",
    colors: ["#ffffff", "#5a67d8", "#8b5cf6", "#1a202c"],
  },
  {
    name: "dark",
    label: "Dark",
    colors: ["#1f2937", "#8b5cf6", "#ec4899", "#1a202c"],
  },
  {
    name: "cupcake",
    label: "Cupcake",
    colors: ["#f5f5f4", "#65c3c8", "#ef9fbc", "#291334"],
  },
  {
    name: "forest",
    label: "Forest",
    colors: ["#1f1d1d", "#3ebc96", "#70c217", "#e2e8f0"],
  },
  {
    name: "bumblebee",
    label: "Bumblebee",
    colors: ["#ffffff", "#f8e36f", "#f0d50c", "#1c1917"],
  },
  {
    name: "emerald",
    label: "Emerald",
    colors: ["#ffffff", "#66cc8a", "#3b82f6", "#1e3a8a"],
  },
  {
    name: "corporate",
    label: "Corporate",
    colors: ["#ffffff", "#4b6bfb", "#7b92b2", "#1d232a"],
  },
  {
    name: "synthwave",
    label: "Synthwave",
    colors: ["#2d1b69", "#e779c1", "#58c7f3", "#f8f8f2"],
  },
  {
    name: "retro",
    label: "Retro",
    colors: ["#e4d8b4", "#ea6962", "#6aaa64", "#282425"],
  },
  {
    name: "cyberpunk",
    label: "Cyberpunk",
    colors: ["#ffee00", "#ff7598", "#75d1f0", "#1a103d"],
  },
  {
    name: "valentine",
    label: "Valentine",
    colors: ["#f0d6e8", "#e96d7b", "#a991f7", "#37243c"],
  },
  {
    name: "halloween",
    label: "Halloween",
    colors: ["#0d0d0d", "#ff7800", "#006400", "#ffffff"],
  },
  {
    name: "garden",
    label: "Garden",
    colors: ["#e9e7e7", "#ec4899", "#16a34a", "#374151"],
  },

  {
    name: "aqua",
    label: "Aqua",
    colors: ["#193549", "#4cd4e3", "#9059ff", "#f8d766"],
  },
  {
    name: "lofi",
    label: "Lofi",
    colors: ["#0f0f0f", "#1a1919", "#232323", "#2c2c2c"],
  },
  {
    name: "pastel",
    label: "Pastel",
    colors: ["#f7f3f5", "#d1c1d7", "#a1e3d8", "#4a98f1"],
  },
  {
    name: "fantasy",
    label: "Fantasy",
    colors: ["#ffe7d6", "#a21caf", "#3b82f6", "#f59e0b"],
  },
  {
    name: "wireframe",
    label: "Wireframe",
    colors: ["#e6e6e6", "#b3b3b3", "#b3b3b3", "#888888"],
  },
  {
    name: "black",
    label: "Black",
    colors: ["#000000", "#191919", "#313131", "#4a4a4a"],
  },
  {
    name: "luxury",
    label: "Luxury",
    colors: ["#171618", "#1e293b", "#94589c", "#d4a85a"],
  },
  {
    name: "dracula",
    label: "Dracula",
    colors: ["#282a36", "#ff79c6", "#bd93f9", "#f8f8f2"],
  },
  {
    name: "cmyk",
    label: "CMYK",
    colors: ["#f0f0f0", "#0891b2", "#ec4899", "#facc15"],
  },
  {
    name: "autumn",
    label: "Autumn",
    colors: ["#f2f2f2", "#8c1f11", "#f28c18", "#6f4930"],
  },
  {
    name: "business",
    label: "Business",
    colors: ["#f5f5f5", "#1e40af", "#3b82f6", "#f97316"],
  },
  {
    name: "acid",
    label: "Acid",
    colors: ["#110e0e", "#ff00f2", "#ff7a00", "#99ff01"],
  },
  {
    name: "lemonade",
    label: "Lemonade",
    colors: ["#ffffff", "#67e8f9", "#f5d742", "#2c3333"],
  },
  {
    name: "night",
    label: "Night",
    colors: ["#0f172a", "#38bdf8", "#818cf8", "#e2e8f0"],
  },
  {
    name: "coffee",
    label: "Coffee",
    colors: ["#20161f", "#dd9866", "#497174", "#eeeeee"],
  },
  {
    name: "winter",
    label: "Winter",
    colors: ["#ffffff", "#0284c7", "#d946ef", "#0f172a"],
  },
  {
    name: "dim",
    label: "Dim",
    colors: ["#1c1c27", "#10b981", "#ff5a5f", "#0f172a"],
  },
  {
    name: "nord",
    label: "Nord",
    colors: ["#eceff4", "#5e81ac", "#81a1c1", "#3b4252"],
  },
  {
    name: "sunset",
    label: "Sunset",
    colors: ["#1e293b", "#f5734c", "#ec4899", "#ffffff"],
  },
];

export const languages : {language : string , symbol : Lang}[] = [
  {language : "English", symbol : "en"},
   {language : "العربية", symbol : "ar"},
    {language : "Français", symbol : "fr"},
     {language : "Español", symbol : "es"}
];


export const lightThemes = [
  "light",
  "nord",
  "wireframe",
  "cupcake",
  "emerald",
  "corporate",
  "valentine",
  "garden",
  "lofi",
  "pastel",
  "fantasy",
  "cmyk",
  "autumn",
  "acid",
  "lemonade",
  "winter",
  "bumblebee",
]

export const currencies = [ 
  { "code": "USD", "symbol": "$", "name": "US Dollar" },
  { "code": "EUR", "symbol": "€", "name": "Euro" },
  { "code": "GBP", "symbol": "£", "name": "British Pound Sterling" },
  { "code": "JPY", "symbol": "¥", "name": "Japanese Yen" },
  { "code": "CAD", "symbol": "C$", "name": "Canadian Dollar" },
  { "code": "AUD", "symbol": "A$", "name": "Australian Dollar" },
  { "code": "CHF", "symbol": "CHF", "name": "Swiss Franc" },
  { "code": "CNY", "symbol": "¥", "name": "Chinese Yuan" },
  { "code": "SAR", "symbol": "SAR", "name": "Saudi Riyal" },
  { "code": "AED", "symbol": "AED", "name": "UAE Dirham" },
  { "code": "EGP", "symbol": "EGP", "name": "Egyptian Pound" },
  { "code": "MAD", "symbol": "MAD", "name": "Moroccan Dirham" },
  { "code": "BRL", "symbol": "R$", "name": "Brazilian Real" },
  { "code": "INR", "symbol": "₹", "name": "Indian Rupee" },
  { "code": "TRY", "symbol": "₺", "name": "Turkish Lira" },
  { "code": "ZAR", "symbol": "R", "name": "South African Rand" },
  { "code": "SGD", "symbol": "S$", "name": "Singapore Dollar" },
  { "code": "HKD", "symbol": "HK$", "name": "Hong Kong Dollar" }
]

export const prefixCurrencySymbols = ["USD", "EUR", "JPY", "CAD", "AUD", "JPY", "BRL",
   "INR", "TRY", "ZAR", "SGD", "HKD"];