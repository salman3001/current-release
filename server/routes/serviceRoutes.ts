import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // services
  Route.delete('service/delete-screenshot/:id', 'service/ServiceController.deleteScreenShot')
  Route.get('service/export', 'service/ServiceController.export')
  Route.post('service/import', 'service/ServiceController.import')
  Route.resource('service', 'service/ServiceController').apiOnly()

  // service variants
  Route.resource('service/:serviceId/variants', 'service/ServiceVariantController').apiOnly()

  // service categories
  Route.get('service-category/export', 'service/ServiceCategoriesController.export')
  Route.post('service-category/import', 'service/ServiceCategoriesController.import')
  Route.resource('service-category', 'service/ServiceCategoriesController').apiOnly()

  // service sub categories
  Route.get('service-subcategory/export', 'service/ServiceSubcategoriesController.export')
  Route.post('service-subcategory/import', 'service/ServiceSubcategoriesController.import')
  Route.resource('service-subcategory', 'service/ServiceSubcategoriesController').apiOnly()

  // service tags
  Route.get('service-tags/export', 'service/ServiceTagsController.export')
  Route.post('service-tags/import', 'service/ServiceTagsController.import')
  Route.resource('service-tags', 'service/ServiceTagsController').apiOnly()

  // reviews
  Route.resource('/service/:serviceId/reviews', 'service/ReviewsController').apiOnly()
}).prefix('api')
