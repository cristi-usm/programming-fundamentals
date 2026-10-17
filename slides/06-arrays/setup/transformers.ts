// v-click survives only in the lesson currently being taught; every other deck
// gets its reveals flattened. See common/setup/transformers.ts.
import { clicksForCurrentLessonOnly } from '../../../common/setup/transformers'

export default clicksForCurrentLessonOnly(import.meta.dirname)
