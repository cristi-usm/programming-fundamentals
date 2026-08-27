import { defineAppSetup } from '@slidev/types'
import sharedSetup from '../../../common/setup/main'
import '../../../common/theme/style.css'

export default defineAppSetup(({ app }) => {
  sharedSetup({ app })
})
