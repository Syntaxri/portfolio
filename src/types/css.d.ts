declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.css' {}

interface Window {
  /** set by the Preloader as soon as the entrance has opened */
  __entranceReady?: boolean
}