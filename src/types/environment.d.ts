declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_USERNAME: string
      DATABASE_PASSWORD: string
      DATABASE_HOST: string
      DATABASE_PORT: string
      DATABASE_NAME: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
