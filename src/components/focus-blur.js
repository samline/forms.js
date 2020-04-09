const ToggleFocus = (isFocused, $currentTarget) => {
  const $inputField = $currentTarget.closest('.input-field')

  if (isFocused) {
    $inputField.classList.add('--focused')
    $currentTarget.classList.add('--focused')

    return
  }

  $inputField.classList.remove('--focused')
  $currentTarget.classList.remove('--focused')
}

const FocusBlur = $fields => {
  if (!$fields.length > 0) return

  $fields.forEach($field => {

    $field.addEventListener('focus', e => {
      ToggleFocus(true, e.currentTarget)
    })

    $field.addEventListener('blur', e => {
      ToggleFocus(false, e.currentTarget)
    })
  })
}

export default FocusBlur
