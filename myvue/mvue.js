import mVue from './instance/index'
import { initGlobalAPI } from './global-api/index'

initGlobalAPI(mVue)

mVue.version = '__VERSION__'

export default mVue
