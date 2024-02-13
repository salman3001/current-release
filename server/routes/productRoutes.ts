import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('product/delete-screenshot/:id', 'product/ProductsController.deleteScreenShot')

  Route.get('product/export', 'product/ProductsController.export')
  Route.post('product/import', 'product/ProductsController.import')
  Route.resource('product', 'product/ProductsController').apiOnly()

  Route.get('product-category/export', 'product/ProductCategoriesController.export')
  Route.post('product-category/import', 'product/ProductCategoriesController.import')
  Route.resource('product-category', 'product/ProductCategoriesController').apiOnly()

  Route.get('product-subcategory/export', 'product/ProductSubcategoriesController.export')
  Route.post('product-subcategory/import', 'product/ProductSubcategoriesController.import')
  Route.resource('product-subcategory', 'product/ProductSubcategoriesController').apiOnly()

  Route.get('product-tags/export', 'product/ProductTagsController.export')
  Route.post('product-tags/import', 'product/ProductTagsController.import')
  Route.resource('product-tags', 'product/ProductTagsController').apiOnly()
}).prefix('api')
