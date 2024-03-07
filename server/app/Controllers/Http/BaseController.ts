import {
  LucidModel,
  LucidRow,
  ModelPaginatorContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PoliciesList } from '@ioc:Adonis/Addons/Bouncer'
import { convertKeysToCamelCase } from 'App/Helpers/toCamelCase'
import * as XLSX from 'xlsx'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { flatten, unflatten } from 'uni-flatten'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import * as qsModule from 'qs'

type Populate = Record<string, { fields: string[]; populate: Populate }>
type Search = Record<string, string> | null
type Filter = Record<string, string> | null
type RelationFilter = Record<string, { field: string; value: string; filter: RelationFilter }>

export interface IndexQs {
  page: number | null
  rowsPerPage: string | null
  sortBy: string | null
  descending: 'true' | 'false' | null
  search: Search | null
  filter: Filter | null
  relationFilter: RelationFilter | null
  populate: Populate | null
  whereNull: string | null
  whereNotNull: string | null
  fields: string[] | null
}

export default class BaseController {
  constructor(
    public model: LucidModel,
    public storeValidator: any,
    public updateValidator: any,
    private bauncerPolicy?: keyof PoliciesList,
    public perPage?: number,
    public importSelects: string[] = []
  ) { }

  public async index(ctx: HttpContextContract) {
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('viewList')
    }

    const qs = qsModule.parse(ctx.request.parsedUrl.query, { depth: 10 })

    let records: ModelPaginatorContract<LucidRow> | LucidRow[] | [] = []
    const query = this.getIndexQuery(ctx)

    const filteredQuery = this.indexfilterQuery(qs, query)

    if (qs.populate) {
      await this.populate(qs.populate, filteredQuery)
    }

    if (qs.page) {
      records = await filteredQuery.paginate(qs.page, Number(qs?.rowsPerPage) || this.perPage)
    } else {
      records = await filteredQuery.exec()
    }

