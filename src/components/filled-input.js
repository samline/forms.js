const ToggleFill = (isFilled, $currentTarget) => {
  const $inputField = $currentTarget.closest('.input-field')

  if (isFilled) {
    $inputField.classList.add('--filled')
    $currentTarget.classList.add('--filled')

    return
  }

  $inputField.classList.remove('--filled')
  $currentTarget.classList.remove('--filled')
}

const FilledInput = $fields => {
  if (!$fields.length > 0) return

  $fields.forEach($field => {
    if ($field.value) ToggleFill(true, $field)

    $field.addEventListener('change', e => {
      if (!e.currentTarget.value) {
        ToggleFill(false, e.currentTarget)

        return
      }

      ToggleFill(true, e.currentTarget)
    })
  })
}

export default FilledInput
