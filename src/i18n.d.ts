/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.js' {
  const content: any;
  export default content;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '@/i18n' {
  import i18n from 'i18next';
  export default i18n;
}