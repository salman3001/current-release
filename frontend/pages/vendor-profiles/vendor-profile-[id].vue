<script setup lang="ts">
const route = useRoute();
const customFetch = useCustomFetch();
const getImageUrl = useGetImageUrl();
const page = ref(1);
const user = useCookie("user");
const modal = modalStore();

const { data: vendor } = await useAsyncData(
  "vendor-profile-" + route.params.id,
  async () => {
    const data = await customFetch<IResType<IVendorUser>>(
      apiRoutes.vendor_users + "/" + route.params.id,
      {
        query: {
          preload: [
            {
              profile: {
                select: ["*"],
              },
            },
          ],
        } as AdditionalParams,
      }
    );
    return data.data;
  }
);

const {
  data: services,
  refresh,
  pending: servicesPending,
} = await useAsyncData(() =>
  customFetch<IPageRes<IService[]>>(apiRoutes.services, {
    query: {
      page: page.value,
      preload: [
        {
          variants: {
            select: ["id", "price"],
          },
          reviews: {
            select: ["rating"],
          },
        },
      ],
      withAggregate: [
        {
          aggregator: "min",
          field: "price",
          relation: "variants",
          as: "starting_from",
        },
      ],
      where: {
        vendor_user_id: ["=", vendor.value!.id as unknown as string],
      },
    } as AdditionalParams,
  })
);

const {
  data: reviews,
  pending: reviewsPending,
  refresh: refreshReviews,
} = await useAsyncData(
  ("reviews" + route.params.slug) as string,
  async () => {
    const data = await customFetch<IPageRes<IReview[]>>(
      apiRoutes.vendor_reviews(vendor.value!.id),
      {
        query: {
          preload: [
            {
              user: {
                select: ["first_name", "last_name"],
                preload: [
                  {
                    profile: {
                      select: ["avatar"],
                    },
                  },
                ],
              },
            },
          ],
          page: 1,
        } as AdditionalParams,
      }
    );
    return data.data;
  },
  {
    server: false,
  }
);
</script>

<template>
  <div>
    <div
      class="full-width"
      style="height: 200px"
      :style="{
        backgroundImage: ` url(${getImageUrl(
          undefined,
          '/images/sample-cover.jpg'
        )})`,
      }"
    ></div>

    <div
      class="relative-position row q-pa-sm q-pa-sm-md q-pa-md-lg q-pa-lg-xl q-gutter-y-lg"
    >
      <div
        class="row full-width"
        style="top: -100px; position: absolute"
        :class="$q.screen.lt.sm ? 'items-center justify-center q-pr-lg' : ''"
      >
        <q-avatar size="156px" text-color="white" class="shadow-2">
          <img :src="getImageUrl(undefined)" />
        </q-avatar>
      </div>

      <div
        class="column full-width"
        :class="$q.screen.lt.sm ? 'text-center items-center' : ''"
      >
        <p class="text-h6 q-mt-xl">
          {{ vendor?.first_name + " " + vendor?.last_name }}
        </p>
        <p class="" style="max-width: 500px">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
          dolore sint tenetur, in aliquid debitis consectetur facilis ipsa
          doloribus sit.
        </p>
        <div class="row items-center gap-100 text-h6">
          <RatingComponent
            :rating="vendor?.avg_rating ? Number(vendor?.avg_rating) : 0"
            size="2rem"
          />
          {{ vendor?.avg_rating || 0 }}
        </div>
      </div>

      <h6>
        Services Listed By {{ vendor?.first_name + " " + vendor?.last_name }}
      </h6>
      <div class="row q-col-gutter-lg q-mt-sm">
        <div
          v-if="servicesPending"
          v-for="s in 10"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <SkeletonBase type="card" />
        </div>
        <div
          v-else
          v-for="s in services?.data.data"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <WebServiceCard :service="s" />
        </div>
      </div>
      <div class="row col-12">
        <PaginateComponet
          :page="page"
          :meta="services?.data.meta"
          @update:model-value="(v: number) => { page = v; refresh() }"
        />
      </div>
      <div class="q-gutter-md">
        <h5>Cutomer Reviews</h5>
        <div class="row gap-100">
          <div class="q-gutter-lg col-12 col-md-4" style="">
            <RatingComponent :rating="vendor!.avg_rating || 0" /><span
              class="text-h5"
              >{{ vendor?.avg_rating || 0 }} out of 5</span
            >
            <q-separator />
            <div class="q-gutter-y-sm">
              <h6>Rate this service</h6>
              <p>Share your throught about this service</p>
              <q-btn
                color="primary"
                @click="
                  () => {
                    if (user) {
                      modal.togel('WebAddReview', {
                        vendorId: vendor?.id,
                        type: 'vendor',
                        onSuccess: refreshReviews,
                      });
                    } else {
                      navigateTo(routes.auth.login + `?next=${route.path}`);
                    }
                  }
                "
                >Write a Review</q-btn
              >
            </div>
            <q-separator />
          </div>
          <div style="max-width: 500px" class="q-gutter-xl col-12 col-md-8">
            <div v-if="reviewsPending">
              <SkeletonBase type="list" v-for="i in 5" />
            </div>
            <div v-if="reviews?.data.length! < 1" class="text-subtitle1">
              <q-icon name="info" class="text-primary" size="20px" /> This
              Service dont have any reviews yet
            </div>
            <div v-for="review in reviews?.data" class="q-gutter-sm">
              <CustomerReview :review="review" />
            </div>
            <q-btn color="primary" v-if="reviews?.meta.next_page_url"
              >View More</q-btn
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
