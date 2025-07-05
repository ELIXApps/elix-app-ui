<template>
  <PageWrapper title="View Customers">
    <template #default>
      <ViewCustomers />
    </template>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageWrapper from '@/components/common/PageWrapper.vue';
import ViewCustomers from '@/components/customer/ViewCustomers.vue';


</script>