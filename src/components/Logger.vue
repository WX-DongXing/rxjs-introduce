<template>
  <div class="logger">
    <div class="logger__bar">
      <p>日志</p>
      <a-icon type="delete" @click="clear" />
    </div>
    <div class="logger__content" ref="content">

      <div class="logger__row" v-for="log in logs" :key="log.id">
        <a-tag :color="colorMap.get(log.type)">
          {{ log.sign }}
        </a-tag>
        <p style="margin-right: 8px">{{ log.createTime }}</p>
        <p>{{ log.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Logger from '@/subject'

const ColorMap = new Map([
  ['info', '#108ee9'],
  ['danger', 'rgb(255, 85, 0)'],
  ['warning', '#faad14']
])

export default {
  name: 'Logger',
  data: () => ({
    logger: new Logger(),
    colorMap: ColorMap,
    logs: []
  }),
  methods: {
    clear () {
      this.logs = []
    }
  },
  mounted () {
    this.logger.obs.asObservable()
      .subscribe(log => {
        this.logs.push(log)
        setTimeout(() => {
          this.$refs.content.scrollTop = this.$refs.content.scrollHeight
        }, 0)
      })
  }
}
</script>

<style scoped lang="less">
.logger {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  background: #3b3b47;

  &__bar{
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #000;
    padding: 0 16px;
    color: rgba(255, 255, 255, 0.85);

    p {
      margin: 0;
    }

    i {
      cursor: pointer;

      &:hover {
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  &__content {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    height: calc(100vh - 104px);
    overflow: auto;
  }

  &__row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 25px;
    margin: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.65);

    p {
      margin: 0;
    }
  }

  & span {
    min-width: 54px;
  }
}
</style>
