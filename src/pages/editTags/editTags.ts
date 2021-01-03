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
  private editValue = ''
  private editId = ''

  onLoad() {
    this.getTagsList()
  }

  async getTagsList() {
    const result = await tagsModel.getList()
    this.tagsList = result.length ? result : []
  }

  async handleSave() {
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
      const { result: { id } } = await tagsModel.addTag(item)
      this.tagsList.push({
        _id: id,
        ...item
      })
      this.tagValue = ''
      showTip('添加成功')
    }
  }

  async handleDelete(_id: string, name: string, index: number) {
    const that = this
    uni.showModal({
      content: `确定删除『${name}』吗？`,
      async success(res) {
        if (res.confirm) {
          const success = await tagsModel.deleteTag(_id)
          if (success) {
            that.tagsList.splice(index, 1)
            showTip('删除成功')
          } else {
            showTip('删除失败，请稍后重试')
          }
        }
      },
    })
  }

  handleEdit(_id: string, name: string) {
    this.showEdit = true
    this.editValue = name
    this.editId = _id
  }

  async handleUpdate(item: ListItem) {
    if (item.name.length > 5) {
      showTip('最多不超过5个字')
    } else if (item.name.length < 1) {
      showTip('标签不为空')
    } else {
      await tagsModel.updateTag(item)
      this.showEdit = false
      showTip('修改成功')
    }
  }

  async handleMove(index: number, upItem: ListItem) {
    if (index !== 0) {
      // 交换index
      const downItem = this.tagsList[index - 1]
      downItem.index = (upItem.index + downItem.index) - (upItem.index = downItem.index)
      await tagsModel.updateTag(upItem)
      await tagsModel.updateTag(downItem)
      // 移动位置
      this.tagsList = swapArray(this.tagsList, index, index - 1)
    } else {
      showTip('已经置顶了')
    }
  }
}
