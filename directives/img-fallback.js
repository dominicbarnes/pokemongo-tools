
export default {
  bind (el, binding) {
    const fallback = binding.value
    el.onerror = () => {
      el.src = fallback
    }
  }
}
