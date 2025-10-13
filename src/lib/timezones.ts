export interface Timezone {
  value: string;
  label: string;
  display: string;
  region: string;
  offset: string;
}

export const timezones: Timezone[] = [
  // Americas
  { value: "America/New_York", label: "New York", display: "(GMT-5:00) New York", region: "Americas", offset: "-5:00" },
  { value: "America/Chicago", label: "Chicago", display: "(GMT-6:00) Chicago", region: "Americas", offset: "-6:00" },
  { value: "America/Denver", label: "Denver", display: "(GMT-7:00) Denver", region: "Americas", offset: "-7:00" },
  { value: "America/Los_Angeles", label: "Los Angeles", display: "(GMT-8:00) Los Angeles", region: "Americas", offset: "-8:00" },
  { value: "America/Anchorage", label: "Anchorage", display: "(GMT-9:00) Anchorage", region: "Americas", offset: "-9:00" },
  { value: "America/Adak", label: "Adak", display: "(GMT-10:00) Adak", region: "Americas", offset: "-10:00" },
  { value: "Pacific/Honolulu", label: "Honolulu", display: "(GMT-10:00) Honolulu", region: "Americas", offset: "-10:00" },
  { value: "America/Phoenix", label: "Phoenix", display: "(GMT-7:00) Phoenix", region: "Americas", offset: "-7:00" },
  { value: "America/Toronto", label: "Toronto", display: "(GMT-5:00) Toronto", region: "Americas", offset: "-5:00" },
  { value: "America/Vancouver", label: "Vancouver", display: "(GMT-8:00) Vancouver", region: "Americas", offset: "-8:00" },
  { value: "America/Mexico_City", label: "Mexico City", display: "(GMT-6:00) Mexico City", region: "Americas", offset: "-6:00" },
  { value: "America/Sao_Paulo", label: "São Paulo", display: "(GMT-3:00) São Paulo", region: "Americas", offset: "-3:00" },
  { value: "America/Buenos_Aires", label: "Buenos Aires", display: "(GMT-3:00) Buenos Aires", region: "Americas", offset: "-3:00" },
  { value: "America/Caracas", label: "Caracas", display: "(GMT-4:00) Caracas", region: "Americas", offset: "-4:00" },
  { value: "America/Lima", label: "Lima", display: "(GMT-5:00) Lima", region: "Americas", offset: "-5:00" },
  { value: "America/Bogota", label: "Bogotá", display: "(GMT-5:00) Bogotá", region: "Americas", offset: "-5:00" },
  { value: "America/Santiago", label: "Santiago", display: "(GMT-3:00) Santiago", region: "Americas", offset: "-3:00" },
  { value: "America/Havana", label: "Havana", display: "(GMT-5:00) Havana", region: "Americas", offset: "-5:00" },
  { value: "America/Panama", label: "Panama", display: "(GMT-5:00) Panama", region: "Americas", offset: "-5:00" },
  { value: "America/Costa_Rica", label: "Costa Rica", display: "(GMT-6:00) Costa Rica", region: "Americas", offset: "-6:00" },

  // Europe
  { value: "Europe/London", label: "London", display: "(GMT+0:00) London", region: "Europe", offset: "+0:00" },
  { value: "Europe/Paris", label: "Paris", display: "(GMT+1:00) Paris", region: "Europe", offset: "+1:00" },
  { value: "Europe/Berlin", label: "Berlin", display: "(GMT+1:00) Berlin", region: "Europe", offset: "+1:00" },
  { value: "Europe/Rome", label: "Rome", display: "(GMT+1:00) Rome", region: "Europe", offset: "+1:00" },
  { value: "Europe/Madrid", label: "Madrid", display: "(GMT+1:00) Madrid", region: "Europe", offset: "+1:00" },
  { value: "Europe/Brussels", label: "Brussels", display: "(GMT+1:00) Brussels", region: "Europe", offset: "+1:00" },
  { value: "Europe/Amsterdam", label: "Amsterdam", display: "(GMT+1:00) Amsterdam", region: "Europe", offset: "+1:00" },
  { value: "Europe/Vienna", label: "Vienna", display: "(GMT+1:00) Vienna", region: "Europe", offset: "+1:00" },
  { value: "Europe/Prague", label: "Prague", display: "(GMT+1:00) Prague", region: "Europe", offset: "+1:00" },
  { value: "Europe/Budapest", label: "Budapest", display: "(GMT+1:00) Budapest", region: "Europe", offset: "+1:00" },
  { value: "Europe/Warsaw", label: "Warsaw", display: "(GMT+1:00) Warsaw", region: "Europe", offset: "+1:00" },
  { value: "Europe/Stockholm", label: "Stockholm", display: "(GMT+1:00) Stockholm", region: "Europe", offset: "+1:00" },
  { value: "Europe/Copenhagen", label: "Copenhagen", display: "(GMT+1:00) Copenhagen", region: "Europe", offset: "+1:00" },
  { value: "Europe/Oslo", label: "Oslo", display: "(GMT+1:00) Oslo", region: "Europe", offset: "+1:00" },
  { value: "Europe/Helsinki", label: "Helsinki", display: "(GMT+2:00) Helsinki", region: "Europe", offset: "+2:00" },
  { value: "Europe/Athens", label: "Athens", display: "(GMT+2:00) Athens", region: "Europe", offset: "+2:00" },
  { value: "Europe/Istanbul", label: "Istanbul", display: "(GMT+3:00) Istanbul", region: "Europe", offset: "+3:00" },
  { value: "Europe/Moscow", label: "Moscow", display: "(GMT+3:00) Moscow", region: "Europe", offset: "+3:00" },
  { value: "Europe/Lisbon", label: "Lisbon", display: "(GMT+0:00) Lisbon", region: "Europe", offset: "+0:00" },
  { value: "Europe/Dublin", label: "Dublin", display: "(GMT+0:00) Dublin", region: "Europe", offset: "+0:00" },
  { value: "Europe/Zurich", label: "Zurich", display: "(GMT+1:00) Zurich", region: "Europe", offset: "+1:00" },
  { value: "Europe/Geneva", label: "Geneva", display: "(GMT+1:00) Geneva", region: "Europe", offset: "+1:00" },
  { value: "Europe/Kiev", label: "Kyiv", display: "(GMT+2:00) Kyiv", region: "Europe", offset: "+2:00" },
  { value: "Europe/Bucharest", label: "Bucharest", display: "(GMT+2:00) Bucharest", region: "Europe", offset: "+2:00" },
  { value: "Europe/Sofia", label: "Sofia", display: "(GMT+2:00) Sofia", region: "Europe", offset: "+2:00" },
  { value: "Europe/Belgrade", label: "Belgrade", display: "(GMT+1:00) Belgrade", region: "Europe", offset: "+1:00" },
  { value: "Europe/Tallinn", label: "Tallinn", display: "(GMT+2:00) Tallinn", region: "Europe", offset: "+2:00" },
  { value: "Europe/Riga", label: "Riga", display: "(GMT+2:00) Riga", region: "Europe", offset: "+2:00" },
  { value: "Europe/Vilnius", label: "Vilnius", display: "(GMT+2:00) Vilnius", region: "Europe", offset: "+2:00" },

  // Asia
  { value: "Asia/Dubai", label: "Dubai", display: "(GMT+4:00) Dubai", region: "Asia", offset: "+4:00" },
  { value: "Asia/Kabul", label: "Kabul", display: "(GMT+4:30) Kabul", region: "Asia", offset: "+4:30" },
  { value: "Asia/Karachi", label: "Karachi", display: "(GMT+5:00) Karachi", region: "Asia", offset: "+5:00" },
  { value: "Asia/Kolkata", label: "Kolkata", display: "(GMT+5:30) Kolkata", region: "Asia", offset: "+5:30" },
  { value: "Asia/Kathmandu", label: "Kathmandu", display: "(GMT+5:45) Kathmandu", region: "Asia", offset: "+5:45" },
  { value: "Asia/Dhaka", label: "Dhaka", display: "(GMT+6:00) Dhaka", region: "Asia", offset: "+6:00" },
  { value: "Asia/Yangon", label: "Yangon", display: "(GMT+6:30) Yangon", region: "Asia", offset: "+6:30" },
  { value: "Asia/Bangkok", label: "Bangkok", display: "(GMT+7:00) Bangkok", region: "Asia", offset: "+7:00" },
  { value: "Asia/Singapore", label: "Singapore", display: "(GMT+8:00) Singapore", region: "Asia", offset: "+8:00" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", display: "(GMT+8:00) Hong Kong", region: "Asia", offset: "+8:00" },
  { value: "Asia/Shanghai", label: "Shanghai", display: "(GMT+8:00) Shanghai", region: "Asia", offset: "+8:00" },
  { value: "Asia/Taipei", label: "Taipei", display: "(GMT+8:00) Taipei", region: "Asia", offset: "+8:00" },
  { value: "Asia/Tokyo", label: "Tokyo", display: "(GMT+9:00) Tokyo", region: "Asia", offset: "+9:00" },
  { value: "Asia/Seoul", label: "Seoul", display: "(GMT+9:00) Seoul", region: "Asia", offset: "+9:00" },
  { value: "Asia/Jakarta", label: "Jakarta", display: "(GMT+7:00) Jakarta", region: "Asia", offset: "+7:00" },
  { value: "Asia/Manila", label: "Manila", display: "(GMT+8:00) Manila", region: "Asia", offset: "+8:00" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", display: "(GMT+8:00) Kuala Lumpur", region: "Asia", offset: "+8:00" },
  { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh", display: "(GMT+7:00) Ho Chi Minh", region: "Asia", offset: "+7:00" },
  { value: "Asia/Riyadh", label: "Riyadh", display: "(GMT+3:00) Riyadh", region: "Asia", offset: "+3:00" },
  { value: "Asia/Jerusalem", label: "Jerusalem", display: "(GMT+2:00) Jerusalem", region: "Asia", offset: "+2:00" },
  { value: "Asia/Beirut", label: "Beirut", display: "(GMT+2:00) Beirut", region: "Asia", offset: "+2:00" },
  { value: "Asia/Tehran", label: "Tehran", display: "(GMT+3:30) Tehran", region: "Asia", offset: "+3:30" },
  { value: "Asia/Baghdad", label: "Baghdad", display: "(GMT+3:00) Baghdad", region: "Asia", offset: "+3:00" },
  { value: "Asia/Baku", label: "Baku", display: "(GMT+4:00) Baku", region: "Asia", offset: "+4:00" },
  { value: "Asia/Yerevan", label: "Yerevan", display: "(GMT+4:00) Yerevan", region: "Asia", offset: "+4:00" },
  { value: "Asia/Tbilisi", label: "Tbilisi", display: "(GMT+4:00) Tbilisi", region: "Asia", offset: "+4:00" },
  { value: "Asia/Tashkent", label: "Tashkent", display: "(GMT+5:00) Tashkent", region: "Asia", offset: "+5:00" },
  { value: "Asia/Almaty", label: "Almaty", display: "(GMT+6:00) Almaty", region: "Asia", offset: "+6:00" },

  // Africa
  { value: "Africa/Cairo", label: "Cairo", display: "(GMT+2:00) Cairo", region: "Africa", offset: "+2:00" },
  { value: "Africa/Johannesburg", label: "Johannesburg", display: "(GMT+2:00) Johannesburg", region: "Africa", offset: "+2:00" },
  { value: "Africa/Lagos", label: "Lagos", display: "(GMT+1:00) Lagos", region: "Africa", offset: "+1:00" },
  { value: "Africa/Nairobi", label: "Nairobi", display: "(GMT+3:00) Nairobi", region: "Africa", offset: "+3:00" },
  { value: "Africa/Casablanca", label: "Casablanca", display: "(GMT+0:00) Casablanca", region: "Africa", offset: "+0:00" },
  { value: "Africa/Algiers", label: "Algiers", display: "(GMT+1:00) Algiers", region: "Africa", offset: "+1:00" },
  { value: "Africa/Tunis", label: "Tunis", display: "(GMT+1:00) Tunis", region: "Africa", offset: "+1:00" },
  { value: "Africa/Addis_Ababa", label: "Addis Ababa", display: "(GMT+3:00) Addis Ababa", region: "Africa", offset: "+3:00" },
  { value: "Africa/Accra", label: "Accra", display: "(GMT+0:00) Accra", region: "Africa", offset: "+0:00" },
  { value: "Africa/Dar_es_Salaam", label: "Dar es Salaam", display: "(GMT+3:00) Dar es Salaam", region: "Africa", offset: "+3:00" },

  // Oceania
  { value: "Australia/Sydney", label: "Sydney", display: "(GMT+10:00) Sydney", region: "Oceania", offset: "+10:00" },
  { value: "Australia/Melbourne", label: "Melbourne", display: "(GMT+10:00) Melbourne", region: "Oceania", offset: "+10:00" },
  { value: "Australia/Brisbane", label: "Brisbane", display: "(GMT+10:00) Brisbane", region: "Oceania", offset: "+10:00" },
  { value: "Australia/Perth", label: "Perth", display: "(GMT+8:00) Perth", region: "Oceania", offset: "+8:00" },
  { value: "Australia/Adelaide", label: "Adelaide", display: "(GMT+9:30) Adelaide", region: "Oceania", offset: "+9:30" },
  { value: "Pacific/Auckland", label: "Auckland", display: "(GMT+12:00) Auckland", region: "Oceania", offset: "+12:00" },
  { value: "Pacific/Fiji", label: "Fiji", display: "(GMT+12:00) Fiji", region: "Oceania", offset: "+12:00" },
  { value: "Pacific/Guam", label: "Guam", display: "(GMT+10:00) Guam", region: "Oceania", offset: "+10:00" },
  { value: "Pacific/Port_Moresby", label: "Port Moresby", display: "(GMT+10:00) Port Moresby", region: "Oceania", offset: "+10:00" },
  { value: "Pacific/Tongatapu", label: "Tongatapu", display: "(GMT+13:00) Tongatapu", region: "Oceania", offset: "+13:00" },

  // Atlantic
  { value: "Atlantic/Azores", label: "Azores", display: "(GMT-1:00) Azores", region: "Atlantic", offset: "-1:00" },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde", display: "(GMT-1:00) Cape Verde", region: "Atlantic", offset: "-1:00" },
  { value: "Atlantic/Reykjavik", label: "Reykjavik", display: "(GMT+0:00) Reykjavik", region: "Atlantic", offset: "+0:00" },

  // UTC
  { value: "UTC", label: "UTC", display: "(GMT+0:00) UTC", region: "UTC", offset: "+0:00" },
];

export const getTimezoneByValue = (value: string): Timezone | undefined => {
  return timezones.find(tz => tz.value === value);
};

export const regionOrder = ["Americas", "Europe", "Asia", "Africa", "Oceania", "Atlantic", "UTC"];
