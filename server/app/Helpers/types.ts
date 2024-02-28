export interface OrderItem {
  qty: number
  serviceVariant: {
    service_id: number
    service_name: string
    disocunt_type: string
    disocunt_flat: string
    disocunt_percentage: string
    id: number
    name: string
    price: string
  }
  item_total_without_discount: string
  item_discount: string
  item_total: string
}

export interface IOrderGroupsByVender {
  [key: string]: {
    vendorId: number
    items: OrderItem[]
    order_total_without_discount: string
    order_total_discount: string
    coupon_discount: string
    order_total: string
  }
}

export interface IOrderGroup {
  vendorId: number
  items: OrderItem[]
  orderNo: number
  order_total: string
  coupon_discount: string
  order_total_without_discount: string
  order_total_discount: string
}

export interface IOrderGroupWithDiscount {
  orders: IOrderGroup[]
  grand_total_without_discount: string
  grand_total_discount: string
  grand_total_coupon_discount: string
  grand_total: string
}
