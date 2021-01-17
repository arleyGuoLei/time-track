<template>
  <view class="page">
    <c-loading ref="loading" />

    <view class="tag-item-container" v-for="(item, index) in tagsList" :key="index">
      <view class="edit-content flex" v-if="showEdit && editId === item._id">
        <input class="text input" type="text" placeholder="请输入标签" focus v-model="item.name" />
        <view class="action-btn text-sm bg-theme text-sm margin-right" @click="onUpdate(item)">确认修改</view>
        <view class="action-btn text-sm bg-red text-sm" @click="showEdit = false">取 消</view>
      </view>
      <view class="tag-content flex" v-else>
        <view class="flex">
          <text class="margin-right text">{{ item.name }}</text>
          <text class="text-grey text-sm">含{{ item.eventNumber }}项</text>
        </view>
        <view class="handle-container">
          <text class="margin-right text-red text-sm" @click="onDelete(item._id, item.name, index)">删除</text>
          <text class="margin-right text-grey text-sm" @click="onEdit(item._id)">编辑</text>
        </view>
        <img class="icon-move-up" src="@/static/edit-tags-move-up.png" @click="onMove(index, item)" />
      </view>
    </view>

    <view class="tag-item-container flex">
      <input class="text" type="text" placeholder="请输入标签" v-model="tagValue" />
      <view class="action-btn text-sm bg-theme text-sm" @click="onSave">保 存</view>
    </view>
  </view>
</template>

<script lang="ts" src="./editTags.ts"></script>
<style src="./editTags.css" scoped></style>
