<script setup lang="ts">
const tab = ref("Accepted Proposal");
</script>

<template>
  <div class="q-pa-md q-pa-md-lg q-pa-lg-xl q-gutter-md">
    <div>
      <NuxtLink :to="routes.service_requirement">
        <q-icon name="keyboard_backspace" size="30px"></q-icon> Go Back
      </NuxtLink>
    </div>
    <h2 class="text-h5 text-bold q-sm">Lorem ipsum dolor sit amet.</h2>
    <div class="q-gutter-xs">
      <div>Hourly: &#x20B9;50 to &#x20B9;60</div>
      <p class="row items-center">
        Posted Yesterday |
        <q-icon name="location_on" size="20px" color="primary"></q-icon>
        Jarkhand, India
      </p>
      <p>
        Category :
        <NuxtLink :to="routes.home" class="underline">Pest Control</NuxtLink>
      </p>
      <p>
        Status :
        <q-badge color="green" outline>Completed</q-badge>
      </p>
    </div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis est
      eos dolores nostrum quos corporis sunt quam debitis veritatis aspernatur?
    </p>
    <div class="" style="max-width: 95vw">
      <q-tabs
        dense
        v-model="tab"
        class="text-grey q-mt-md"
        active-color="white"
        indicator-color="secondary"
        active-bg-color="primary"
        align="start"
      >
        <q-tab name="Accepted Proposal" label="Accepted Proposal" />
        <q-tab name="Proposals Recieved" label="Proposals Recieved" />
      </q-tabs>
      <q-separator />

      <q-tab-panels class="q-pa-0 bg-nutral" v-model="tab" animated>
        <q-tab-panel name="Accepted Proposal">
          <div class="row">
            <WebProposalCard :accepted="true" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="Proposals Recieved">
          <div class="q-gutter-y-md">
            <div class="row justify-end q-gutter-sm">
              <q-btn color="secondary" outline icon="filter_alt" left
                >Top Ratted</q-btn
              ><q-btn color="secondary" outline icon="filter_alt" left
                >Lowest Price</q-btn
              >
            </div>
            <WebProposalCard v-for="p in 10" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
