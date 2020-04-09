import FocusBlur from './components/focus-blur'
import FilledInput from './components/filled-input'

const sForms = () => {
  const $fields = document.querySelectorAll('input, select, textarea')

  FilledInput($fields)
  FocusBlur($fields)
}

export default sForms
