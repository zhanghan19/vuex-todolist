import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    inputValue: '',
    nextId: 5,
    viewKey: 'all'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 修改inputValue 的值
    setInputValue(state, value) {
      state.inputValue = value
    },
    // 添加列表项
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据 id 删除对应的任务事项
    removeItemById(state, id) {
      const index = state.list.findIndex(item => item.id === id)
      if (index !== -1) {
        state.list.splice(index, 1)
      }
      // state.list = state.list.filter(item => item.id !== id)
    },
    // 复选框状态改变事件
    cbStatusChange(state, id) {
      state.list.forEach(item => {
        if (item.id === id) {
          item.done = !item.done
        }
      })
    },
    // 清除
    clean(state) {
      state.list = state.list.filter(item => item.done === false)
    },
    // 切换列表 显示
    changeList(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成的任务的条数
    unDoneLength(state) {
      // return state.list.filter(item => item.done === true).length
      return state.list.reduce((total, cur) => {
        total += cur.done ? 1 : 0
        return total
      }, 0)
    },
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      } else if (state.viewKey === 'undone') {
        return state.list.filter(item => item.done === false)
      } else if (state.viewKey === 'done') {
        return state.list.filter(item => item.done === true)
      }
      return state.list
    }
  }
})
