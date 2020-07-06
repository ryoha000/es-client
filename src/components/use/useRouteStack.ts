import { Ref } from '@vue/composition-api'
import { StackType } from '../../types/root'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useRouteStack = (index: Ref<number>, stack: Ref<StackType[]>) => {
  const next = () => {
    if (stack.value.length > index.value + 1) {
      index.value += 1
      console.log('next')
      return
    }
  }
  const back = () => {
    if (stack.value.length > index.value && index.value !== 0) {
      index.value -= 1
      console.log('back')
      return
    }
  }
  const goHome = () => {
    if (stack.value.length <= index.value) {
      stack.value = [{ type: 'Home', id: 0 }]
      index.value = 0
      console.log('home index err')
      return
    }
    if (stack.value[index.value].type === 'Home') {
      console.log('home now')
      return
    }
    if (stack.value.length !== index.value + 1) {
      stack.value.splice(index.value + 1)
      console.log('home not top')
    }
    stack.value.push({ type: 'Home', id: 0 })
    index.value += 1
    console.log('home end')
    return
  }
  const goDetail = (id: number) => {
    if (stack.value.length <= index.value) {
      stack.value = [{ type: 'Game', id: id }]
      index.value = 0
      console.log('game index err')
      return
    }
    if (stack.value[index.value].id === id) {
      console.log('game now')
      return
    }
    if (stack.value.length !== index.value + 1) {
      stack.value.splice(index.value + 1)
      console.log('game not top')
    }
    stack.value.push({ type: 'Game', id: id })
    index.value += 1
    console.log('game end')
    return
  }
  return { next, back, goHome, goDetail }
}

export default useRouteStack