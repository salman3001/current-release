declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    containsNumber(numberArray: number[]): Rule
  }
}
