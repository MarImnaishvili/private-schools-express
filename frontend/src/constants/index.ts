// src/constants/index.ts

export const SPORTS_CLUBS = [
  "Swimming",
  "basketball",
  "football",
  "chess",
  "karate",
  "volleyball",
  "tennis",
  "wrestling",
  "judo",
  "yoga",
  "gymnastics",
] as const;

export const FOREIGN_LANGUAGES = [
  "German",
  "French",
  "Russian",
  "Spanish",
  "Italian",
  "Chinese",
  "Turkish",
  "Japanese",
] as const;

export const MEAL_OPTIONS = [
  "noMeals",
  "includedInThePrice",
  "notIncludedInThePrice",
] as const;

export const TRANSPORTATION_OPTIONS = [
  "noTransportationService",
  "includedInThePrice",
  "notIncludedInThePrice",
] as const;

export const ACCREDITATION_STATUS = [
  "accredited",
  "notAccredited",
  "inProgress",
] as const;

export const DISTRICTS = [
  "vake-saburtalo",
  "isani-samgori",
  "gldani-nadzaladevi",
  "didube-chugureti",
  "dzveli-tbilisi",
  "tbilisisShemogareni",
] as const;

export const MEDIA_TYPES = ["photo", "video"] as const;

export const MEDIA_ATTACHMENTS = ["school", "primary", "basic", "secondary"] as const;

export const LEVEL_NAMES = ["Primary", "Basic", "Secondary"] as const;
