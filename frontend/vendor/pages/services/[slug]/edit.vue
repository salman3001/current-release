<script setup lang="ts">
const customFetch = useCustomFetch();
const route = useRoute();

const { data: service } = await useAsyncData(async () => {
  const data = await customFetch<IResType<IService>>(
    apiRoutes.services.view_by_slug(route.params?.slug as unknown as number)
  );
  return data.data;
});

const form = ref({
  thumbnail: null,
  images: [],
  video: null,
  service: {
    name: service.value?.name,
    slug: service.value?.slug,
    serviceCategoryId: service.value?.service_category_id,
    serviceSubcategoryId: service.value?.service_subcategory_id,
    locationSpecific: service.value?.location_specific,
    shortDesc: service.value?.short_desc,
    longDesc: service.value?.long_desc,
    geoLocation: "23.5,67.3",
  },
  tags: service.value?.tags || [],
  seo: {
    metaTitle: service.value?.seo?.meta_title,
    metaKeywords: service.value?.seo?.meta_keywords,
    metaDesc: service.value?.seo?.meta_desc,
  },
  faq: service.value?.faq || [
    {
      quest: "",
      ans: "",
    },
  ],
});

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
  createService(apiRoutes.services.update(service.value!.id), {
    method: "put",
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
    <q-form @submit="submit" @validation-error="srollToView">
      <div>
        <h6>Category Information</h6>
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
            :options="[{ name: 'All', id: '' }, ...data.serviceCategories]"
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
            :options="[{ name: 'All', id: '' }, ...data?.serviceSubcategories]"
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
            :options="[{ name: 'All', id: '' }, ...data?.tags]"
          />
        </div>
      </div>
      <br />
      <div class="">
        <h6>General Information</h6>
        <br />
        <div class="row q-col-gutter-md">
          <div class="col-12 q-mb-xl">
            <div class="q-py-xs" style="font-weight: 500">
              Service Thumbnail
            </div>
            <FormsImageInput
              name="logo"
              @image="(f) => { form.thumbnail = f as unknown as null }"
              style="max-width: 15rem"
            />
          </div>
          <q-input
            outlined
            v-model="form.service.name"
            label="Service Name"
            class="col-12 col-sm-6 col-md-3"
            :rules="[rules.required('Service name is required')]"
          />
          <q-input
            outlined
            v-model="form.service.slug"
            label="Service Name"
            class="col-12 col-sm-6 col-md-3"
            :rules="[
              rules.required('Service name is required'),
              rules.slug('Not a valid slug'),
            ]"
          />
          <q-input
            outlined
            v-model="form.service.geoLocation"
            label="Location"
            class="col-12 col-sm-6 col-md-3"
            :rules="[rules.required('location not valid')]"
          />
        </div>
      </div>
      <br />
      <div>
        <h6>
          <q-toggle
            v-model="form.service.locationSpecific"
            label="Specific Location"
          />
        </h6>
      </div>
      <br />
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
      <br />
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
                } as any);
              }
            "
            >+ Add Question</q-btn
          >
        </div>
      </div>
      <br />
      <div>
        <h6>Media/Screenshot</h6>
        <br />
        <div class="col-12">
          <div style="font-weight: 500">Service Screenshots (Max 5 images)</div>
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
          <FormsVideoInput
            name="video"
            @video="(v) => { form.video = v as unknown as null }"
          />
        </div>
        <br />
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
      </div>
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
