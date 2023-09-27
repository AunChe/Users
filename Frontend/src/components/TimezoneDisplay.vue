<script setup>
const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const timezone = Timezone;

</script>

<template>
    <div class="flex w-1/2 items-center space-x-2">
      <p class="text-lg font-semibold text-black">Date/Time show in Timezone:</p>
      <p class="text-blue-600">{{ timezone }}</p>
    </div>
</template>
  
