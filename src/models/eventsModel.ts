export interface ListItem {
  eventName: string
  iconSrc: string // id
  iconColor: string // id
  tags: string[]
  openCalc: boolean
  status?: 1 | 0
}

export default {
  addEvent(item: ListItem) {
    const db = getApp<App>().globalData.db
    return db.collection('events').add(item)
  },
}
