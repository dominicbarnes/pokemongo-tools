
export default {
  bind (el, binding) {
    const fallback = binding.value
    el.onerror = () => {
      if (el.src === fallback) return
      el.src = fallback
    }
  }
}
