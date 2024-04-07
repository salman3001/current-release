<script setup lang="ts">
// const { user } = useAuth();
// const route = useRoute();

// const { show } = useCouponApi.show();
// const { data: coupon, pending: couponPending } = await useAsyncData(
//   async () => {
//     const data = await show(route.params.id);
//     return data.data;
//   }
// );

// const { form, update, loading } = useCouponApi.update({
//   desc: coupon.value?.desc,
//   discountFlat: coupon.value?.discount_flat,
//   discountPercentage: coupon.value?.discount_percentage,
//   discountType: coupon.value?.discount_type as any,
//   expiredAt: coupon.value?.expired_at,
//   isActive: coupon.value?.is_active,
//   maxUsers: coupon.value?.max_users,
//   minPurchaseAmount: coupon.value?.min_purchase_amount as unknown as number,
//   name: coupon.value?.name,
//   serviceIds: coupon.value?.services?.map((s) => s.id) || [],
// });
// const { list: serviceList } = useServiceApi.list({
//   field__vendor_user_id: user.value.id,
//   perPage: 1000,
// });

// const { data, pending: dataPending } = await useAsyncData(async () => {
//   const [services] = await Promise.all([serviceList()]);

//   return {
//     services: services.data,
//   };
// });

// const submit = async () => {
//   await update(route.params.id, {
//     onSuccess() {
//       navigateTo(routes.vendor.coupons.list);
//     },
//   });
// };
</script>

<template>
  <div>view</div>
  <!-- <div class="">
    <br />
    <div class="row items-center q-gutter-sm">
      <q-icon
        name="keyboard_backspace"
        size="30px"
        style="cursor: pointer"
        @click="
          () => {
            navigateTo(routes.vendor.services.list);
          }
        "
      />
      <span class="text-h6"> Add Coupon </span>
    </div>
    <br />
    <q-form @submit="submit">
      <br />
      <div class="row q-col-gutter-md">
        <q-select
          v-if="data?.services"
          outlined
          debounce="500"
          v-model="form.serviceIds"
          emit-value
          map-options
          option-value="id"
          option-label="name"
          label="Select Services"
          class="col-12 col-sm-6 col-md-3"
          :options="data.services.data"
          multiple
          use-chips
        />
      </div>
      <br />
      <div class="row q-col-gutter-md">
        <q-input
          outlined
          v-model="form.name"
          label="Coupon Name"
          class="col-12 col-sm-6 col-md-3"
          :rules="[rules.required('Required')]"
        />
        <q-input
          outlined
          type="textarea"
          v-model="form.desc"
          label="Description"
          class="col-12 col-sm-6 col-md-3"
          :rules="[rules.required('Required')]"
        />
        <div class="col-12 col-sm-6 col-md-3">
          <p class="q-pl-sm">Discount Type</p>
          <q-radio
            v-model="form.discountType"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="flat"
            label="Flat"
            @update:model-value="form.discountPercentage = '0'"
          />
          <q-radio
            v-model="form.discountType"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="percentage"
            label="Percentage"
          />
        </div>
        <q-input
          type="number"
          outlined
          v-model="form.discountFlat"
          label="Flat Discount"
          class="col-12 col-sm-6 col-md-3"
          v-if="form.discountType === 'flat'"
          :rules="[rules.minValue(0, 'Discount must be greater than 0')]"
        />
        <q-input
          type="number"
          outlined
          v-model="form.discountPercentage"
          label="Discount percentage"
          class="col-12 col-sm-6 col-md-3"
          :rules="[
            rules.minValue(0, 'Discount must be greater than 0%'),
            rules.maxValue(99.9, 'Discount must be greater than 99.9%'),
          ]"
          v-if="form.discountType === 'percentage'"
        />

        <q-input
          outlined
          v-model="form.maxUsers"
          label="Max Users"
          class="col-12 col-sm-6 col-md-3"
          :rules="[rules.required('Required')]"
        />
        <q-input
          type="number"
          outlined
          v-model="form.minPurchaseAmount"
          label="Minimum Purchase amount"
          class="col-12 col-sm-6 col-md-3"
          :rules="[
            rules.required('Required'),
            rules.minValue(0, 'Discount must be greater than 0'),
          ]"
        />
        <FormsDateTimeInput label="Valid from" v-model="form.validFrom" />

        <FormsDateTimeInput label="Expries at" v-model="form.expiredAt" />
        <q-toggle label="activate" v-model="form.isActive" />
      </div>
      <div class="row justify-end q-gutter-md q-pt-xl">
        <q-btn
          color="secondary"
          style="min-width: 8rem"
          @click="
            () => {
              navigateTo(routes.vendor.coupons.list);
            }
          "
          >Cancle</q-btn
        >
        <q-btn color="primary" v-if="loading">
          <LoadingIndicator />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem"
          >Save</q-btn
        >
      </div>
    </q-form>
  </div>
  <br />
  <br /> -->
</template>
