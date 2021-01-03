<template>
  <view class="page">
    <view class="tag-item-container" v-for="(item,index) in tagsList" :key="index">
      <view class="edit-content flex" v-if="showEdit && editId === item._id">
        <input type="text" placeholder="请输入标签" v-model="item.name">
        <view class="action-btn text-sm bg-theme" @click="handleUpdate(item)">确认修改</view>
        <view class="action-btn text-sm bg-red" @click="showEdit = false">取消</view>
      </view>
      <view class="tag-content flex" v-else>
        <view>
          <text class="margin-right">{{item.name}}</text>
          <text class="text-grey text-sm">含{{item.eventNumber}}项</text>
        </view>
        <view class="handle-container">
          <text class="margin-right text-red" @click="handleDelete(item._id, item.name, index)">删除</text>
          <text class="margin-right text-grey" @click="handleEdit(item._id, item.name)">编辑</text>
        </view>
        <img class="icon-move-up" src="@/static/edit-tags-move-up.png" @click="handleMove(index, item)" />
      </view>
    </view>

    <view class="tag-item-container flex">
      <input type="text" placeholder="请输入标签" v-model="tagValue">
      <view class="action-btn text-sm bg-theme" @click="handleSave">保存</view>
    </view>
  </view>
</template>

<script lang="ts" src="./editTags.ts"></script>
<style src="./editTags.css" scoped></style>
