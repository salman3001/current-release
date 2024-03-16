<script setup lang="ts">
const color = ref("primary");
</script>

<template>
  <q-btn-dropdown icon="menu" color="primary" label="Menu">
    <q-list style="">
      <q-item clickable v-ripple :to="routes.home">
        <q-item-section avatar>
          <q-icon color="primary" name="home" />
        </q-item-section>

        <q-item-section> Home </q-item-section>
      </q-item>
      <q-item clickable v-ripple :to="routes.service_requirement">
        <q-item-section avatar>
          <q-icon color="primary" name="dashboard_customize" />
        </q-item-section>

        <q-item-section>Customize Services</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="routes.blogs">
        <q-item-section avatar>
          <q-icon color="primary" name="rss_feed" />
        </q-item-section>
        <q-item-section> View Blogs </q-item-section>
      </q-item>
      <q-item clickable v-ripple :to="routes.about">
        <q-item-section avatar>
          <q-icon color="primary" name="info" />
        </q-item-section>

        <q-item-section> About Us </q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="routes.contact">
        <q-item-section avatar>
          <q-icon color="primary" name="support_agent" />
        </q-item-section>
        <q-item-section> Contact </q-item-section>
      </q-item>
      <q-item clickable v-ripple :to="routes.faqs">
        <q-item-section avatar>
          <q-icon color="primary" name="help" />
        </q-item-section>
        <q-item-section> FAQs </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="$q.dark.toggle()">
        <q-item-section avatar>
          <q-icon name="light_mode" :color="$q.dark.isActive ? 'muted' : 'primary'" />
        </q-item-section>
        <q-item-section> Dark Mode </q-item-section>
      </q-item>

      <!-- <q-separator /> -->
      <!-- <q-item clickable v-close-popup>
          <q-item-section>Recent tabs</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>History</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Downloads</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Help &amp; Feedback</q-item-section>
        </q-item> -->
    </q-list>
  </q-btn-dropdown>
</template>
