<template>
  <div class="draggable" ref="board">
    <a-row :gutter="16" class="draggable__container">
      <a-col :span="14" class="draggable__content">

        <div class="draggable__fence">

          <div class="draggable__item  draggable__item--lighten" ref="single">
            <p>Single</p>
          </div>

          <div class="draggable__item" ref="distribute">
            <p>Distribute</p>
          </div>

        </div>

      </a-col>
      <a-col :span="10" class="draggable__code">

        <code-panel title="single">
          {{ singleCode }}
        </code-panel>

        <code-panel title="distribute">
          {{ distributeCode }}
        </code-panel>

      </a-col>
    </a-row>
  </div>
</template>

<script>
import { fromEvent } from 'rxjs'
import { mergeMap, takeUntil, takeWhile, tap, map } from 'rxjs/operators'
import anime from 'animejs'
import CodePanel from '@/components/CodePanel'

export default {
  name: 'Draggable',
  components: {
    CodePanel
  },
  data: () => ({
    isActive: true,
    cloneNode: null,
    singleCode: `   // single元素鼠标按下事件
    const singleMouseDown$ = fromEvent(this.$refs.single, 'mousedown')
    // 全局 mousemove 事件
    const documentMove$ = fromEvent(document, 'mousemove')
    // 全局 mouseup 事件
    const documentUp$ = fromEvent(document, 'mouseup')

    singleMouseDown$.pipe(
      takeWhile(() => this.isActive),
      tap(event => event.preventDefault()),
      mergeMap(() => documentMove$.pipe(takeUntil(documentUp$))),
      map(event => ({ x: event.clientX, y: event.clientY }))
    )
      .subscribe(({ x, y }) => {
        anime.set(this.$refs.single, {
          position: 'fixed',
          top: y - 64,
          left: x - 48
        })
      })
    `,
    distributeCode: `   // distribute元素鼠标按下事件
    const distributeMouseDown$ = fromEvent(this.$refs.distribute, 'mousedown')
    // 全局 mousemove 事件
    const documentMove$ = fromEvent(document, 'mousemove')
    // 全局 mouseup 事件
    const documentUp$ = fromEvent(document, 'mouseup')

    distributeMouseDown$.pipe(
      takeWhile(() => this.isActive),
      tap(event => {
        event.preventDefault()
        this.cloneNode = event.target.cloneNode(true)
        const { x, y } = event.target.getBoundingClientRect()
        anime.set(this.cloneNode, {
          position: 'fixed',
          margin: 0,
          top: y,
          left: x
        })
        this.$refs.board.append(this.cloneNode)
      }),
      mergeMap(() => documentMove$.pipe(takeUntil(documentUp$))),
      map(event => ({ x: event.clientX, y: event.clientY }))
    )
      .subscribe(({ x, y }) => {
        anime.set(this.cloneNode, {
          top: y - 48,
          left: x - 48
        })
      })
    `
  }),
  mounted () {
    // single元素鼠标按下事件
    const singleMouseDown$ = fromEvent(this.$refs.single, 'mousedown')
    // distribute元素鼠标按下事件
    const distributeMouseDown$ = fromEvent(this.$refs.distribute, 'mousedown')
    // 全局 mousemove 事件
    const documentMove$ = fromEvent(document, 'mousemove')
    // 全局 mouseup 事件
    const documentUp$ = fromEvent(document, 'mouseup')

    singleMouseDown$.pipe(
      takeWhile(() => this.isActive),
      tap(event => event.preventDefault()),
      mergeMap(() => documentMove$.pipe(takeUntil(documentUp$))),
      map(event => ({ x: event.clientX, y: event.clientY }))
    )
      .subscribe(({ x, y }) => {
        anime.set(this.$refs.single, {
          position: 'fixed',
          top: y - 64,
          left: x - 48,
          zIndex: 1
        })
      })

    distributeMouseDown$.pipe(
      takeWhile(() => this.isActive),
      tap(event => {
        event.preventDefault()
        this.cloneNode = event.target.cloneNode(true)
        const { x, y } = event.target.getBoundingClientRect()
        anime.set(this.cloneNode, {
          position: 'fixed',
          margin: 0,
          top: y,
          left: x
        })
        this.$refs.board.append(this.cloneNode)
      }),
      mergeMap(() => documentMove$.pipe(takeUntil(documentUp$))),
      map(event => ({ x: event.clientX, y: event.clientY }))
    )
      .subscribe(({ x, y }) => {
        anime.set(this.cloneNode, {
          top: y - 48,
          left: x - 48
        })
      })
  },
  beforeDestroy () {
    this.isActive = false
  }
}
</script>

<style scoped lang="less">
.draggable {
  width: 100vw;
  height: calc(100vh - 64px);
  overflow: hidden;

  &__container, &__content, &__code {
    height: calc(100vh - 64px);
  }

  &__code {
    border-left: 1px solid #000;
    overflow: auto;
  }

  &__fence {
    flex: none;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 128px;
    height: 100%;
    border-right: 1px solid #000;
  }

  &__item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 96px;
    width: 96px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.85);
    background: lighten(#3b3b47, 30%);

    &--lighten {
      background: #1890ff;
    }

    p {
      margin: 0;
      pointer-events: none;
    }
  }
}
</style>
