import { Ref } from '@vue/composition-api';
import { PostReviewForm } from 'src/lib/erogameScapeApi';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useReviewForm = () => {
  const setupForm = <T>(
    ...args: { key: string, value: Ref<T> }[]
  ): PostReviewForm[] => {
    const forms: PostReviewForm[] = []
    for (const element of args) {
      if (typeof element.value.value === 'boolean' && element.value.value) {
        forms.push({ key: element.key, value: 'on' })
        continue
      }
      if (typeof element.value.value === 'number' && element.value.value !== 0) {
        forms.push({ key: element.key, value: `${element.value.value}` })
        continue
      }
      if (typeof element.value.value === 'string' && element.value.value.length !== 0) {
        forms.push({ key: element.key, value: `${element.value.value}` })
        continue
      }
    }
    return forms
  }
  return { setupForm }
}

export default useReviewForm