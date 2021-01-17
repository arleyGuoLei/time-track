import { Component, Vue } from 'vue-property-decorator'
import { tagsModel } from './../../models'
import { showTip } from '../../utils/utils'
import { ListItem } from '@/models/tagsModel'

function swapArray(list: ListItem[], upIndex: number, downIndex: number) {
  list[upIndex] = list.splice(downIndex, 1, list[upIndex])[0]
  return list
}

@Component({
  components: {},
})
export default class extends Vue {
  private tagsList: ListItem[] = []
  private showEdit = true
  private tagValue = ''
  private editId = ''

  onLoad() {
    this.$nextTick(() => {
      ;(this as any).$loading('getTagsList', this.getTagsList.bind(this))
    })
  }

  async getTagsList() {
    const result = await tagsModel.getList()
    this.tagsList = result.length ? result : []
  }

  async onSave() {
    if (this.tagValue.length > 5) {
      showTip('最多不超过5个字')
    } else if (this.tagValue.length < 1) {
      showTip('标签不为空')
    } else {
      const item = {
        name: this.tagValue,
        index: this.tagsList.length + 1,
        eventNumber: 0,
      }
      const {
        result: { id },
      } = await (this as any).$loading('addTag', tagsModel.addTag.bind(this), false, '保存中', item)
      this.tagsList.push({
        _id: id,
        ...item,
      })
      this.tagValue = ''
      showTip('添加成功')
    }
  }

  async onDelete(_id: string, name: string, index: number) {
    uni.showModal({
      content: `确定删除『${name}』吗？`,
      success: async res => {
        if (res.confirm) {
          await (this as any).$loading('deleteTag', tagsModel.deleteTag.bind(this), false, '删除中', _id)
          this.tagsList.splice(index, 1)
          showTip('删除成功')
        }
      },
    })
  }

  onEdit(_id: string) {
    this.showEdit = true
    this.editId = _id
  }

  async onUpdate(item: ListItem) {
    if (item.name.length > 5) {
      showTip('最多不超过5个字')
    } else if (item.name.length < 1) {
      showTip('标签不为空')
    } else {
      await (this as any).$loading('updateTag', tagsModel.updateTag.bind(this), false, '保存中', item)
      this.showEdit = false
      showTip('修改成功')
    }
  }

  async onMove(index: number, upItem: ListItem) {
    if (index !== 0) {
      // 交换index
      const downItem = this.tagsList[index - 1]
      downItem.index = upItem.index + downItem.index - (upItem.index = downItem.index)
      tagsModel.updateTag(upItem)
      tagsModel.updateTag(downItem)
      // 移动位置
      this.tagsList = swapArray(this.tagsList, index, index - 1)
    } else {
      showTip('已经置顶了')
    }
  }

  onUnload() {
    uni.$emit('onTagsChange', { tagList: this.tagsList })
  }
}
