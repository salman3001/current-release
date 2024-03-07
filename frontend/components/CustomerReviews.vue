<template>
  <div style="max-width: 500px" class="q-gutter-xl col-12 col-md-8">
    <div v-for="i in 10" class="q-gutter-sm">
      <div class="row items-center q-col-gutter-sm">
        <div class="row items-start q-gutter-sm" style="max-width: max-content">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div>
            <span>Sara Jacob</span>
            <RatingComponent :rating="4.5" size="1.1rem" />
            <p class="text-muted">
              Reviewed on 12/3/2024 12:24pm |
              <q-badge class="text-bold" color="primary" outline
                >Verified purchase</q-badge
              >
            </p>
          </div>
        </div>
      </div>
      <p class="text-muted">
        Lorem ipsum dolor sit amet.lorem10. Lorem ipsum dolor sit amet.lorem10.
        Lorem ipsum dolor sit amet.lorem10. Lorem ipsum Lorem ipsum dolor sit
        amet.lorem10. Lorem ipsum dolor sit amet.lorem10. Lorem ipsum psum dolor
        sit amet.lorem10. Lorem ipsum
      </p>
    </div>
    <q-btn color="primary">View More</q-btn>
  </div>
</template>
