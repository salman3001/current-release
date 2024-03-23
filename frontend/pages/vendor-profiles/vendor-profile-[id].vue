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
      apiRoutes.vendor_user.view(route.params.id as any),
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
  customFetch<IPageRes<IService[]>>(apiRoutes.services.list, {
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
      apiRoutes.vendor_user.reviews(vendor.value!.id),
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
  <br />

  <div class="q-gutter-y-lg">
    <div class="row q-gutter-md">
      <q-avatar
        size="156px"
        text-color="white"
        class="shadow-2 rounded-borders shadow-12"
        square
      >
        <img :src="getImageUrl(undefined, '/images/sample-dp.png')" />
      </q-avatar>
      <div>
        <p class="text-h6 text-primary text-bold">
          {{ vendor?.first_name + " " + vendor?.last_name }}
        </p>
        <p class="text-subtitle1 text-bold">
          {{ vendor?.business_name }}
        </p>
        <div class="row items-center gap-100 text-h6">
          <RatingComponent
            :rating="vendor?.avg_rating ? Number(vendor?.avg_rating) : 0"
            size="2rem"
          />
          {{ vendor?.avg_rating || 0 }}
        </div>
        <p>43 Reviews</p>
      </div>
    </div>

    <q-card bordered class="column shadow-9">
      <q-card-section>
        <p class="text-bold text-subtitle1">
          About {{ vendor?.first_name + " " + vendor?.last_name }}
        </p>
        <br />
        <p class="text-body1" style="max-width: 500px">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
          dolore sint tenetur, in aliquid debitis consectetur facilis ipsa
          doloribus sit.
        </p>
      </q-card-section>
    </q-card>

    <h6 class="text-bold">
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
      <div style="max-width: 700px">
        <h5>Reviews & Rating</h5>

        <div>
          <RatingComponent
            :rating="vendor?.avg_rating ? Number(vendor?.avg_rating) : 0"
          /><span class="text-h5"
            >{{ vendor?.avg_rating || 0 }} out of 5 | 28 Reviews</span
          >
        </div>
        <br />
        <q-btn
          color="primary"
          @click="
            () => {
              if (user) {
                modal.togel('WebAddReview', {
                  type: 'vendor',
                  vendorId: vendor?.id,
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
      <br />

      <div class="row justify-start">
        <q-btn right flat color="primary" class="normalcase text-h6"
          >View all Reviews</q-btn
        >
      </div>
    </div>
    <div class="col-12 col-md-8">
      <div v-if="reviewsPending">
        <SkeletonBase type="list" v-for="i in 5" />
      </div>
      <div v-if="reviews?.data.length! < 1" class="text-subtitle1">
        <q-icon name="info" class="text-primary" size="20px" /> This Service
        dont have any reviews yet
      </div>
      <div v-for="review in reviews?.data" class="row q-gutter-md">
        <CustomerReview :review="review" />
      </div>
      <br />
      <br />
      <br />
    </div>
  </div>
</template>
