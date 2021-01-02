<template>
  <view class="page">
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
          @selectIconSrc="onSelectIconSrc"
          @selectIconColor="onSelectIconColor"
        />

        <c-title title="标签设置 (可多选)">
          <view slot="right" class="tag-edit">
            <router-link to="/pages/editTags/editTags">
              <img src="@/static/tag-edit.png" />
              <text>编辑标签</text>
            </router-link>
          </view>
        </c-title>

        <block v-for="(item, index) in tags" :key="index">
          <c-select :title="item.name" v-model="item.selected" />
        </block>

        <c-title title="其他设置" />
        <c-select title="开启量化值 (打点数据求和)" v-model="openCalc" />

        <button class="save" @click="onSave">保 存</button>
      </view>
    </c-list>
  </view>
</template>

<script lang="ts" src="./addEvent.ts"></script>
<style src="./addEvent.css" scoped></style>
