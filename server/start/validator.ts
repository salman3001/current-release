// /*
// |--------------------------------------------------------------------------
// | Preloaded File
// |--------------------------------------------------------------------------
// |
// | Any code written inside this file will be executed during the application
// | boot.
// |
// */
import { validator } from '@ioc:Adonis/Core/Validator'
// import Database from '@ioc:Adonis/Lucid/Database'
// import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Orm'

validator.rule('containsNumber', async (value, [numberArray], options) => {
  if (typeof value !== 'number' && !Array.isArray(numberArray)) {
    return
  }

  if (!numberArray.includes(value)) {
    options.errorReporter.report(
      options.pointer,
      `Not a valid number. choices ${(numberArray as []).toString()}`,
      `Not a valid number. choices ${(numberArray as []).toString()}`,
      options.arrayExpressionPointer
    )
  }
})
