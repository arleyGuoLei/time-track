<template>
  <view class="page">
    <c-loading ref="loading" />

    <c-header showBack title="新增事件" imgSrc="http://img.i7xy.cn/20201220134440.png" />

    <c-list>
      <view class="list-content">
        <text class="list-title">新增事件</text>

        <c-title title="事件名称" />
        <c-input placeholder="输入 (例如: 看电影)" v-model="eventName" />

        <c-title title="图标设置" />
        <icon-setting
          :iconSrc="iconSrc.src"
          :iconColor="iconColor.color"
          @initIcon="onInitIcon"
          @selectIconSrc="onSelectIconSrc"
          @selectIconColor="onSelectIconColor"
        />

        <c-title title="标签设置 (可多选)">
          <view slot="right" class="tag-edit">
            <router-link @click="onEditTag" to="/pages/editTags/editTags">
              <img src="@/static/tag-edit.png" />
              <text>编辑标签</text>
            </router-link>
          </view>
        </c-title>

        <block v-for="(item, index) in tags" :key="item.id">
          <c-select :title="item.name" :value="item.selected" @change="onTagSelectChange(index)" />
        </block>

        <view class="tag-blank margin-top" v-if="tags.length === 0">
          <img class="blank-img margin-bottom-sm" src="@/static/blank2.png" />
          <text class="text-sm text-grey">无任何标签</text>
        </view>

        <c-title title="其他设置" />
        <c-select title="开启量化值 (打点数据求和)" :value="openCalc" @change="onCalcSelectChange" />

        <button class="save" @click="onSave">保 存</button>
      </view>
    </c-list>
  </view>
</template>

<script lang="ts" src="./addEvent.ts"></script>
<style src="./addEvent.css" scoped></style>
