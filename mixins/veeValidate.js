import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/en.json'

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule],
    message: messages[rule]
  })
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    validateAllFields () {
      return this.$refs.observer.validate()
    }
  }
}