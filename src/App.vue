<template>
  <div id="app">
    <a-layout>
      <a-layout-header :style="{ background: '#23232e', padding: '0 24px', borderBottom: '1px solid rgba(0, 0, 0, 1)' }">

      <a-row>

        <router-link to="/console/observable">
          <a-button type="primary" ghost>可观察对象</a-button>
        </router-link>

        <router-link to="/console/operators">
          <a-button type="primary" ghost>操作符</a-button>
        </router-link>

        <router-link to="/playground/draggable">
          <a-button type="primary" ghost>拖拽</a-button>
        </router-link>

      </a-row>

      </a-layout-header>
    </a-layout>
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  width: 100vw;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #23232e;
}

a + a {
  margin-left: 24px;
}

/*控制整个滚动条*/
::-webkit-scrollbar {
  background-color: rgb(35, 35, 46);
  width: 6px;
  height: 6px;
  background-clip: padding-box;
}

/*滚动条两端方向按钮*/
::-webkit-scrollbar-button {
  height: 0;
  width: 0;
}

/*滚动条中间滑动部分*/
::-webkit-scrollbar-thumb {
  background-color: #b9b9bd;
  border-radius: 5px;
}
</style>
