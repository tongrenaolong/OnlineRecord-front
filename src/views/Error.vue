<template>
  <h1>{{ msg }}</h1>
  <h1>error</h1>
</template>
    
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route.params);
const msg = route.params.msg;
</script>
    
<style>
</style>