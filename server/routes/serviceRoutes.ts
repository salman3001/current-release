import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('service/delete-screenshot/:id', 'service/ServicesController.deleteScreenShot')

  Route.get('service/export', 'service/ServicesController.export')
  Route.post('service/import', 'service/ServicesController.import')
  Route.resource('service', 'service/ServicesController').apiOnly()

  Route.get('service-category/export', 'service/ServiceCategoriesController.export')
  Route.post('service-category/import', 'service/ServiceCategoriesController.import')
  Route.resource('service-category', 'service/ServiceCategoriesController').apiOnly()

  Route.get('service-subcategory/export', 'service/ServiceSubcategoriesController.export')
  Route.post('service-subcategory/import', 'service/ServiceSubcategoriesController.import')
  Route.resource('service-subcategory', 'service/ServiceSubcategoriesController').apiOnly()

  Route.get('service-tags/export', 'service/ServiceTagsController.export')
  Route.post('service-tags/import', 'service/ServiceTagsController.import')
  Route.resource('service-tags', 'service/ServiceTagsController').apiOnly()
}).prefix('api')
