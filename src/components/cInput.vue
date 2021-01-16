<template>
  <input class="input" @input="onInput" :placeholder="placeholder" :value="_value" :maxlength="maxlength" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class extends Vue {
  private _value = ''

  @Prop({ default: '' }) private placeholder!: string
  @Prop({ default: '' }) private value!: string
  @Prop({ default: -1 }) private maxlength!: number

  created() {
    this._value = this.value
  }

  @Emit('input')
  onInput(event: UniEvent) {
    return event.detail.value
  }
}
</script>
<style scoped>
.input {
  width: 686rpx;
  height: 100rpx;
  background: #f5f6fa;
  border-radius: 16rpx;
  margin: 0 32rpx;
  font-size: 34rpx;
  color: #818181;
  box-sizing: border-box;
  padding: 0 48rpx;
  display: flex;
  align-items: center;
}
</style>
