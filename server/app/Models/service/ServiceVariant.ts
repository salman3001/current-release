import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Service from './Service'
import ServiceProperty from './ServiceProperty'

export default class ServiceVariant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public price: number

  @column()
  public availableQty: number

  @column()
  public hasInifiiteQty: boolean

  @column()
  public flatDiscount: number

  @column()
  public features: Object

  @column()
  public included: Object

  @column()
  public excluded: Object

  @column()
  public order: number

  @responsiveAttachment({
    folder: 'service/variants/images',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public image: ResponsiveAttachmentContract

  @column()
  public serviceId: number

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @hasMany(() => ServiceProperty)
  public aditionalProperties: HasMany<typeof ServiceProperty>
}
