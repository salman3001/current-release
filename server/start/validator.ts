// /*
// |--------------------------------------------------------------------------
// | Preloaded File
// |--------------------------------------------------------------------------
// |
// | Any code written inside this file will be executed during the application
// | boot.
// |
// */
// import { validator } from '@ioc:Adonis/Core/Validator'
// import Database from '@ioc:Adonis/Lucid/Database'
// import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Orm'

// validator.rule('exitInParent', async (value, [currentModelName,parentMoodelName, column], options) => {
//   if (typeof value !== 'string') {
//     return
//   }

//   const currentModel= await Database.from(currentModelName).where('id',value).first() as LucidRow

//   if(currentModel)
//   await currentModel.related(parentMoodelName)

//   const model = await Database.from(parentMoodel).whereExist((model)=>{
//     model[parentMoodelName]
//   })

//   if (!model) {
//     options.errorReporter.report(
//       options.pointer,
//       'Parent Model Does Not Exist',
//       'Parent Model Does Not Exist ',
//       options.arrayExpressionPointer
//     )
//   }
// })