    return ctx.response.custom({
      message: null,
      code: 200,
      data: records,
      success: true,
    })
  }

  public async show(ctx: HttpContextContract) {
    // const qs = ctx.request.qs() as unknown as { fields: string[]; populate: Populate }
    const qs = qsModule.parse(ctx.request.parsedUrl.query, { depth: 10 })

    const query = this.getShowQuery(ctx)

    const filteredQuery = this.showfilterQuery(qs, query)

    if (qs.populate) {
      await this.populate(qs.populate, filteredQuery)
    }

    const record = await filteredQuery.first()

    if (record && ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('view', record)
    }

    return ctx.response.custom({
      message: null,
      code: 200,
      data: record,
      success: true,
    })
  }

  public async store(ctx: HttpContextContract) {
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('create')
    }
    const payload = await ctx.request.validate(this.storeValidator)
    const record = await this.model.create(payload)
    return ctx.response.custom({
      message: 'Record Created Successfully',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update(ctx: HttpContextContract) {
    const id = +ctx.params.id
    const record = await this.model.findOrFail(id)
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('update', record)
    }
    const payload = await ctx.request.validate(this.updateValidator)
    record?.merge(payload)
    await record?.save()
    return ctx.response.custom({
      message: 'Record Updated Successfully',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async destroy(ctx: HttpContextContract) {
    const id = +ctx.params.id
    const record = await this.model.findOrFail(id)
    if (ctx.bouncer && this.bauncerPolicy) {
      await ctx.bouncer.with(this.bauncerPolicy).authorize('delete', record)
    }

    await record?.delete()
    return ctx.response.custom({
      message: 'Record Deleted Successfully',
      code: 200,
      data: record,
      success: true,
    })
  }

  public async uniqueField(ctx: HttpContextContract) {
    const qs = ctx.request.qs() as { field: string; value: string }
    const record = await this.model.findBy(qs.field, qs.value)

    if (record) {
      return ctx.response.custom({
        message: 'Field is already taken',
        code: 400,
        data: null,
        success: false,
      })
    } else {
      return ctx.response.custom({
        message: 'The field is available',
        code: 200,
        data: null,
        success: true,
      })
    }
  }

  public indexfilterQuery(qs: IndexQs, query: ModelQueryBuilderContract<any, any>) {
    if (qs.relationFilter) {
      this.relationFiler(qs.relationFilter, query)
    }

    if (qs.sortBy) {
      if (qs.descending === 'true') {
        query.orderBy(qs.sortBy, 'desc')
      } else if (qs.descending === 'false') {
        query.orderBy(qs.sortBy, 'asc')
      }
    }

    if (qs.filter) {
      for (const key in qs.filter) {
        const element = qs.filter[key]
        if (element !== null && element !== '') {
          query.where(key, element)
        }
      }
    }

    if (qs.whereNotNull) {
      query.whereNotNull(qs.whereNotNull)
    }

    if (qs.whereNull) {
      query.whereNotNull(qs.whereNull)
    }

    if (qs.search) {
      let i = 0

      query.where((b) => {
        for (const key in qs.search) {
          const element = qs.search[key]
          if (element !== '') {
            if (i === 0) {
              b.whereLike(key, '%' + element + '%')
            } else {
              b.orWhereLike(key, '%' + element + '%')
            }
            i++
          }
        }
      })
    }

    if (qs.fields) {
      query.select(qs.fields)
    }

    return query
  }

  public showfilterQuery(qs: IndexQs, query: ModelQueryBuilderContract<any, any>) {
    if (qs.fields) {
      query.select(qs.fields)
    }

    return query
  }

  public async populate(populate: Populate, query: ModelQueryBuilderContract<any>) {
    for (const key in populate) {
      const fields = populate[key].fields

      const antoherPopulate = populate[key].populate

      if (fields) {
        query.preload(key, (q) => {
          q.select(fields)
          if (antoherPopulate) {
            this.populate(antoherPopulate, q)
          }
        })
      } else {
        query.preload(key, (q) => {
          if (antoherPopulate) {
            this.populate(antoherPopulate, q)
          }
        })
      }
    }

    return query
  }

  public relationFiler(filter: RelationFilter, query: ModelQueryBuilderContract<any>) {
    for (const key in filter) {
      const element = filter[key]

      if (element.value !== null && element.value !== '' && element.value !== undefined) {
        query.whereHas(key, (q) => {
          q.where(element.field, element.value)
          if (element.filter) {
            this.relationFiler(element.filter, q)
          }
        })
      }
    }
  }

  public async export(ctx: HttpContextContract) {
    this.bauncerPolicy && (await ctx.bouncer.with(this.bauncerPolicy).authorize('viewList'))

    const records = await this.getExportRecords()

    const data = records.map((r) => {
      const data = flatten(convertKeysToCamelCase(r.serialize()))
      return this.excludeIncludeExportProperties(data)
    })

    const workbook = XLSX.utils.book_new()

    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, this.model.name)
    XLSX.writeFile(workbook, Application.tmpPath(`uploads/${this.model.name}.xlsx`), {
      bookType: 'xlsx',
      type: 'file',
    })

    const url = await Drive.getSignedUrl(`${this.model.name}.xlsx`, { expiresIn: '30mins' })

    return ctx.response.custom({
      message: 'Export Successfull',
      code: 200,
      data: { url },
      success: true,
    })
  }

  public async import(ctx: HttpContextContract) {
    this.bauncerPolicy && (await ctx.bouncer.with(this.bauncerPolicy).authorize('create'))
    const validatorSchema = schema.create({
      file: schema.file({ extnames: ['xlsx'] }),
    })

    const { file } = await ctx.request.validate({ schema: validatorSchema })

    await file.moveToDisk('./', {
      name: `${this.model.name}.xlsx`,
    })

    const book = XLSX.readFile(Application.tmpPath(`uploads/${this.model.name}.xlsx`))
    const sheet = book.Sheets[this.model.name]
    const json = XLSX.utils.sheet_to_json(sheet)

    for (const j of json as any) {
      const deflattenObject = unflatten(j)
      await this.storeExcelData(deflattenObject, ctx.request.ctx as HttpContextContract)
    }

    return ctx.response.custom({
      message: 'File upload Successfull! Refresh your page',
      code: 201,
      data: null,
      success: true,
    })
  }

  public async getExportRecords() {
    const records = await this.model.all()
    return records
  }

  public async storeExcelData(data: any, ctx: HttpContextContract) {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new this.updateValidator(ctx, data.id).schema,
      data: data,
    })
    await this.model.updateOrCreate({ id: validatedData.id }, validatedData)
  }

  public excludeIncludeExportProperties(record: any) {
    return record
  }

  public getIndexQuery(ctx: HttpContextContract): ModelQueryBuilderContract<any, any> {
    return this.model.query()
  }

  public getShowQuery(ctx: HttpContextContract): ModelQueryBuilderContract<any, any> {
    const id = ctx.params.id
    return this.model.query().where('id', id)
  }
}
