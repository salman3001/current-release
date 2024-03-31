<script setup lang="ts">
const step = ref(1);
const form = ref({
  thumbnail: null,
  images: [],
  video: null,
  service: {
    name: "",
    slug: "",
    serviceCategoryId: "",
    serviceSubcategoryId: "",
    locationSpecific: false,
    shortDesc: "",
    longDesc: "",
    geoLocation: "23.5,67.3",
  },
  tags: [],
  seo: {
    metaTitle: "",
    metaKeywords: "",
    metaDesc: "",
  },
  faq: [
    {
      quest: "",
      ans: "",
    },
  ],
  variant: [
    {
      image: null,
      name: "",
      price: 0,
      discountType: "flat",
      discountFlat: 0,
      discountPercentage: 0,
      desc: "",
    },
  ],
});

const customFetch = useCustomFetch();

const { data, pending: dataPending } = await useAsyncData(async () => {
  const [serviceCategories, serviceSubcategories, tags] = await Promise.all([
    customFetch<IResType<IServiceCategory[]>>(
      apiRoutes.service_categories.list
    ),
    customFetch<IResType<IServiceSubcategory[]>>(
      apiRoutes.service_subcategories.list
    ),
    customFetch<IResType<IServiceTag[]>>(apiRoutes.service_tags.list),
  ]);

  return {
    serviceCategories: serviceCategories.data,
    serviceSubcategories: serviceSubcategories.data,
    tags: tags.data,
  };
});

const { loading, fetch: createService } = usePostFetch({
  onSuccess: () => {
    navigateTo(routes.vendor.services.list);
  },
});

const submit = () => {
  const formData = convertToFormData(form.value);
  createService(apiRoutes.services.create, {
    method: "post",
    body: formData,
  });
};

const screenShotUrls = computed(() => {
  return form.value.images.map((img: File) => URL.createObjectURL(img));
});
</script>

