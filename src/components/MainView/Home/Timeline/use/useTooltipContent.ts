import { MaskedTimeline, LogType } from 'src/types/root';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useTooltipContent = (tl: MaskedTimeline) => {
  const makeContent = () => {
    if (tl.timeline.log_type === LogType.Review) {
      const review = tl.review
      if (!review) return ''
      if (review) {
        return `得点: ${review.tokuten ?? review.okazu_tokuten ?? review.before_tokuten ?? 0}\n一言: ${review.hitokoto ?? review.before_hitokoto ?? ''}\n${review.memo ? '長文感想(' + review.memo.length.toString() + ')' : ''}`
      }
    }
    if (tl.timeline.log_type === LogType.Play) {
      const game = tl.game
      return `中央値: ${game.median ?? 0}\n標準偏差: ${game.stdev ?? 0}\nデータ数: ${game.count2 ?? 0}\n発売日: ${game.sellday ?? '2030-03-31'}`
    }
    return ''
  }
  return { makeContent }
}

export default useTooltipContent