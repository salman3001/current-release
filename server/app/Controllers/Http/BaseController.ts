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
  descending: boolean | null
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
  ) {}

  public async index({ request, response, bouncer }: HttpContextContract) {
    if (bouncer && this.bauncerPolicy) {
      await bouncer.with(this.bauncerPolicy).authorize('viewList')
    }

    const qs = request.qs() as unknown as IndexQs

    const qs = qsModule.parse(request.parsedUrl.query, { depth: 10 })

    let records: ModelPaginatorContract<LucidRow> | LucidRow[] | [] = []
    const query = this.model.query()
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

    if (qs.populate) {
      await this.populate(qs.populate, query)
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
      records = await query.select(qs.fields)
    }

    if (qs.page) {
      records = await query.paginate(qs.page, Number(qs?.rowsPerPage) || this.perPage)
    } else {
      records = await query.exec()
    }

    return response.json(records)
  }

  public async show({ request, params, response, bouncer }: HttpContextContract) {
    // const qs = request.qs() as unknown as { fields: string[]; populate: Populate }
    const qs = qsModule.parse(request.parsedUrl.query, { depth: 10 })

    const id = +params.id

    const query = this.model.query()
    query.where('id', id)

    if (qs?.populate) {
      await this.populate(qs.populate, query)
    }

    if (qs?.fields) {
      query.select(qs?.fields)
    }

    const record = await query.first()

    if (record && bouncer && this.bauncerPolicy) {
      await bouncer.with(this.bauncerPolicy).authorize('view', record)
    }

    return response.json(record)
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    if (bouncer && this.bauncerPolicy) {
      await bouncer.with(this.bauncerPolicy).authorize('create')
    }
    const payload = await request.validate(this.storeValidator)
    const record = await this.model.create(payload)
    return response.json({ record })
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    const id = params.id
    const record = await this.model.findOrFail(id)
    if (bouncer && this.bauncerPolicy) {
      await bouncer.with(this.bauncerPolicy).authorize('update', record)
    }
    const payload = await request.validate(this.updateValidator)
    record?.merge(payload)
    await record?.save()
    return response.json({ record })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const id = params.id
    const record = await this.model.findOrFail(id)
    if (bouncer && this.bauncerPolicy) {
      await bouncer.with(this.bauncerPolicy).authorize('delete', record)
    }

    await record?.delete()
    return response.json({ record })
  }

  public async uniqueField({ response, request }: HttpContextContract) {
    const qs = request.qs() as { field: string; value: string }
    const record = await this.model.findBy(qs.field, qs.value)

    if (record) {
      return response.badRequest({ message: 'Field already exist' })
    } else {
      return response.ok({ message: 'Field Available' })
    }
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

  public async export({ response, bouncer }: HttpContextContract) {
    this.bauncerPolicy && (await bouncer.with(this.bauncerPolicy).authorize('viewList'))

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

    return response.json({ url })
  }

  public async import({ response, bouncer, request }: HttpContextContract) {
    this.bauncerPolicy && (await bouncer.with(this.bauncerPolicy).authorize('create'))
    const validatorSchema = schema.create({
      file: schema.file({ extnames: ['xlsx'] }),
    })

    const { file } = await request.validate({ schema: validatorSchema })

    await file.moveToDisk('./', {
      name: `${this.model.name}.xlsx`,
    })

    const book = XLSX.readFile(Application.tmpPath(`uploads/${this.model.name}.xlsx`))
    const sheet = book.Sheets[this.model.name]
    const json = XLSX.utils.sheet_to_json(sheet)

    for (const j of json as any) {
      const deflattenObject = unflatten(j)
      await this.storeExcelData(deflattenObject, request.ctx as HttpContextContract)
    }

    return response.json({ message: 'File Uploaded. Refresh the page' })
  }

  public async getExportRecords() {
    const records = await this.model.all()
    return records
  }

  public async storeExcelData(data: any, ctx: HttpContextContract) {
    const validatedData = await validator.validate({
      schema: new this.updateValidator(ctx).schema,
      data: data,
    })
    await this.model.updateOrCreate({ id: validatedData.id }, validatedData)
  }

  public excludeIncludeExportProperties(record: any) {
    return record
  }
}
