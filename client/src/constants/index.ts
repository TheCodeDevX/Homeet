import { AirVent, BedDouble, Bell, BellIcon, Building2, Car, Cat, Dumbbell,
    Flame, Languages, Menu, MessageCircle, Palette, PieChart, PlusCircle,
  TreeDeciduousIcon, Utensils, WashingMachine, Waves, Wifi } from "lucide-react";
import {  type ComponentType, type SVGProps } from "react";
import { RiHome2Line, RiLogoutCircleLine } from "react-icons/ri";
import type { Lang } from "../store/languagesStore";

 export type Links = "HOME" | "POST_LISTING" | "DASHBOARD" | "NOTIFICATIONS" | "CHAT"
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
       key: "NOTIFICATIONS", classes : "flex items-center gap-2 text_hover" },

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




export const countries = [
  { name: "Ascension Island", code: "AC", phone: 247 },
  { name: "Andorra", code: "AD", phone: 376 },
  { name: "United Arab Emirates", code: "AE", phone: 971 },
  { name: "Afghanistan", code: "AF", phone: 93 },
  { name: "Antigua and Barbuda", code: "AG", phone: 1268 },
  { name: "Anguilla", code: "AI", phone: 1264 },
  { name: "Albania", code: "AL", phone: 355 },
  { name: "Armenia", code: "AM", phone: 374 },
  { name: "Angola", code: "AO", phone: 244 },
  { name: "Argentina", code: "AR", phone: 54 },
  { name: "American Samoa", code: "AS", phone: 1684 },
  { name: "Austria", code: "AT", phone: 43 },
  { name: "Australia", code: "AU", phone: 61 },
  { name: "Aruba", code: "AW", phone: 297 },
  { name: "Åland Islands", code: "AX", phone: 358 },
  { name: "Azerbaijan", code: "AZ", phone: 994 },
  { name: "Bosnia and Herzegovina", code: "BA", phone: 387 },
  { name: "Barbados", code: "BB", phone: 1246 },
  { name: "Bangladesh", code: "BD", phone: 880 },
  { name: "Belgium", code: "BE", phone: 32 },
  { name: "Burkina Faso", code: "BF", phone: 226 },
  { name: "Bulgaria", code: "BG", phone: 359 },
  { name: "Bahrain", code: "BH", phone: 973 },
  { name: "Burundi", code: "BI", phone: 257 },
  { name: "Benin", code: "BJ", phone: 229 },
  { name: "Saint Barthélemy", code: "BL", phone: 590 },
  { name: "Bermuda", code: "BM", phone: 1441 },
  { name: "Brunei Darussalam", code: "BN", phone: 673 },
  { name: "Bolivia", code: "BO", phone: 591 },
  { name: "Caribbean Netherlands", code: "BQ", phone: 599 },
  { name: "Brazil", code: "BR", phone: 55 },
  { name: "Bahamas", code: "BS", phone: 1242 },
  { name: "Bhutan", code: "BT", phone: 975 },
  { name: "Botswana", code: "BW", phone: 267 },
  { name: "Belarus", code: "BY", phone: 375 },
  { name: "Belize", code: "BZ", phone: 501 },
  { name: "Canada", code: "CA", phone: 1 },
  { name: "Cocos (Keeling) Islands", code: "CC", phone: 61 },
  { name: "Congo, Democratic Republic of", code: "CD", phone: 243 },
  { name: "Central African Republic", code: "CF", phone: 236 },
  { name: "Congo", code: "CG", phone: 242 },
  { name: "Switzerland", code: "CH", phone: 41 },
  { name: "Côte d'Ivoire", code: "CI", phone: 225 },
  { name: "Cook Islands", code: "CK", phone: 682 },
  { name: "Chile", code: "CL", phone: 56 },
  { name: "Cameroon", code: "CM", phone: 237 },
  { name: "China", code: "CN", phone: 86 },
  { name: "Colombia", code: "CO", phone: 57 },
  { name: "Costa Rica", code: "CR", phone: 506 },
  { name: "Cuba", code: "CU", phone: 53 },
  { name: "Cape Verde", code: "CV", phone: 238 },
  { name: "Curaçao", code: "CW", phone: 599 },
  { name: "Christmas Island", code: "CX", phone: 61 },
  { name: "Cyprus", code: "CY", phone: 357 },
  { name: "Czech Republic", code: "CZ", phone: 420 },
  { name: "Germany", code: "DE", phone: 49 },
  { name: "Djibouti", code: "DJ", phone: 253 },
  { name: "Denmark", code: "DK", phone: 45 },
  { name: "Dominica", code: "DM", phone: 1767 },
  { name: "Dominican Republic", code: "DO", phone: 1809 },
  { name: "Algeria", code: "DZ", phone: 213 },
  { name: "Ecuador", code: "EC", phone: 593 },
  { name: "Estonia", code: "EE", phone: 372 },
  { name: "Egypt", code: "EG", phone: 20 },
  { name: "Western Sahara", code: "EH", phone: 212 },
  { name: "Eritrea", code: "ER", phone: 291 },
  { name: "Spain", code: "ES", phone: 34 },
  { name: "Ethiopia", code: "ET", phone: 251 },
  { name: "Finland", code: "FI", phone: 358 },
  { name: "Fiji", code: "FJ", phone: 679 },
  { name: "Falkland Islands", code: "FK", phone: 500 },
  { name: "Micronesia", code: "FM", phone: 691 },
  { name: "Faroe Islands", code: "FO", phone: 298 },
  { name: "France", code: "FR", phone: 33 },
  { name: "Gabon", code: "GA", phone: 241 },
  { name: "United Kingdom", code: "GB", phone: 44 },
  { name: "Grenada", code: "GD", phone: 1473 },
  { name: "Georgia", code: "GE", phone: 995 },
  { name: "French Guiana", code: "GF", phone: 594 },
  { name: "Guernsey", code: "GG", phone: 441481 },
  { name: "Ghana", code: "GH", phone: 233 },
  { name: "Gibraltar", code: "GI", phone: 350 },
  { name: "Greenland", code: "GL", phone: 299 },
  { name: "Gambia", code: "GM", phone: 220 },
  { name: "Guinea", code: "GN", phone: 224 },
  { name: "Guadeloupe", code: "GP", phone: 590 },
  { name: "Equatorial Guinea", code: "GQ", phone: 240 },
  { name: "Greece", code: "GR", phone: 30 },
  { name: "Guatemala", code: "GT", phone: 502 },
  { name: "Guam", code: "GU", phone: 1671 },
  { name: "Guinea-Bissau", code: "GW", phone: 245 },
  { name: "Guyana", code: "GY", phone: 592 },
  { name: "Hong Kong", code: "HK", phone: 852 },
  { name: "Honduras", code: "HN", phone: 504 },
  { name: "Croatia", code: "HR", phone: 385 },
  { name: "Haiti", code: "HT", phone: 509 },
  { name: "Hungary", code: "HU", phone: 36 },
  { name: "Indonesia", code: "ID", phone: 62 },
  { name: "Ireland", code: "IE", phone: 353 },
  { name: "Israel", code: "IL", phone: 972 },
  { name: "Isle of Man", code: "IM", phone: 441624 },
  { name: "India", code: "IN", phone: 91 },
  { name: "British Indian Ocean Territory", code: "IO", phone: 246 },
  { name: "Iraq", code: "IQ", phone: 964 },
  { name: "Iran", code: "IR", phone: 98 },
  { name: "Iceland", code: "IS", phone: 354 },
  { name: "Italy", code: "IT", phone: 39 },
  { name: "Jersey", code: "JE", phone: 441534 },
  { name: "Jamaica", code: "JM", phone: 1876 },
  { name: "Jordan", code: "JO", phone: 962 },
  { name: "Japan", code: "JP", phone: 81 },
  { name: "Kenya", code: "KE", phone: 254 },
  { name: "Kyrgyzstan", code: "KG", phone: 996 },
  { name: "Cambodia", code: "KH", phone: 855 },
  { name: "Kiribati", code: "KI", phone: 686 },
  { name: "Comoros", code: "KM", phone: 269 },
  { name: "Saint Kitts and Nevis", code: "KN", phone: 1869 },
  { name: "North Korea", code: "KP", phone: 850 },
  { name: "South Korea", code: "KR", phone: 82 },
  { name: "Kuwait", code: "KW", phone: 965 },
  { name: "Cayman Islands", code: "KY", phone: 1345 },
  { name: "Kazakhstan", code: "KZ", phone: 7 },
  { name: "Lao PDR", code: "LA", phone: 856 },
  { name: "Lebanon", code: "LB", phone: 961 },
  { name: "Saint Lucia", code: "LC", phone: 1758 },
  { name: "Liechtenstein", code: "LI", phone: 423 },
  { name: "Sri Lanka", code: "LK", phone: 94 },
  { name: "Liberia", code: "LR", phone: 231 },
  { name: "Lesotho", code: "LS", phone: 266 },
  { name: "Lithuania", code: "LT", phone: 370 },
  { name: "Luxembourg", code: "LU", phone: 352 },
  { name: "Latvia", code: "LV", phone: 371 },
  { name: "Libya", code: "LY", phone: 218 },
  { name: "Morocco", code: "MA", phone: 212 },
  { name: "Monaco", code: "MC", phone: 377 },
  { name: "Moldova", code: "MD", phone: 373 },
  { name: "Montenegro", code: "ME", phone: 382 },
  { name: "Saint Martin", code: "MF", phone: 590 },
  { name: "Madagascar", code: "MG", phone: 261 },
  { name: "Marshall Islands", code: "MH", phone: 692 },
  { name: "North Macedonia", code: "MK", phone: 389 },
  { name: "Mali", code: "ML", phone: 223 },
  { name: "Myanmar", code: "MM", phone: 95 },
  { name: "Mongolia", code: "MN", phone: 976 },
  { name: "Macao", code: "MO", phone: 853 },
  { name: "Northern Mariana Islands", code: "MP", phone: 1670 },
  { name: "Martinique", code: "MQ", phone: 596 },
  { name: "Mauritania", code: "MR", phone: 222 },
  { name: "Montserrat", code: "MS", phone: 1664 },
  { name: "Malta", code: "MT", phone: 356 },
  { name: "Mauritius", code: "MU", phone: 230 },
  { name: "Maldives", code: "MV", phone: 960 },
  { name: "Malawi", code: "MW", phone: 265 },
  { name: "Mexico", code: "MX", phone: 52 },
  { name: "Malaysia", code: "MY", phone: 60 },
  { name: "Mozambique", code: "MZ", phone: 258 },
  { name: "Namibia", code: "NA", phone: 264 },
  { name: "New Caledonia", code: "NC", phone: 687 },
  { name: "Niger", code: "NE", phone: 227 },
  { name: "Norfolk Island", code: "NF", phone: 672 },
  { name: "Nigeria", code: "NG", phone: 234 },
  { name: "Nicaragua", code: "NI", phone: 505 },
  { name: "Netherlands", code: "NL", phone: 31 },
  { name: "Norway", code: "NO", phone: 47 },
  { name: "Nepal", code: "NP", phone: 977 },
  { name: "Nauru", code: "NR", phone: 674 },
  { name: "Niue", code: "NU", phone: 683 },
  { name: "New Zealand", code: "NZ", phone: 64 },
  { name: "Oman", code: "OM", phone: 968 },
  { name: "Panama", code: "PA", phone: 507 },
  { name: "Peru", code: "PE", phone: 51 },
  { name: "French Polynesia", code: "PF", phone: 689 },
  { name: "Papua New Guinea", code: "PG", phone: 675 },
  { name: "Philippines", code: "PH", phone: 63 },
  { name: "Pakistan", code: "PK", phone: 92 },
  { name: "Poland", code: "PL", phone: 48 },
  { name: "Saint Pierre and Miquelon", code: "PM", phone: 508 },
  { name: "Puerto Rico", code: "PR", phone: 1787 },
  { name: "Palestine", code: "PS", phone: 970 },
  { name: "Portugal", code: "PT", phone: 351 },
  { name: "Palau", code: "PW", phone: 680 },
  { name: "Paraguay", code: "PY", phone: 595 },
  { name: "Qatar", code: "QA", phone: 974 },
  { name: "Réunion", code: "RE", phone: 262 },
  { name: "Romania", code: "RO", phone: 40 },
  { name: "Serbia", code: "RS", phone: 381 },
  { name: "Russia", code: "RU", phone: 7 },
  { name: "Rwanda", code: "RW", phone: 250 },
  { name: "Saudi Arabia", code: "SA", phone: 966 },
  { name: "Solomon Islands", code: "SB", phone: 677 },
  { name: "Seychelles", code: "SC", phone: 248 },
  { name: "Sudan", code: "SD", phone: 249 },
  { name: "Sweden", code: "SE", phone: 46 },
  { name: "Singapore", code: "SG", phone: 65 },
  { name: "Saint Helena", code: "SH", phone: 290 },
  { name: "Slovenia", code: "SI", phone: 386 },
  { name: "Svalbard and Jan Mayen", code: "SJ", phone: 47 },
  { name: "Slovakia", code: "SK", phone: 421 },
  { name: "Sierra Leone", code: "SL", phone: 232 },
  { name: "San Marino", code: "SM", phone: 378 },
  { name: "Senegal", code: "SN", phone: 221 },
  { name: "Somalia", code: "SO", phone: 252 },
  { name: "Suriname", code: "SR", phone: 597 },
  { name: "South Sudan", code: "SS", phone: 211 },
  { name: "São Tomé and Príncipe", code: "ST", phone: 239 },
  { name: "El Salvador", code: "SV", phone: 503 },
  { name: "Sint Maarten", code: "SX", phone: 1721 },
  { name: "Syria", code: "SY", phone: 963 },
  { name: "Eswatini", code: "SZ", phone: 268 },
  { name: "Tristan da Cunha", code: "TA", phone: 290 },
  { name: "Turks and Caicos Islands", code: "TC", phone: 1649 },
  { name: "Chad", code: "TD", phone: 235 },
  { name: "Togo", code: "TG", phone: 228 },
  { name: "Thailand", code: "TH", phone: 66 },
  { name: "Tajikistan", code: "TJ", phone: 992 },
  { name: "Tokelau", code: "TK", phone: 690 },
  { name: "Timor-Leste", code: "TL", phone: 670 },
  { name: "Turkmenistan", code: "TM", phone: 993 },
  { name: "Tunisia", code: "TN", phone: 216 },
  { name: "Tonga", code: "TO", phone: 676 },
  { name: "Turkey", code: "TR", phone: 90 },
  { name: "Trinidad and Tobago", code: "TT", phone: 1868 },
  { name: "Tuvalu", code: "TV", phone: 688 },
  { name: "Taiwan", code: "TW", phone: 886 },
  { name: "Tanzania", code: "TZ", phone: 255 },
  { name: "Ukraine", code: "UA", phone: 380 },
  { name: "Uganda", code: "UG", phone: 256 },
  { name: "United States", code: "US", phone: 1 },
  { name: "Uruguay", code: "UY", phone: 598 },
  { name: "Uzbekistan", code: "UZ", phone: 998 },
  { name: "Vatican City", code: "VA", phone: 379 },
  { name: "Saint Vincent and the Grenadines", code: "VC", phone: 1784 },
  { name: "Venezuela", code: "VE", phone: 58 },
  { name: "British Virgin Islands", code: "VG", phone: 1284 },
  { name: "U.S. Virgin Islands", code: "VI", phone: 1340 },
  { name: "Vietnam", code: "VN", phone: 84 },
  { name: "Vanuatu", code: "VU", phone: 678 },
  { name: "Wallis and Futuna", code: "WF", phone: 681 },
  { name: "Samoa", code: "WS", phone: 685 },
  { name: "Kosovo", code: "XK", phone: 383 },
  { name: "Yemen", code: "YE", phone: 967 },
  { name: "Mayotte", code: "YT", phone: 262 },
  { name: "South Africa", code: "ZA", phone: 27 },
  { name: "Zambia", code: "ZM", phone: 260 },
  { name: "Zimbabwe", code: "ZW", phone: 263 },
];