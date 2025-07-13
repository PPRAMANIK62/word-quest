export type LanguageData = {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
  is_active: boolean;
};

export const languages: LanguageData[] = [
  {
    code: "es",
    name: "Spanish",
    native_name: "Español",
    flag_emoji: "🇪🇸",
    is_active: true,
  },
  {
    code: "de",
    name: "German",
    native_name: "Deutsch",
    flag_emoji: "🇩🇪",
    is_active: true,
  },
];