<template>
  <div class="">
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
      <span class="text-h6"> Add Service </span>
    </div>
    <br />
    <q-stepper v-model="step" color="primary shadow-9" animated ref="stepper">
      <q-step
        :name="1"
        title="General Information"
        icon="settings"
        :done="step > 1"
      >
        <q-form @submit="($refs.stepper as any).next()">
          <h6>Service category and name</h6>
          <br />
          <div class="row q-col-gutter-md">
            <q-select
              v-if="data?.serviceCategories"
              outlined
              debounce="500"
              v-model="form.service.serviceCategoryId"
              emit-value
              map-options
              option-value="id"
              option-label="name"
              label="Select Category"
              class="col-12 col-sm-6 col-md-3"
              :options="data.serviceCategories"
            />
            <q-select
              v-if="data?.serviceSubcategories"
              outlined
              debounce="500"
              v-model="form.service.serviceSubcategoryId"
              emit-value
              map-options
              option-value="id"
              option-label="name"
              label="Select Sub Category"
              class="col-12 col-sm-6 col-md-3"
              :options="data?.serviceSubcategories"
            />
            <q-select
              v-if="data?.tags"
              outlined
              debounce="500"
              v-model="form.tags"
              emit-value
              map-options
              option-value="id"
              option-label="name"
              label="Select Tags"
              class="col-12 col-sm-6 col-md-3"
              multiple
              use-chips
              :options="data?.tags"
            />
          </div>
          <br />
          <div class="row q-col-gutter-md">
            <q-input
              outlined
              v-model="form.service.name"
              label="Service Name"
              class="col-12 col-sm-6 col-md-3"
              :rules="[rules.required('Service name is required')]"
            />
            <q-input
              outlined
              v-model="form.service.geoLocation"
              label="Location"
              class="col-12 col-sm-6 col-md-3"
              :rules="[rules.required('location not valid')]"
            />
          </div>
          <StepperNav
            :step="step"
            @prev="step > 1 && ($refs.stepper as any).previous()"
            :last-step="6"
          />
        </q-form>
      </q-step>

      <q-step :name="2" :done="step > 2" title="Descriptions" icon="assignment">
        <q-form @submit="($refs.stepper as any).next()">
          <div>
            <h6>Description</h6>
            <br />
            <div class="row q-col-gutter-lg">
              <q-input
                outlined
                v-model="form.service.shortDesc"
                label="Service Short Description"
                class="col-12"
              />
              <q-input
                type="textarea"
                outlined
                v-model="form.service.longDesc"
                label="Service Short Description"
                class="col-12"
              />
            </div>
          </div>
          <StepperNav
            :step="step"
            @prev="step > 1 && ($refs.stepper as any).previous()"
            :last-step="6"
          />
        </q-form>
      </q-step>

      <q-step :name="3" :done="step > 3" title="Variants" icon="add_comment">
        <q-form @submit="($refs.stepper as any).next()">
          <div>
            <h6>Add service variants (Minimum 01 is required)</h6>
            <br />
            <div class="">
              <q-card
                v-for="(f, i) in form.variant"
                :key="i"
                class="row q-col-gutter-sm shadow-12 q-pa-md q-pb-xl border q-mb-xl"
              >
                <div class="col-12">
                  <div class="row justify-between">
                    <p class="text-subtitle1 text-bold">Variant {{ i + 1 }}</p>
                    <template v-if="i > 0">
                      <q-btn
                        icon="close"
                        style="cursor: pointer"
                        class="btn-grey"
                        size="sm"
                        round
                        @click="
                          () => {
                            form.variants.splice(i, 1);
                          }
                        "
                      >
                        <q-tooltip class="bg-primary">
                          Remove variant ?
                        </q-tooltip>
                      </q-btn>
                    </template>
                  </div>
                  <br />
                </div>
                <div class="col-12 q-mb-xl">
                  <div class="q-py-xs" style="font-weight: 500">Thumbnail</div>

                  <FormsImageInput
                    name="inage"
                    @image="(file) => { f.image = file as unknown as null }"
                    width="10rem"
                    height="8rem"
                    style="max-width: 10rem"
                  />
                </div>
                <q-input
                  outlined
                  v-model="f.name"
                  label="Name"
                  class="col-12 col-sm-6 col-md-3"
                  :rules="[rules.required('required')]"
                >
                </q-input>
                <q-input
                  type="number"
                  outlined
                  v-model="f.price"
                  label="Price"
                  class="col-12 col-sm-6 col-md-3"
                  :rules="[
                    rules.required('required'),
                    rules.minValue(1, 'Price must be valid'),
                  ]"
                />
                <div class="col-12 col-sm-6 col-md-3">
                  <p class="q-pl-sm">Discount Type</p>
                  <q-radio
                    v-model="f.discountType"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="flat"
                    label="Flat"
                  />
                  <q-radio
                    v-model="f.discountType"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="percentage"
                    label="Percentage"
                  />
                </div>
                <q-input
                  type="number"
                  outlined
                  v-model="f.discountFlat"
                  label="Flat Discount"
                  class="col-12 col-sm-6 col-md-3"
                  v-if="f.discountType === 'flat'"
                  :rules="[
                    rules.minValue(1, 'Discount must be greater than 0'),
                    rules.maxValue(
                      Number(f.price),
                      'Discount must be less that price'
                    ),
                  ]"
                />
                <q-input
                  type="number"
                  outlined
                  v-model="f.discountFlat"
                  label="Discount percentage"
                  class="col-12 col-sm-6 col-md-3"
                  :rules="[
                    rules.minValue(0.1, 'Discount must be greater than 0.1%'),
                    rules.maxValue(99.9, 'Discount must be greater than 99.9%'),
                  ]"
                  v-if="f.discountType === 'percentage'"
                />
                <q-input
                  type="textarea"
                  outlined
                  v-model="f.desc"
                  :label="'Answer' + ' ' + (i + 1)"
                  class="col-12"
                />
              </q-card>
            </div>

            <div class="q-pt-md">
              <q-btn
                color="primary"
                style="min-width: 8rem"
                @click="
                  () => {
                    form.variants.push({
                      image: null,
                      name: '',
                      price: 0,
                      discountType: 'flat',
                      discountFlat: 0,
                      discountPercentage: 0,
                      desc: '',
                    });
                  }
                "
                label="+ Add More"
              />
            </div>
          </div>
          <StepperNav
            :step="step"
            @prev="step > 1 && ($refs.stepper as any).previous()"
            :last-step="6"
          />
        </q-form>
      </q-step>

      <q-step :name="4" :done="step > 4" title="Faqs" icon="add_comment">
        <q-form @submit="($refs.stepper as any).next()">
          <div>
            <h6>FAQ</h6>
            <br />
            <div v-for="(f, i) in form.faq" :key="i">
              <q-input
                outlined
                v-model="f.quest"
                :label="'Question' + ' ' + (i + 1)"
                class="col-12"
                :rules="[rules.required('required')]"
              >
                <template v-slot:append v-if="i > 0">
                  <q-icon
                    name="delete"
                    style="cursor: pointer"
                    @click="
                      () => {
                        form.faq.splice(i, 1);
                      }
                    "
                  />
                  <q-tooltip
                    anchor="top middle"
                    self="top middle"
                    class="bg-secondary"
                  >
                    Remove Question ?
                  </q-tooltip>
                </template>
              </q-input>
              <q-input
                type="textarea"
                outlined
                v-model="f.ans"
                :label="'Answer' + ' ' + (i + 1)"
                class="col-12"
              />
              <br />
            </div>
            <div class="q-pt-md">
              <q-btn
                color="primary"
                style="min-width: 8rem"
                @click="
                  () => {
                    form.faq.push({
                      quest: '',
                      ans: '',
                    });
                  }
                "
                >+ Add Question</q-btn
              >
            </div>
          </div>
          <StepperNav
            :step="step"
            @prev="step > 1 && ($refs.stepper as any).previous()"
            :last-step="6"
          />
        </q-form>
      </q-step>

      <q-step :name="5" :done="step > 5" title="Media" icon="add_comment">
        <q-form @submit="($refs.stepper as any).next()">
          <h6>Add Images</h6>
          <br />
          <div class="col-12 q-mb-xl">
            <div class="q-py-xs" style="font-weight: 500">
              Service Thumbnail
            </div>
            <br />
            <FormsImageInput
              name="logo"
              @image="(f) => { form.thumbnail = f as unknown as null }"
              style="max-width: 15rem"
            />
          </div>
          <div>
            <div class="col-12">
              <div style="font-weight: 500">Images (Max 5 images)</div>
              <br />
              <FormsMultiImageInput
                :urls="screenShotUrls"
                @delete="(index: number) => {
            form.images.splice(index, 1)
          }"
              >
                <div
                  class="column items-center q-pb-sm"
                  style="border: 1px solid #e6e4d9; border-radius: 1rem"
                >
                  <label for="multiple-image">
                    <q-img
                      alt="Preview"
                      style="min-width: 15rem; width: 15rem; cursor: pointer"
                      src="/images/screenshot-upload.svg"
                    />
                  </label>
                  <q-file
                    for="multiple-image"
                    dense
                    filled
                    multiple
                    v-model="form.images"
                    accept="image/jpeg,image/png,image/webp"
                    max-file-size="3000000"
                    label="Upload Image"
                    style="display: none"
                    append
                    max-files="5"
                  />
                  Upload Screenshots
                </div>
              </FormsMultiImageInput>
            </div>
            <br />
            <div class="col-12" style="max-width: 25rem">
              <div style="font-weight: 500">Service Video (Mp4/Mpeg)</div>
              <br />
              <FormsVideoInput
                name="video"
                @video="(v) => { form.video = v as unknown as null }"
              />
            </div>
            <br />
          </div>
          <StepperNav
            :step="step"
            @prev="step > 1 && ($refs.stepper as any).previous()"
            :last-step="6"
          />
        </q-form>
      </q-step>

      <q-step :name="6" :done="step > 6" title="Seo" icon="add_comment">
        <q-form @submit="submit()">
          <div class="">
            <br />
            <p class="text-subtitle1">META Information</p>
            <br />
            <div class="row q-col-gutter-xl">
              <q-input
                outlined
                v-model="form.seo.metaTitle"
                label="Meta Title"
                class="col-12 col-sm-6"
              />
              <q-input
                outlined
                v-model="form.seo.metaKeywords"
                label="Meta Keywords"
                class="col-12 col-sm-6"
              />
              <q-input
                type="textarea"
                outlined
                v-model="form.seo.metaDesc"
                label="Meta Description"
                class="col-12"
              />
            </div>
          </div>
          <StepperNav
            :step="step"
            @prev="step > 1 && ($refs.stepper as any).previous()"
            :last-step="6"
          />
        </q-form>
      </q-step>
    </q-stepper>

    <br />
    <q-form @submit="submit" @validation-error="srollToView">
      <br />

      <br />

      <br />

      <br />

      <br />

      <div class="row justify-end q-gutter-md q-pt-xl">
        <q-btn
          color="secondary"
          style="min-width: 8rem"
          @click="
            () => {
              navigateTo(routes.vendor.services.list);
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
  <br />
</template>
