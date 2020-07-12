import { ListInServer, PostListStruct } from "src/types/root"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const usePostListStruct = () => {
  const fromList = (list: ListInServer): PostListStruct => {
    return {
      name: list.name,
      comment: list.comment,
      url: list.url,
      isPublic: list.is_public,
      priority: list.priority
    }
  }
  return { fromList }
}

export default usePostListStruct