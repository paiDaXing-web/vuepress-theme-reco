import { useRouter, useRoute, NavigationHookAfter } from 'vue-router'
import { watch, ref, onMounted, onUnmounted, toRefs } from 'vue'
import { useInitCopyBtn } from '@vuepress-reco/vuepress-plugin-code-copy/lib/client/composables/initCopyBtn'
import { RecoThemePageData } from '../../../types'
import { useScrollDirection, useThemeLocaleData } from '../../composables'

export function useSidebar(toggleSidebar, toggleMobileMenus) {

  // close sidebar after navigation
  let unregisterRouterHook

  onMounted(() => {
    const router = useRouter()
    const { direction } = useScrollDirection()
    unregisterRouterHook = router.afterEach((to, from) => {
      if (to.path !== from.path) {
        toggleSidebar(false)
        toggleMobileMenus(false)

        direction.value = ''
      }
    })
  })

  onUnmounted(() => {
    unregisterRouterHook()
  })
}

const SITE_PASSWORD_PASS = 'SITE_PASSWORD_PASS'
export function usePassword() {
  const themeLocal = useThemeLocaleData()
  const sitePasswordPass = ref(true)
  onMounted(() => {
    let sitePasswordPassCache = 'true'

    // @ts-ignore
    if (!__VUEPRESS_SSR__) {
      sitePasswordPassCache = sessionStorage.getItem(SITE_PASSWORD_PASS) as string
    }

    if (themeLocal.value.password && sitePasswordPassCache !== 'true') {
      sitePasswordPass.value = false
    }
  })



  const handlePass = () => {
    sitePasswordPass.value = true

    // @ts-ignore
    if (!__VUEPRESS_SSR__) {
      sessionStorage.setItem(SITE_PASSWORD_PASS, 'true')
    }
  }

  return { sitePasswordPass, handlePass }
}

export function useInitCodeCopy() {
  const route = useRoute()
  const { path } = toRefs(route)
  const { initCopyBtn } = useInitCopyBtn()

  watch(path, () => {
    setTimeout(() => {
      initCopyBtn()
    }, 1000)
  })
}
