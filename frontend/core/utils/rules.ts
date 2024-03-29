import * as methods from "@vuelidate/validators";

const rules = {
  is(value: string, message: string | undefined | boolean) {
    message = message !== undefined ? message : false;
    return (val: string | number) => {
      let result;
      switch (typeof value) {
        case "string":
          result = String(val) === value;
          break;
        case "number":
          result = Number(val) === value;
          break;
        default:
          result = val === value;
      }
      return result || message;
    };
  },
  required(message: string | boolean = false) {
    return (val: string | number) =>
      methods.required.$validator(val) || message;
  },
  requiredIf(ref: string, message: string | boolean = false) {
    return (val: string | number) =>
      methods.requiredIf(ref).$validator(val) || message;
  },
  requiredUnless(ref: string, message: string | boolean = false) {
    return (val: string | number) =>
      methods.requiredUnless(ref).$validator(val) || message;
  },
  minLength(length: number, message: string | boolean = false) {
    return (val: string | number) =>
      methods.minLength(length).$validator(val) || message;
  },
  maxLength(length: number, message: string | boolean = false) {
    return (val: string | number) =>
      methods.maxLength(length).$validator(val) || message;
  },
  minValue(value: number, message: string | boolean = false) {
    return (val: string | number) =>
      methods.minValue(value).$validator(val) || message;
  },
  maxValue(value: number, message: string | boolean = false) {
    return (val: string | number) =>
      methods.maxValue(value).$validator(val) || message;
  },
  between(min: number, max: number, message: string | boolean = false) {
    return (val: string | number) =>
      methods.between(min, max).$validator(val) || message;
  },
  alpha(message: string | boolean = false) {
    return (val: string | number) => methods.alpha.$validator(val) || message;
  },
  alphaNum(message: string | boolean = false) {
    return (val: string | number) =>
      methods.alphaNum.$validator(val) || message;
  },
  numeric(message: string | boolean = false) {
    return (val: string | number) => methods.numeric.$validator(val) || message;
  },
  integer(message: string | boolean = false) {
    return (val: string | number) => methods.integer.$validator(val) || message;
  },
  decimal(message: string | boolean = false) {
    return (val: string | number) => methods.decimal.$validator(val) || message;
  },
  email(message: string | boolean = false) {
    return (val: string | number) => methods.email.$validator(val) || message;
  },
  ipAddress(message: string | boolean = false) {
    return (val: string | number) =>
      methods.ipAddress.$validator(val) || message;
  },
  // macAddress(separator = ":", message:string|boolean = false) {
  //   return (val:string|number) => methods.macAddress.$validator(separator)(val) || message;
  // },
  url(message: string | boolean = false) {
    return (val: string | number) => methods.url.$validator(val) || message;
  },
  or(...args: any) {
    let message: string | boolean = false;
    if (typeof args[args.length - 1] === "string") {
      message = args.pop();
    }
    return (val: string | number) =>
      methods.or(...args).$validator(val) || message;
  },
  and(...args: any) {
    let message: string | boolean = false;
    if (typeof args[args.length - 1] === "string") {
      message = args.pop();
    }
    return (val: string | number) =>
      methods.and(...args).$validator(val) || message;
  },
  not(rule: any, message: string | boolean = false) {
    return (val: string | number) =>
      methods.not(rule).$validator(val) || message;
  },
  sameAs(locator: string, message: string | boolean = false) {
    return (val: string | number) => val == locator || message;
  },

  unique: async (url: string, field: string, value: string, skip?: string) => {
    if (value === null || value === "") {
      return true;
    }
    if (skip && skip === value) {
      return true;
    }

    try {
      const res = await $fetch(url, {
        params: {
          field: field,
          value: value,
        },
      });
      if (res) {
        return true;
      }
    } catch (error: any) {
      return false;
    }
  },

  slug: async (value: string) => {
    if (value === null || value === "") {
      return true;
    }
    if (value.includes(" ")) {
      return false;
    }
    if (["*", "?", "@", "!", "$", "%", "^", "&", "*"].includes(value)) {
      return false;
    }
    return true;
  },
};

export default rules;
