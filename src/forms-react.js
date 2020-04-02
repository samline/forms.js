import * as c from './console'

const secureKeys = [
  'Backspace',
  'Escape',
  'Enter',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'ArrowDown',
  ' ',
  'SPACE',
  'Space',
  'CapsLock',
  'Shift',
  'Meta',
  'Alt',
  'Control',
  'Tab',
]

const formatBytes = (bytes, decimals) => {
  if (bytes === 0)
    return '0 Bytes'

  const labels = [
    'Bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB'
  ]
  const B   = 1024
  const dec = decimals <= 0 ? 0 : decimals || 2
  const i   = Math.floor(Math.log(bytes) / Math.log(B))

  bytes = parseFloat((bytes / Math.pow(B, i)).toFixed(dec)) + ' ' + labels[i]

  return bytes
}

const ifFieldIsEmpty = ($target, value, parentClass) => {
  parentClass = '.' + parentClass

  if (!$target.closest(parentClass))
    return false

  if ($target.value === "" || $target.value === null || $target.value === 'undefined') {
    $target.closest(parentClass).classList.remove('filled')
    $target.classList.remove('filled')

    return false
  }

  $target.closest(parentClass).classList.add('filled')
  $target.classList.add('filled')
}

const ifFocus = ($target, parentClass) => {
  if (!$target.closest(parentClass))
    return false

  $target.closest(parentClass).classList.add('focus')
}

const ifBlur = ($target, parentClass) => {
  if (!$target.closest(parentClass))
    return false

  $target.closest(parentClass).classList.remove('focus')
}

const ifFieldIsNumeric = (e, $target, key) => {
  if (!$target.hasAttribute('numeric'))
    return false

  if (
    e.metaKey && e.code == 'KeyC' || e.ctrlKey && e.code == 'KeyC' ||
    e.metaKey && e.code == 'KeyV' || e.ctrlKey && e.code == 'KeyV' ||
    e.metaKey && e.code == 'KeyX' || e.ctrlKey && e.code == 'KeyX'
    )
    return false

  if (secureKeys.indexOf(key) >= 0)
    return false

  const validate = /^([0-9\.\,\-])$/.test(key)

  if (!validate)
    e.preventDefault()
}

const ifFieldIsDigits = (e, $target, key) => {
  if (!$target.hasAttribute('digits'))
    return false

  if (
    e.metaKey && e.code == 'KeyC' || e.ctrlKey && e.code == 'KeyC' ||
    e.metaKey && e.code == 'KeyV' || e.ctrlKey && e.code == 'KeyV' ||
    e.metaKey && e.code == 'KeyX' || e.ctrlKey && e.code == 'KeyX'
    )
    return false

  if (secureKeys.indexOf(key) >= 0)
    return false

  const validate = /^([0-9])$/.test(key)

  if (!validate)
    e.preventDefault()
}

const ifFieldIsFile = ($target) => {
  if ($target.getAttribute('type') !== 'file')
    return false

  const displayKeys = [
    'name',
    'size',
    'type'
  ]
  let   display = $target.getAttribute('display') || 'name'

  if (displayKeys.indexOf(display) <= -1) {
    c.error('Forms', '"'+ display + '" is not a valid value')

    return false
  }

  const $label = $target.previousElementSibling || $target.nextElementSibling

  if ($target.value === '' || $target.value === null || $target.value === 'undefined' && $label !== null) {
    ($label.hasAttribute('default-label')) ? $label.innerHTML = $label.getAttribute('default-label') : null

    return false
  }

  let displayLabel = $target.files[0][display]

  if (display === 'size')
    displayLabel = formatBytes(displayLabel, 0)

  if ($target.hasAttribute('multiple'))
    displayLabel = ifFieldIsFileMultiple($target, $label, display) || displayLabel

  if (!$label.hasAttribute('default-label'))
    $label.setAttribute('default-label', $label.innerHTML)

  $label.innerHTML = displayLabel
}

const ifFieldIsFileMultiple = ($target, $label, display) => {
  let   displayLabel
  const filesLength = $target.files.length

  if (display === 'size') {
    let sizes = 0

    for (let i = 0; i < filesLength; i++) {
      sizes = $target.files[i][display] + sizes
    }

    return formatBytes(sizes, 0)
  }

  if (filesLength > 1) {
    const lang = document.querySelector('html').getAttribute('lang') || 'en'
    let filesLabel = (lang === 'es') ? 'archivos' : 'files'

    return filesLength + ' ' + filesLabel
  }

  return false
}

const ifFieldIsCurrency = (e = null, $target) => {
  if (!$target.hasAttribute('currency'))
    return false

  if (e !== null && e.which === 110 || e !== null && e.which === 190)
    return false

  //Function
  const format = (num) => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const string = parseFloat($target.value.replace(/\,/g,''), 10)
  const parseCurrency = string.toLocaleString('es-MX')

  if (parseCurrency === "NaN")
    return false

  $target.value = format(parseCurrency)
  $target.dispatchEvent(new Event('change'))
}

const preventMultipleSubmit = (e, $form) => {
  $form.querySelector('button[type="submit"]').setAttribute('disabled', '1')

  setTimeout(() => {
    $form.querySelector('button[type="submit"]').removeAttribute('disabled')
  }, 2000)
}

const ifAutoSubmit = ($target) => {
  if (!$target.hasAttribute('auto-submit'))
    return false

  let $parentForm = $target.parentNode

  do {
    $parentForm = $parentForm.parentNode

    if ($parentForm.tagName === 'FORM') {
      $parentForm.submit()

      return true
    }
  }
  while($parentForm.tagName !== 'FORM' && $parentForm.tagName !== 'HTML')

  msg.error('Forms', 'Closest form missing')

  return false
}

const ifAutoLink = ($target) => {
  if (!$target.hasAttribute('auto-link'))
    return false

  window.location.href = $target.value
}

class forms {
  process(parentClass) {
    const $fields = document.querySelectorAll('input, select, textarea')

    if ($fields.length <= 0 || $fields === null || typeof $fields === 'undefined')
      return false

    $fields.forEach(($item, i) => {
      ifFieldIsCurrency(null, $item)
      ifFieldIsEmpty($item, $item.value, parentClass)
      ifFieldIsFile($item)

      $fields[i].addEventListener('keydown', (e) => {
        ifFieldIsNumeric(e, e.target, e.key)
        ifFieldIsDigits(e, e.target, e.key)
      })
      $fields[i].addEventListener('keyup', (e) => {
        ifFieldIsCurrency(e, e.target)
      })
      $fields[i].addEventListener('change', (e) => {
        ifFieldIsFile(e.target)
        ifFieldIsEmpty(e.target, e.target.value, parentClass)
        ifAutoSubmit(e.target)
        ifAutoLink(e.target)
      })
      $fields[i].addEventListener('focus', (e) => {
        ifFocus(e.target, '.' + parentClass)
      })
      $fields[i].addEventListener('blur', (e) => {
        ifBlur(e.target, '.' + parentClass)
      })
    })

    document.querySelectorAll('form').forEach(($form) => {
      $form.addEventListener('submit', (e) => {
        preventMultipleSubmit(e, e.target)
      })
    })
  }
  init(parentClass = 'input-field') {
    this.process(parentClass)
  }
}

export default forms
