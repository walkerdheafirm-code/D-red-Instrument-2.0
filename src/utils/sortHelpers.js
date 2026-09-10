export function sortRecordings(recordings, option) {
  const sorted = [...recordings]

  switch (option) {
    case 'az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'za':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }
}

export function combineAndSortRecordings(option = 'newest', ...recordingLists) {
  const combined = recordingLists.flat()
  return sortRecordings(combined, option)
}

