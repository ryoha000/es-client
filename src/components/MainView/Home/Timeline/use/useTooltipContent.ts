import { MaskedTimeline, LogType } from 'src/types/root';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useTooltipContent = (tl: MaskedTimeline) => {
  const makeContent = () => {
    if (tl.timeline.log_type === LogType.Review) {
      const review = tl.review
      if (!review) return ''
      if (review.tokuten) {
        return `得点: ${review.tokuten}\n一言: ${review.hitokoto ?? '未登録'}\n${review.memo ? '長文感想(' + review.memo.length.toString() + ')' : ''}`
      }
      if (review.before_hitokoto) {
        return `発売前得点: ${review.before_tokuten ?? '未登録'}\n発売前一言: ${review.before_hitokoto}`
      }
      return '詳細未登録'
    }
    const game = tl.game
    return `中央値: ${game.median ?? 0}\n標準偏差: ${game.stdev ?? 0}\nデータ数: ${game.count2 ?? 0}\n発売日: ${game.sellday ?? '未定'}`
  }
  return { makeContent }
}

export default useTooltipContent