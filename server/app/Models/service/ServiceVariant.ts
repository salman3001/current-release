import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Service from './Service'
import { DiscountType } from 'App/Helpers/enums'

export default class ServiceVariant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public price: string | number

  @column()
  public discountType: DiscountType

  @column()
  public discountFlat: string | number

  @column()
  public discountPercentage: string | number

  @column({
    prepare: (v) => JSON.stringify(v),
  })
  public features: Object

  @column({
    prepare: (v) => JSON.stringify(v),
  })
  public included: Object

  @column({
    prepare: (v) => JSON.stringify(v),
  })
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

  @column({
    prepare: (v) => JSON.stringify(v),
  })
  public additionalProperties: Object
}
