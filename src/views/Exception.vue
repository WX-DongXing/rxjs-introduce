<template>
  <div class="exception">
    <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <router-link to="/">
          <a-button type="primary">
            返回首页
          </a-button>
        </router-link>
      </template>
    </a-result>
  </div>
</template>

<script>
export default {
  name: 'Exception'
}
</script>

<style scoped>

</style>
