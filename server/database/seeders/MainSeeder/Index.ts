// import Application from '@ioc:Adonis/Core/Application'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AdminUserFactory from 'Database/factories/adminUser/AdminUserFactory'
import ContactMessageFactory from 'Database/factories/helpcenter/ContactMessageFactory'
import ContinentFactory from 'Database/factories/address/ContinentFactory'
import BlogCategoryFactory from 'Database/factories/blogs/BlogCategoryFactory'
import KnowledgebaseCategoryFactory from 'Database/factories/helpcenter/KnowledgebaseCategoryFactory'
import RoleFactory from 'Database/factories/adminUser/RoleFactory'
import UserFactory from 'Database/factories/user/UserFactory'
import SupportTicketFactory from 'Database/factories/helpcenter/SupportTicketFactory'
import PermissionFactory from 'Database/factories/adminUser/PermissionFactory'
import { TicketStatus, permissions } from 'App/Helpers/enums'
import ProductCategoryFactory from 'Database/factories/product/ProductCategoryFactory'
import CampaignTypeFactory from 'Database/factories/email/CampaignTypeFactory'
import TemplateFactory from 'Database/factories/email/TemplateFactory'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    // if (
    //   (!Seeder.default.environment.includes('development') && Application.inDev) ||
    //   (!Seeder.default.environment.includes('testing') && Application.inTest) ||
    //   (!Seeder.default.environment.includes('production') && Application.inProduction)
    // ) {
    //   return
    // }
    await new Seeder.default(this.client).run()
  }
  public async run() {
    await PermissionFactory.merge([
      { name: permissions.MANAGE_ADMIN_USERS },
      { name: permissions.MANAGE_BLOGS },
      { name: permissions.MANAGE_CAMPAIGNS },
      { name: permissions.MANAGE_CONTACT_MESSAGES },
      { name: permissions.MANAGE_INTERESTS },
      { name: permissions.MANAGE_KNOWLEDGEBASE },
      { name: permissions.MANAGE_LOCATION },
      { name: permissions.MANAGE_PRODUCT },
      { name: permissions.MANAGE_ROLES },
      { name: permissions.MANAGE_SERVICE },
      { name: permissions.MANAGE_SUBSCRIBERS },
      { name: permissions.MANAGE_TEMPLATES },
      { name: permissions.MANAGE_TICKETS },
      { name: permissions.MANAGE_USER },
    ]).createMany(14)

    await RoleFactory.merge([
      { name: 'Super Admin', isActive: true },
      { name: 'Moderator' },
      { name: 'Vender' },
    ]).createMany(3)

    await AdminUserFactory.merge([{ email: 'admin@gmail.com', isActive: true, roleId: 1 }])
      .with('social')
      .with('activities', 3)
      .createMany(14)

    await ContinentFactory.with('country', 3, (country) => {
      country.with('state', 3, (state) => {
        state.with('city', 3, (city) => {
          city.with('street', 4)
        })
      })
    }).createMany(3)

    await UserFactory.merge([
      { email: 'user@gmail.com', password: '123456789', userName: 'user123' },
    ])
      .with('address', 1, (add) => {
        add.with('continent', 1).with('country').with('state').with('city').with('street')
      })
      .with('educations', 2)
      .with('experiences', 2, (ex) => {
        ex.with('city').with('country').with('state').with('department').with('industry')
      })
      .with('languages', 2)
      .with('social')
      .with('favoriteLinks', 3)
      .with('skills', 4)
      .with('NotificationSetting')
      .with('products', 3, (p) => {
        p.with('variants', 2, (v) => {
          v.with('properties', 3)
        })
      })
      .createMany(10)

    await BlogCategoryFactory.with('blogs', 5).createMany(4)
    await KnowledgebaseCategoryFactory.with('contents', 5).createMany(3)
    await ContactMessageFactory.createMany(15)
    await SupportTicketFactory.merge([
      { status: TicketStatus.CLOSED },
      { status: TicketStatus.CLOSED },
      { status: TicketStatus.CLOSED },
      { status: TicketStatus.RESPONDED },
      { status: TicketStatus.RESPONDED },
      { status: TicketStatus.RESPONDED },
    ]).createMany(9)

    // product
    await ProductCategoryFactory.with('subCategory', 3, (sub) => {
      sub
        .with('products', 3, (p) => {
          p.with('faq', 3).with('seo').with('social').with('tags', 3)
        })
        .with('faqs', 3)
        .with('seo')
    })
      .with('products', 2, (p) => {
        p.with('faq', 3).with('seo').with('social').with('tags', 3)
      })
      .with('faqs', 3)
      .with('seo')
      .createMany(3)

    // campaign
    await CampaignTypeFactory.with('campaign', 3, (c) => {
      c.with('interests', 3, (i) => {
        i.with('subscribers', 3)
      })
    }).createMany(3)

    await TemplateFactory.merge({
      name: 'Forgot Password Email',
      content:
        'Forgot Your Password! Dont Worry. Here is your 6 digts code {{otp}}, Use it to reset the password',
    }).create()
  }
}
